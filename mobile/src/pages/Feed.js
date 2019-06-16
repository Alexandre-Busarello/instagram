import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';

import { Text, View, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

import camera from '../assets/camera.png';
import more from "../assets/more.png";
import like from "../assets/like.png";
import comment from "../assets/comment.png";
import send from "../assets/send.png";

export default class Feed extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('New')}>
        <Image source={camera}></Image>
      </TouchableOpacity>
    ),
  });

  // State é utilizado para declarar atributos utilizados no HTML (similar ao $scope do AngularJS)
  state = {
      feed: []
  };

  // Metodo chamado ao carregar o componente
  async componentDidMount() {
      this.registerToSocket();

      const response = await api.get('posts');

      // Seta o estado do componente (isso forca o Render novamente)
      this.setState({
          feed: response.data
      });
  }

  registerToSocket = () => {
    // Abre uma instancia com a API via websock 
    const socket = io('http://10.0.3.2:3333');

    // Registra o tratamento de um evento que sera disparado pelo backend
    socket.on('post', newPost => {
        // Cria um novo feed colocando o post recebido no evento por primeiro e o restante no final
        this.setState({ feed: [newPost, ...this.state.feed] });
    });

    socket.on('like', likedPost => {
        // Transforma a lista de feed atualizando o post do id correspondente e mantem os demais item como estao
        this.setState({ 
            feed: this.state.feed.map(post => post._id === likedPost._id ? likedPost : post)
        });
    });        
  }

  handleLike = id => {
      api.post(`/posts/${id}/like`);
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.state.feed}
          keyExtractor={post => post._id}
          renderItem={({ item }) => (
            <View style={styles.feedItem}>
              <View style={styles.feedItemHeader}>
                <View styles={styles.userInfo}>
                  <Text style={styles.name}>{item.author}</Text>
                  <Text style={styles.place}>{item.place}</Text>
                </View>
                
                <Image source={more}></Image>
              </View>

              <Image style={styles.feedImage} source={{ uri: `http://10.0.3.2:3333/files/${item.image}` }}></Image>

              <View style={styles.feedItemFooter}>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)}>
                    <Image source={like}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => {}}>
                    <Image source={comment}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => {}}>
                    <Image source={send}></Image>
                  </TouchableOpacity> 
                </View>

                <Text style={styles.likes}>{item.likes} curtidas</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.hashtags}>{item.hashtags}</Text>
              </View>
            </View>
          )}>          
        </FlatList>
      </View>
    );
  }
}

// Native sempre utilzia display: flex para estilizacao
const styles = StyleSheet.create({
  container: {
    flex: 1 //Ocupa sempre a largura e altura toda
  },

  feedItem: {
    marginTop: 20
  },

  feedItemHeader: {
    paddingHorizontal: 15,

    flexDirection: 'row', // Posiciona o icone de ... ao lado
    justifyContent: 'space-between', // Joga o icone ... para a direita
    alignItems: 'center', // Alinha o icone ... com o centro do texto
  },

  name: {
    fontSize: 14,
    color: '#000'
  },

  place: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },  

  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 15,
  },

  feedItemFooter: {
    paddingHorizontal: 15,
  },

  actions: {
    flexDirection: 'row'
  },

  action: {
    marginRight: 8
  },

  likes: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000'
  },

  description: {
    lineHeight: 18,
    color: '#000'
  },

  hashtags: {
    color: '#7159c1'
  },
});
