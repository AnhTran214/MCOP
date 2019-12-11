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
    getUser = async()=>
    {
        await firebase.database().ref('Customer/'+this.state.key).on("value",(value)=>
        {
        
           if (value.exists())
           {
            this.setState({
                userData:  value.toJSON()
            }); 
             
           }
        }) 
    }
    async componentDidMount() {
        await setItemToAsyncStorage('currentScreen', Home);
       var key= await AsyncStorage.getItem('key');
        this.setState(
            {
                key:key
            }
        )
            await this.getUser();
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
                    this.state.userData &&  this.state.userData.Image!=''?
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
