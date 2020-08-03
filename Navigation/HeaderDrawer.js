import React, { Component } from 'react';
import { Text, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { Home } from 'thitracnghiem/Navigation/screenName';
import { setItemToAsyncStorage } from 'thitracnghiem/Function/function';
import LinearGradient from 'react-native-linear-gradient';

export default class HeaderDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userData: {},
            key: ''
        };
    }
    async componentDidMount() {
        await setItemToAsyncStorage('currentScreen', Home);
      await AsyncStorage.getItem('userData').then((value) => {
        const userData = JSON.parse(value);
            this.setState({
                key: userData.Id,
                userData: userData
            });
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
                    this.state.userData &&  this.state.userData.Image!=null && this.state.userData.Image!=''?
                        <Image
                            style={{ width: 80, height: 80 }}
                            source = {{uri: this.state.userData.Image}}
                         
                        /> :
                        <Image
                            style={{ width: 80, height: 80, tintColor: 'white'}}
                            source={require('thitracnghiem/icons/user.png')}
                        />

                }
                <Text style={{ color: 'white',marginTop:10,fontWeight:'bold' }}>Tài Khoản: { this.state.userData ? this.state.userData.Username:''}</Text> 
                <Text style={{ color: 'white' }}>Tên: {this.state.userData ?this.state.userData.Fullname:''}</Text>  
            </LinearGradient>
        );
    }
}
