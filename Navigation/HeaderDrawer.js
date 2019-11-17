import React, { Component } from 'react';
import { Text, View, TouchableHighlight, Image, Alert, StatusBar } from 'react-native';
import Button from 'react-native-button';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { Login, Home } from 'thitracnghiem/Navigation/screenName';
import { setItemToAsyncStorage, getItemFromAsyncStorage } from 'thitracnghiem/Function/function';
import LinearGradient from 'react-native-linear-gradient';

export default class HeaderDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userData: {},
            currentUser: null
        };
    }
    async componentDidMount() {
        const { currentUser } = firebase.auth();
        this.setState({ currentUser });
        await setItemToAsyncStorage('currentScreen', Home);
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
         for( var key in userData)
         { 
            this.setState({
                userData:  userData[key]
            }); 
         }            
        });
    }
    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['rgb(86, 123, 248)', 'rgb(95,192,255)']}
                style={{
                    height: 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1E90FF'
                }}
            >
                {
                    this.state.userData ?
                        <Image
                            style={{ width: 50, height: 50 }}
                            source = {{uri: this.state.userData.Image}}
                         
                        /> :
                        <Image
                            style={{ width: 50, height: 50, tintColor: 'white'}}
                            source={require('thitracnghiem/icons/user.png')}
                        />

                }
                  {
                    this.state.userData ?
                <Text style={{ color: 'white' }}>{this.state.userData.Username}</Text> : null
                  }
                    {
                    this.state.userData ?
                <Text style={{ color: 'white' }}>{this.state.userData.Fullname}</Text>  : null
                    }
            </LinearGradient>
        );
    }
}
