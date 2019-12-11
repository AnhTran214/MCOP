import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    FlatList,
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
import { validate, nullLiteral } from '@babel/types';

export default class chartsComponent extends Component {
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Xếp hạng';
        let drawerIcon = () => (
            <Image
                source={require('thitracnghiem/icons/icons8-crown-480.png')}
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
            objTop: {},
            objCon: {},
            objCus: {},
            listTop: [],
            listRes: [],
            Id_Top: '',
            key: '',
            index: 0,
            point: 0
        };
    }
    getCus = async () => {
        await firebase.database().ref("Customer").on("value", (value) => {
            if (value.exists()) {
                this.setState({ objCus: value.val() });
            }
        })
    }
    getCon = async () => {
        await firebase.database().ref("Contest").on("value", (value) => {
            if (value.exists()) {
                this.setState({ objCon: value.val() });
                this.getRes();
            }
        })
    }
    changeTime = (time) => {
        var min = parseInt(time / 60);
        var sec = time % 60;
        if (min < 10 && min > 0) min = '0' + min;
        if (sec < 10 && sec > 0) sec = '0' + sec;
        return min + ' phút ' + sec + ' s'
    }
    getRes = async () => {
        await firebase.database().ref("Result").orderByChild('Point').on("value", (value) => {
            if (value.exists()) {
                var arr = [];
                var index = 0;
                var point = 0;
                var _index = 0;
                var tt_index = 0;
                value.forEach((element) => {
                    if (this.state.objCon.hasOwnProperty(element.toJSON().Id_Con) && this.state.objCon[element.toJSON().Id_Con].Id_Top == this.state.Id_Top) {
                        arr.push(
                            element.toJSON()
                        );
                        index++;
                        if (element.toJSON().Id_Cus == this.state.key) {
                            _index = index;
                            point = element.toJSON().Point;
                        }
                    }
                });

                arr.sort(function (a, b) { return b.Point - a.Point || (b.Point == a.Point && a.TimeLeft_Res > b.TimeLeft_Res) });
                var _index = 0;
                _index=arr.findIndex(x => x.Id_Cus == this.state.key);
                if (_index >= 0) {
                    this.setState({
                        listRes: arr,
                        point: arr[_index].Point,
                        index: _index+1
                    })
                }
                else {
                    this.setState({
                        listRes: arr
                    })
                }
            }
        })
    }

    getTop = async () => {
        await firebase.database().ref("Topic").orderByChild("Status").equalTo(1).on("value", (value) => {
            if (value.exists()) {
                this.setState({ objTop: value.val() });
                var arr = [];
                var free = 1;
                value.forEach((element) => {
                    if (free) {
                        this.setState({ Id_Top: element.key });
                        free = 0;
                    }
                    arr.push(
                        {
                            Id: element.key,
                            Name_Top: element.toJSON().Name_Top,
                            Status: element.toJSON().Status
                        });
                })
                this.setState({
                    listTop: arr
                })
                this.getCon();
            }
        })
    }
    async componentDidMount() {
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
            for (var key in userData) {
                this.setState({
                    key: key,
                });
                return;
            }
        });
        await this.getTop();
        await this.getCus();
    }
    setIdTop = async (id) => {
        this.setState({
            Id_Top: id
        });
        this.getRes();
    }
    getTopRes = () => {
        var arr = [];
        var last = -1;
        for (let index = 0; index < this.state.listRes.length; index++) {

            if (index == 10) break;
            last = index;
            var element = this.state.listRes[index];

            if (this.state.objCus.hasOwnProperty(element.Id_Cus)) {
                if (index == 0) {
                    arr.push(
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

                            }}
                        >
                            <View style={{ alignSelf: 'center' }}>
                                <Image
                                    style={{
                                        width: 50,
                                        height: 50,
                                        alignContent: 'center'
                                    }}
                                    source={require('thitracnghiem/icons/icons8-trophy-96.png')}
                                />
                            </View>
                            <View style={{ flexDirection: 'column', margin: '1%' }}>
                                <Text style={{ color: 'white' }}>Hạng 1</Text>
                                <Text style={{ color: 'white' }}>Tài khoản : {this.state.objCus[element.Id_Cus].Username}</Text>
                                <Text style={{ color: 'white' }}>{element.Point} điểm</Text>
                                <Text style={{ color: 'white' }}>{this.changeTime(element.TimeLeft_Res)}</Text>
                            </View>
                        </View>
                    )
                }
                else
                    if (index == 1) {
                        arr.push(
                            <View
                                key={index}
                                style={{
                                    width: '85%',
                                    padding: 5,
                                    flexDirection: 'row',
                                    borderWidth: 2,
                                    borderColor: '#1E90FF',
                                    margin: '2%',
                                    alignSelf: 'center'
                                }}
                            >
                                <Image
                                    style={{
                                        width: 50,
                                        height: 50
                                    }}
                                    source={require('thitracnghiem/icons/icons8-medal-second-place-80.png')}
                                />
                                <View style={{ flexDirection: 'column', margin: '1%' }}>
                                    <Text style={{ color: 'white' }}>Hạng 2</Text>
                                    <Text style={{ color: 'white' }}>Tài khoản : {this.state.objCus[element.Id_Cus].Username}</Text>
                                    <Text style={{ color: 'white' }}>{element.Point} điểm</Text>
                                    <Text style={{ color: 'white' }}>{this.changeTime(element.TimeLeft_Res)}</Text>
                                </View>
                            </View>)
                    }
                    else
                        if (index == 2) {
                            arr.push(
                                <View
                                    key={index}
                                    style={{
                                        width: '85%',
                                        padding: 5,
                                        flexDirection: 'row',
                                        borderWidth: 2,
                                        borderColor: '#1E90FF',
                                        margin: '2%',
                                        alignSelf: 'center'
                                    }}
                                >
                                    <Image
                                        style={{
                                            width: 50,
                                            height: 50
                                        }}
                                        source={require('thitracnghiem/icons/icons8-medal-third-place-80.png')}
                                    />
                                    <View style={{ flexDirection: 'column', margin: '1%' }}>
                                        <Text style={{ color: 'white' }}>Hạng 3</Text>
                                        <Text style={{ color: 'white' }}>Tài khoản : {this.state.objCus[element.Id_Cus].Username}</Text>
                                        <Text style={{ color: 'white' }}>{element.Point} điểm</Text>
                                        <Text style={{ color: 'white' }}>{this.changeTime(element.TimeLeft_Res)}</Text>
                                    </View>
                                </View>)
                        }
                        else {
                            arr.push(
                                <View
                                    key={index}
                                    style={{
                                        width: '85%',
                                        padding: 5,
                                        flexDirection: 'row',
                                        borderWidth: 2,
                                        borderColor: '#1E90FF',
                                        margin: '2%',
                                        alignSelf: 'center'
                                    }}
                                >
                                    <View style={{
                                        width: 50,
                                        height: 50,
                                        alignItems: 'center'
                                    }}>
                                        <Image
                                            style={{
                                                width: 40,
                                                height: 40
                                            }}
                                            source={require('thitracnghiem/icons/icons8-star-64.png')}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'column', margin: '1%' }}>
                                        <Text style={{ color: 'white' }}>Hạng {index + 1}</Text>
                                        <Text style={{ color: 'white' }}>Tài khoản : {this.state.objCus[element.Id_Cus].Username}</Text>
                                        <Text style={{ color: 'white' }}>{element.Point} điểm</Text>
                                        <Text style={{ color: 'white' }}>{this.changeTime(element.TimeLeft_Res)}</Text>
                                    </View>
                                </View>
                            )
                        }
            }
        }
        for (let index = last + 1; index < 10; index++) {
            if (index == 0) {
                arr.push(
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

                        }}
                    >
                        <View style={{ alignSelf: 'center' }}>
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                    alignContent: 'center'
                                }}
                                source={require('thitracnghiem/icons/icons8-trophy-96.png')}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', margin: '1%' }}>
                            <Text style={{ color: 'white' }}>Hạng 1</Text>
                            <Text style={{ color: 'white' }}>Tài khoản : Không có</Text>
                            <Text style={{ color: 'white' }}>0 điểm</Text>
                            <Text style={{ color: 'white' }}>0 s</Text>
                        </View>
                    </View>
                )
            }
            else
                if (index == 1) {
                    arr.push(
                        <View
                            key={index}
                            style={{
                                width: '85%',
                                padding: 5,
                                flexDirection: 'row',
                                borderWidth: 2,
                                borderColor: '#1E90FF',
                                margin: '2%',
                                alignSelf: 'center'
                            }}
                        >
                            <Image
                                style={{
                                    width: 50,
                                    height: 50
                                }}
                                source={require('thitracnghiem/icons/icons8-medal-second-place-80.png')}
                            />
                            <View style={{ flexDirection: 'column', margin: '1%' }}>
                                <Text style={{ color: 'white' }}>Hạng 2</Text>
                                <Text style={{ color: 'white' }}>Tài khoản : Không có</Text>
                                <Text style={{ color: 'white' }}>0 điểm</Text>
                                <Text style={{ color: 'white' }}>0 s</Text>
                            </View>
                        </View>)
                }
                else
                    if (index == 2) {
                        arr.push(
                            <View
                                key={index}
                                style={{
                                    width: '85%',
                                    padding: 5,
                                    flexDirection: 'row',
                                    borderWidth: 2,
                                    borderColor: '#1E90FF',
                                    margin: '2%',
                                    alignSelf: 'center'
                                }}
                            >
                                <Image
                                    style={{
                                        width: 50,
                                        height: 50
                                    }}
                                    source={require('thitracnghiem/icons/icons8-medal-third-place-80.png')}
                                />
                                <View style={{ flexDirection: 'column', margin: '1%' }}>
                                    <Text style={{ color: 'white' }}>Hạng 3</Text>
                                    <Text style={{ color: 'white' }}>Tài khoản : Không có</Text>
                                    <Text style={{ color: 'white' }}>0 điểm</Text>
                                    <Text style={{ color: 'white' }}>0 s</Text>
                                </View>
                            </View>)
                    }
                    else {
                        arr.push(
                            <View
                                key={index}
                                style={{
                                    width: '85%',
                                    padding: 5,
                                    flexDirection: 'row',
                                    borderWidth: 2,
                                    borderColor: '#1E90FF',
                                    margin: '2%',
                                    alignSelf: 'center'
                                }}
                            >
                                <View style={{
                                    width: 50,
                                    height: 50,
                                    alignItems: 'center'
                                }}>
                                    <Image
                                        style={{
                                            width: 40,
                                            height: 40
                                        }}
                                        source={require('thitracnghiem/icons/icons8-star-64.png')}
                                    />
                                </View>
                                <View style={{ flexDirection: 'column', margin: '1%' }}>
                                    <Text style={{ color: 'white' }}>Hạng {index + 1}</Text>
                                    <Text style={{ color: 'white' }}>Tài khoản : Không có</Text>
                                    <Text style={{ color: 'white' }}>0 điểm</Text>
                                    <Text style={{ color: 'white' }}>0 s</Text>
                                </View>
                            </View>
                        )
                    }
        }
        if (arr.length == 0) return null
        else
            return arr;
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
                        Bảng xếp hạng
                    </Text>
                    <FlatList
                        horizontal={true}
                        data={this.state.listTop}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: '3%' }}
                        renderItem={({ item, index }) => {
                            return (
                                <View
                                    key={index}>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={this.state.Id_Top == item.Id ? ['gray', 'gray'] : ['rgb(86, 123, 248)', 'rgb(95,192,255)']}
                                        style={{
                                            width: 100,
                                            height: 50,
                                            marginBottom: 70,
                                            backgroundColor: 'white',
                                            borderRadius: 10
                                        }}
                                    >
                                        <Button
                                            containerStyle={{
                                                width: 100,
                                                height: 50,
                                                justifyContent: 'center'

                                            }}
                                            onPress={async () => {
                                                this.setIdTop(item.Id);
                                            }}
                                            style={{ alignSelf: 'center', color: 'white' }}
                                        >
                                            {item.Name_Top}
                                        </Button>
                                    </LinearGradient>
                                </View>
                            );
                        }}

                    />

                    <View style={{ flexGrow: 1 }}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['rgb(86, 123, 248)', 'rgb(95,192,255)']}
                            style={{
                                width: '95%',
                                height: 120,
                                backgroundColor: 'white',
                                alignSelf: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    alignSelf: 'center',
                                    fontSize: 18
                                }}
                            >
                                Hạng của tôi
                        </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    margin: '2%'
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white'
                                    }}
                                >
                                    {this.state.point} điểm
                                </Text>
                                <Text
                                    style={{
                                        color: 'white'
                                    }}
                                >
                                    Hạng  {this.state.index}
                                </Text>


                            </View>
                        </LinearGradient>
                    </View>

                    <ScrollView>

                        <View>
                            {this.getTopRes()}
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
