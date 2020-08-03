import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View, Image, ImageBackground, BackHandler, Alert } from 'react-native';
import Button from 'react-native-button';
import { Home } from 'thitracnghiem/Navigation/screenName';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import { getItemFromAsyncStorage } from 'thitracnghiem/Function/function';
import OfflineNotice from 'thitracnghiem/Navigation/OfflineNotice.js';
export default class Resultmain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            succ: 0,
            fail: 0,
            point: 0,
            total: 0,
            time: 0,
            Id_Con:''
        };
    }
    changeTime = (time) => {
        var min = parseInt(time / 60);
        var sec = time % 60;
        if (min < 10 && min > 0) min = '0' + min;
        if (sec < 10 && sec > 0) sec = '0' + sec;
        return min + ' phút ' + sec + ' giây';
    }
    async componentDidMount() {
        var value = await this.props.navigation.getParam('res_quest', null);
        var Id_Con = await this.props.navigation.getParam('Id_Con', null);
        var key_user='';
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
             key_user=userData.Id;
        });
        var date = new Date().toISOString().substr(0, 10);
        if (value != null) {
            if (Id_Con!='-MDSV6A4mCgLzdFeyUPf')
            {
                const res = value.split('|');
                var succ=parseInt(res[0]);
                var fail=parseInt(res[1]);
                var total=parseInt(res[2]);
                var point=parseInt(res[3]);
                var time=parseInt(res[4]);
                this.setState({
                    Id_Con:Id_Con,
                    succ:succ,
                    fail: fail,
                    total: total,
                    point: point,
                    time: time
                });
                await firebase.database().ref('Result').push({
                    Id_Cus: key_user,
                    Id_Con: Id_Con,
                    TimeLeft_Res: time,
                    Point: point,
                    Date_Res: date
                });
             }
             else
             {
                this.setState({
                    Id_Con:Id_Con,
                    point: value
                });
                await firebase.database().ref('Result').push({
                    Id_Cus: key_user,
                    Id_Con: Id_Con,
                    TimeLeft_Res: 0,
                    Point:value,
                    Date_Res: date
                });
             }
         }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    <OfflineNotice />
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
                                source={require('thitracnghiem/icons/back.png')}
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
                            {this.state.point}
                        </Text>
                        {
                        this.state.Id_Con!='-MDSV6A4mCgLzdFeyUPf'?
                        (
                            <View>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                textAlign: 'center'
                            }}
                        >
                            {this.state.succ}/{this.state.total}
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                margin: '5%'
                            }}
                        >
                            Thời gian trả lời:{' '}
                            {this.changeTime(this.state.time)}
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                margin: '5%'
                            }}
                        >
                            Số câu trả lời đúng: {this.state.succ}
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                margin: '5%'
                            }}
                        >
                            Số câu trả lời sai: {this.state.fail}
                        </Text>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 16,
                                margin: '5%'
                            }}
                        >
                            Số câu không trả lời:{' '}
                            {this.state.total - (this.state.succ+ this.state.fail)}
                        </Text>
                        </View>
                        ):null}
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
