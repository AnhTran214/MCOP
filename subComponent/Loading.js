import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, ImageBackground, Text,Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
export default class AuthLoadingScreen extends Component {
    constructor(props) {
        super(props);
        this.getEmail();
    }

    getEmail = async () => {
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
            this.props.navigation.navigate(userData ? 'App' : 'Auth');
        });
    };

    render() {
        return (
            <ImageBackground
                source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                style={{ width: '100%', height: '100%' }}
            >
                <View style={styles.container}>
                <Image
                                source={require('thitracnghiem/img/imageedit_18_6287752576.png')}
                                style={{
                                    width: 200,
                                    height: 200,
                                }}
                            />
                    <Text style={{ fontSize: 44, color: 'white', fontWeight: 'bold', fontStyle: 'italic' }}>
                        M.C.O.P
                    </Text>
                    <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>Thi trắc nghiệm online</Text>
                    <ActivityIndicator color='#1E90FF' size={40} />
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
