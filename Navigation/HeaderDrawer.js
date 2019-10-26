import React, { Component } from 'react';
import { Text, View, TouchableHighlight, Image, Alert, StatusBar } from 'react-native';
import Button from 'react-native-button';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { Login, Home } from 'SystemManager/Navigation/screenName';
import { setItemToAsyncStorage, getItemFromAsyncStorage } from 'SystemManager/Function/function';
import LinearGradient from 'react-native-linear-gradient';

export default class HeaderDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentItemId: '',
            typedEmail: '',
            shortEmail: '',
            userData: {},
            currentUser: null
        };
    }
    async componentDidMount() {
        const { currentUser } = firebase.auth();
        this.setState({ currentUser });
        await setItemToAsyncStorage('currentScreen', Home);
        const currentItemId = await getItemFromAsyncStorage('currentItemId');
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
            this.setState({
                currentItemId: currentItemId,
                userData: userData
            });
            const shortEmail = this.state.userData.email.split('@').shift();
            this.setState({
                typedEmail: this.state.userData.email,
                shortEmail: shortEmail
            });
        });
    }
    render() {
        const { currentUser } = this.state;
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]}
                style={{
                    height: 200,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1E90FF'
                }}
            >
                <Image
                    style={{ width: 50, height: 50, tintColor: 'white' }}
                    source={require('SystemManager/icons/user.png')}
                />
                <Text style={{ color: 'white' }}>{this.state.userData.name}</Text>
                <Text style={{ color: 'white' }}>{this.state.userData.email}</Text>
            </LinearGradient>
        );
    }
}
