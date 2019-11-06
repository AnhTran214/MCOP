import React, { Component } from 'react';
import { Text, View, TouchableHighlight, Image, Alert } from 'react-native';
import Button from 'react-native-button';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { Home, info, addques, listques, charts } from 'thitracnghiem/Navigation/screenName';
import { setItemToAsyncStorage, getItemFromAsyncStorage } from 'thitracnghiem/Function/function';

export default class Footer extends Component {
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
            <View>
                <View
                    style={{
                        height: 50,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#1E90FF'
                    }}
                >
                    <Button
                        containerStyle={{
                            width: 30,
                            margin: '2%',
                            alignSelf: 'flex-start'
                        }}
                        onPress={async () => {
                            this.props.navigation.navigate(Home);
                        }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                margin: '2%',
                                tintColor: 'white'
                            }}
                            source={require('thitracnghiem/icons/icons8-home-480.png')}
                        />
                    </Button>
                    <Button
                        containerStyle={{
                            width: 30,
                            margin: '2%',
                            alignSelf: 'flex-start'
                        }}
                        onPress={async () => {
                            this.props.navigation.navigate(charts);
                        }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                margin: '2%',
                                tintColor: 'white'
                            }}
                            source={require('thitracnghiem/icons/icons8-crown-480.png')}
                        />
                    </Button>
                    <Button
                        containerStyle={{
                            width: 30,
                            margin: '2%',
                            alignSelf: 'flex-start'
                        }}
                        onPress={async () => {
                            this.props.navigation.navigate(info);
                        }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                margin: '2%',
                                tintColor: 'white'
                            }}
                            source={require('thitracnghiem/icons/icons8-user-male-512.png')}
                        />
                    </Button>
                </View>
            </View>
        );
    }
}
