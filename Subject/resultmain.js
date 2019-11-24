import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
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
import { Login, Home, info, math } from 'thitracnghiem/Navigation/screenName';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import {
	setItemToAsyncStorage,
	getItemFromAsyncStorage,
	setItemToAsyncStorage1
} from 'thitracnghiem/Function/function';
export default class Resultmain extends Component {
    constructor(props) {
		super(props);
		this.state = {
            succ: 0,
            fail: 0,
            point:0,
            total : 0,
            time : 0
		};

	}
  async  componentDidMount()
    {
       var  value=  await this.props.navigation.getParam('res_quest', null)
            if (value!=null)
            {
            const res = value.split("|");
            this.setState({
                succ : res[0],
                fail : res[1],
                total: res[2],
                point : res[3],
                time : res[4]
            })      
            var Id_Con= await this.props.navigation.getParam('Id_Con', null) 
            var user= await getItemFromAsyncStorage("userData");
            var key_user='';
            var date = (new Date()).toISOString().substr(0,10);
            for (var key in JSON.parse(user)) {
             key_user=key;
            }
            
            await firebase.database().ref("Result").push(
                {
                    Id_Cus : key_user,
                    Id_Con : Id_Con,
                    TimeLeft_Res: parseInt(this.state.time),
                    Point : parseFloat(this.state.point),
                    Date_Res: date
                }
            )
        }
    
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
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
                            Số câu không trả lời: {parseInt(this.state.total)-(parseInt(this.state.succ)+parseInt(this.state.fail))}
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
