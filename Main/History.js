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
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import Header from 'thitracnghiem/subComponent/Header';
import Footer from 'thitracnghiem/subComponent/footer';

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
            point: 100,
            key: '',
            his: [],
            objCon: {},
            objTop: {},
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
    getHis = async () => {
        await firebase.database().ref("Result").orderByChild('Id_Cus').equalTo(this.state.key).limitToLast(3).on("value", (value) => {
            if (value.exists()) {
                var his = [];
                value.forEach((element) => {
                    his.push(element.toJSON());
                })
                his.reverse();
                this.setState({ his: his });
            }
        })
    }
    getTop = async () => {
        await firebase.database().ref("Topic").on("value", (value) => {
            if (value.exists()) {
                this.setState({ objTop: value.val() });
            }
        })
    }
    getCon = async () => {
        await firebase.database().ref("Contest").on("value", (value) => {
            if (value.exists()) {
                this.setState({ objCon: value.val() });
            }
        })
    }
    async  componentDidMount() {
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
            this.setState({
                key: userData.Id,
            });
        });
        await this.getHis();
        await this.getCon();
        await this.getTop();

    }
    changDate = (date) => {
        var date = new Date(date);
        var d=date.getDate();
        var m=date.getMonth()+1;
        var y=date.getFullYear();
        return (d<10?('0'+d):d) + "/" + (m<10?('0'+m):m) + "/" + y;
    }
    changeTime = (time) => {
        var min = parseInt(time / 60);
        var sec = time % 60;
        if (min < 10 && min > 0) min = '0' + min;
        if (sec < 10 && sec > 0) sec = '0' + sec;
        return min + ' phút ' + sec + ' giây';
    }
    showHis = () => {
        var show_his = [];
        var index=0;
        this.state.his.forEach((element) => {
            index++;
            show_his.push(
                <View
                    key={index}
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
                    <View style={{ justifyContent: 'center', width: '25%' }}>
                        <Text style={{ color: 'white', fontSize: 15,  textAlign: 'center' }}>{this.state.objCon.hasOwnProperty(element.Id_Con) && this.state.objTop.hasOwnProperty(this.state.objCon[element.Id_Con].Id_Top) ? this.state.objTop[this.state.objCon[element.Id_Con].Id_Top].Name_Top : "NULL"}</Text>
                    </View>
                    <View style={{ flexDirection: 'column', margin: '3%', width: '75%' }}>
                        <Text style={{ color: 'white' }}>Ngày: {this.changDate(element.Date_Res)}</Text>
                        <Text style={{ color: 'white' }}>Thời gian: {this.changeTime(element.TimeLeft_Res)}</Text>
                        <Text style={{ color: 'white' }}>{element.Point} điểm</Text>
                    </View>
                </View>
            )
        });
        if (show_his.length == 0)
            return null
        else return show_his;
    }
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
                    <Header {...this.props} title={'Lịch sử thi'} />
                    <ScrollView  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                        <View style={{justifyContent:'center',alignSelf:'center'}}>
                            {this.showHis()}
                        </View>
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
