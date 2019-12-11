import React, { Component } from 'react';
import {  View,  Image} from 'react-native';
import Button from 'react-native-button';

import { Home, info, charts, histo } from 'thitracnghiem/Navigation/screenName';

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
                    <Button
                        containerStyle={{
                            width: 30,
                            margin: '2%',
                            alignSelf: 'flex-start'
                        }}
                        onPress={async () => {
                            this.props.navigation.navigate(histo);
                        }}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30,
                                margin: '2%',
                                tintColor: 'white'
                            }}
                            source={require('thitracnghiem/icons/icons8-time-machine-100.png')}
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
                </View>
            </View>
        );
    }
}
