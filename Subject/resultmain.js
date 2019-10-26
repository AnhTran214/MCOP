import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    Image,
    Alert,
    Platform,
    TouchableHighlight,
    TextInput,
    Dimensions,
    ImageBackground
} from 'react-native';
import Button from 'react-native-button';
import { Login, Home, info, math } from 'SystemManager/Navigation/screenName';
import LinearGradient from 'react-native-linear-gradient';

export default class Resultmain extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={require('SystemManager/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    <View style={{ width: '100%', backgroundColor: '#1E90FF', height: 50 }}>
                        <Button
                            containerStyle={{
                                width: 200,
                                marginLeft: '2%',
                                marginTop: '2%',
                                flexDirection: 'row'
                            }}
                            style={{
                                color: 'white',
                                fontSize: 13
                            }}
                            onPress={() => this.props.navigation.navigate(Home)}
                        >
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    tintColor: 'white'
                                }}
                                source={require('SystemManager/icons/back.png')}
                            />
                            Trở về
                        </Button>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            width: '90%',
                            backgroundColor: 'rgba(30, 144, 255,0.7)',
                            alignSelf: 'center',
                            marginTop: '2%',
                            marginBottom: '2%',
                            borderRadius: 20,
                            justifyContent: 'center'
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                textAlign: 'center'
                            }}
                        >
                            Điểm
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 70,
                                textAlign: 'center'
                            }}
                        >
                            100
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                textAlign: 'center'
                            }}
                        >
                            40/40
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                margin: '5%'
                            }}
                        >
                            Số câu trả lời đúng: 40
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                margin: '5%'
                            }}
                        >
                            Số câu trả lời sai: 0
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                margin: '5%'
                            }}
                        >
                            Số câu không trả lời: 0
                        </Text>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]}
                            style={{
                                width: '70%',
                                height: 50,
                                backgroundColor: 'rgb(30, 144, 255)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                borderRadius: 10
                            }}
                        >
                            <Button
                                style={{
                                    color: 'white',
                                    fontSize: 16
                                }}
                                onPress={() => this.props.navigation.navigate(Home)}
                            >
                                Hoàn thành
                            </Button>
                        </LinearGradient>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}
