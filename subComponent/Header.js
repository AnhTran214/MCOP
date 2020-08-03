import React, { Component } from 'react';
import { Text, View, TouchableHighlight, Image, Alert, StatusBar,BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Login } from 'thitracnghiem/Navigation/screenName';
import OfflineNotice from 'thitracnghiem/Navigation/OfflineNotice.js';

export default class Header extends Component {
    constructor(props) {
        super(props);
    }
    logout = () => {
        Alert.alert(
            'Thông báo',
            'Bạn muốn đăng xuất?',
            [
                { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Có',
                    onPress: async () => {
                        Alert.alert('Thông báo', 'Đăng xuất thành công');
                        await AsyncStorage.clear();
                        this.props.navigation.navigate(Login);
                    }
                }
            ],
            { cancelable: true }
        );
    };
    async componentDidMount() {
        this.backButton = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                'Thông báo',
                'Bạn có muốn thoát ứng dụng',
                [
                    { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    {
                        text: 'Có',
                        onPress: async () => {
                            BackHandler.exitApp();
                        }
                    }
                ],
                { cancelable: true }
            );
            return true;
        });
    }
    render() {
        return (
            <View>
                <StatusBar backgroundColor='#1E90FF' barStyle='light-content' />
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
                    <TouchableHighlight
                        style={{
                            marginLeft: 10
                        }}
                        underlayColor='#F1F1F1'
                        onPress={() => {
                            this.props.navigation.openDrawer();
                        }}
                    >
                        <Image
                            source={require('thitracnghiem/icons/menu-alt-512.png')}
                            style={{ width: 32, height: 32, tintColor: 'white' }}
                        />
                    </TouchableHighlight>
                    <Text style={{ color: 'white',fontSize:16,  fontWeight: 'bold' }}>
                        {this.props.title}
                    </Text>
                    <TouchableHighlight
                        style={{
                            marginRight: 10
                            //marginTop: 20,
                        }}
                        onPress={this.logout}
                    >
                        <Image
                            source={require('thitracnghiem/icons/icons8-export-40.png')}
                            style={{ width: 32, height: 32,tintColor:'white' }}
                        />
                    </TouchableHighlight>
                </View>
                <OfflineNotice />
            </View>
        );
    }
}
