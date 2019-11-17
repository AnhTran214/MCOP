import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    Image,
    Alert,
    StatusBar,
    ScrollView,
    TextInput,
    StyleSheet,
    ImageBackground
} from 'react-native';
import Button from 'react-native-button';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { setItemToAsyncStorage, getItemFromAsyncStorage } from 'thitracnghiem/Function/function';
import Header from 'thitracnghiem/subComponent/Header';
import Footer from 'thitracnghiem/subComponent/footer';
import LinearGradient from 'react-native-linear-gradient';

export default class HistoryCom extends Component {
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Lịch sử thi';
        let drawerIcon = () => (
            <Image
                source={require('thitracnghiem/icons/icons8-time-machine-100.png')}
                style={{ width: 26, height: 26, tintColor: '#1E90FF' }}
            />
        );

        return { drawerLabel, drawerIcon };
    };
    constructor(props) {
        super(props);
        this.state = {
            sen: 50,
            point: 100
        };
    }
    total = () => {
        var s = 50;
        var p = 100;
        if (s === 50) {
            this.setState({ point: p });
        }
        for (var i = s - 1; i >= 0; i--) {
            this.setState({ sen: i });
            this.setState({ point: p - 2 });
        }
    };
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#F1F1F1'
                }}
            >
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Header {...this.props} />
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: '#1E90FF',
                            marginTop: '1%',
                            fontStyle: 'italic',
                            marginBottom: '5%'
                        }}
                    >
                        Lịch sử thi
                    </Text>
                    <ScrollView>
                        <View>
                            <View
                                style={{
                                    width: '85%',
                                    padding: 5,
                                    flexDirection: 'row',
                                    borderWidth: 2,
                                    borderColor: '#1E90FF',
                                    margin: '2%',
                                    alignSelf: 'center',
                                    borderRadius: 10
                                }}
                            >
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, opacity: 0.7 }}>Toán</Text>
                                </View>
                                <View style={{ flexDirection: 'column', margin: '3%' }}>
                                    <Text style={{ color: 'white' }}>Ngày: 17/11/2019</Text>
                                    <Text style={{ color: 'white' }}>Thời gian: 85 phút 00 giây</Text>
                                    <Text style={{ color: 'white' }}>80 điểm</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: '85%',
                                    padding: 5,
                                    flexDirection: 'row',
                                    borderWidth: 2,
                                    borderColor: '#1E90FF',
                                    margin: '2%',
                                    alignSelf: 'center',
                                    borderRadius: 10
                                }}
                            >
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, opacity: 0.7 }}>Văn</Text>
                                </View>
                                <View style={{ flexDirection: 'column', margin: '3%' }}>
                                    <Text style={{ color: 'white' }}>Ngày: 10/11/2019</Text>
                                    <Text style={{ color: 'white' }}>Thời gian: 90 phút 00 giây</Text>
                                    <Text style={{ color: 'white' }}>90 điểm</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: '85%',
                                    padding: 5,
                                    flexDirection: 'row',
                                    borderWidth: 2,
                                    borderColor: '#1E90FF',
                                    margin: '2%',
                                    alignSelf: 'center',
                                    borderRadius: 10
                                }}
                            >
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, opacity: 0.7 }}>Anh</Text>
                                </View>
                                <View style={{ flexDirection: 'column', margin: '3%' }}>
                                    <Text style={{ color: 'white' }}>Ngày: 1/11/2019</Text>
                                    <Text style={{ color: 'white' }}>Thời gian: 87 phút 00 giây</Text>
                                    <Text style={{ color: 'white' }}>100 điểm</Text>
                                </View>
                            </View>
                        </View>
                        <View />
                    </ScrollView>
                    <Footer {...this.props} />
                </ImageBackground>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 0,
        marginBottom: 0,
        width: '100%'
    },
    multilineBox: {
        width: '96%',
        height: 50,
        marginTop: '2%',
        borderColor: '#1E90FF',
        borderBottomWidth: 5,
        textAlignVertical: 'top',
        marginLeft: '2%',
        marginRight: '2%',
        borderRadius: 5,
        color: 'black'
    },
    multilineBox1: {
        width: '98%',
        height: 50,
        marginTop: '1%',
        borderColor: '#66CDAA',
        borderBottomWidth: 2,
        textAlignVertical: 'top',
        backgroundColor: 'white',
        marginLeft: '1%',
        color: 'blue'
    }
});
