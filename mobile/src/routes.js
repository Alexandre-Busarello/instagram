import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { Image } from 'react-native';

import Feed from './pages/Feed';
import New from './pages/New';

import logo from './assets/logo.png';

export default createAppContainer(
    // Posso utilizar outras funcoes para criar a navegacao que pode ter implicacoes visuais na aplicacao
    createStackNavigator({
        Feed,
        New,
    }, {
        //initialRouteName: 'New',
        defaultNavigationOptions: {
            headerTintColor: '#000', // cor do botao de voltar
            headerTitle: <Image style={{ marginHorizontal: 20 }} source={logo} />,
            headerBackTitle: null,
            mode: 'modal' // animacao de baixo pra cima
        }
    })
);