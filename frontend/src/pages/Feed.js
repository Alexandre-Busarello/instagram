import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';

import "./Feed.css";

import more from "../assets/more.svg";
import like from "../assets/like.svg";
import comment from "../assets/comment.svg";
import send from "../assets/send.svg";


class Feed extends Component {
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
        const socket = io('http://localhost:3333');

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

    // Metodo responsavel por renderiza o componente
    render() {
        return (
            <section id="post-list">
                { 
                    this.state.feed.map(post => (
                        // Setar uma key com um ID unico faz o react conseguir achar os 
                        // elementos mais rapidamente na DOM e ter uma performance melhor
                        <article key={post._id}>
                            <header>
                                <div className="user-info">
                                    <span>{post.author}</span>
                                    <span className="place">{post.place}</span>
                                </div>
        
                                <img src={more} alt="Mais"></img>
                            </header>
        
                            <img src={`http://localhost:3333/files/${post.image}`} alt=""></img>
        
                            <footer>
                                <div className="actions">
                                    <button type="button" onClick={() => this.handleLike(post._id)}>
                                        <img src={like} alt=""/>
                                    </button>                                    
                                    <img src={comment} alt=""/>
                                    <img src={send} alt=""/>
                                </div>
        
                                <strong>{post.likes} curtidas</strong>
        
                                <p>
                                    {post.description}
                                    <span>{post.hashtags}</span>
                                </p>                       
                            </footer>
                        </article>  
                    ))
                }              
            </section>
        );
    }
}

export default Feed;