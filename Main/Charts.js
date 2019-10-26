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
import { setItemToAsyncStorage, getItemFromAsyncStorage } from 'SystemManager/Function/function';
import Header from 'SystemManager/subComponent/Header';
import Footer from 'SystemManager/subComponent/footer';
import LinearGradient from 'react-native-linear-gradient';

export default class chartsComponent extends Component {
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Xếp hạng';
        let drawerIcon = () => (
            <Image
                source={require('SystemManager/icons/icons8-medieval-crown-96.png')}
                style={{ width: 26, height: 26 }}
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
                    source={require('SystemManager/img/70331284_752704455184910_2392173157533351936_n.jpg')}
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
                    <ScrollView>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]}
                            style={{
                                width: '95%',
                                height: 120,
                                backgroundColor: 'white',
                                alignSelf: 'center',
                                margin: '2%'
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
                                    Điểm
                                </Text>
                                <Text
                                    style={{
                                        color: 'white'
                                    }}
                                >
                                    Hạng
                                </Text>
                            </View>
                        </LinearGradient>
                        <View
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
                                source={require('SystemManager/icons/icons8-trophy-96.png')}
                            />
                            <View style={{ flexDirection: 'column', margin: '1%' }}>
                                <Text style={{ color: 'white' }}>Champion</Text>
                                <Text style={{ color: 'white' }}>50 câu toán</Text>
                                <Text style={{ color: 'white' }}>100 điểm</Text>
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
                                alignSelf: 'center'
                            }}
                        >
                            <Image
                                style={{
                                    width: 50,
                                    height: 50
                                }}
                                source={require('SystemManager/icons/icons8-medal-second-place-80.png')}
                            />
                            <View style={{ flexDirection: 'column', margin: '1%' }}>
                                <Text style={{ color: 'white' }}>Second</Text>
                                <Text style={{ color: 'white' }}>45 câu toán</Text>
                                <Text style={{ color: 'white' }}>90 câu điểm</Text>
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
                                alignSelf: 'center'
                            }}
                        >
                            <Image
                                style={{
                                    width: 50,
                                    height: 50
                                }}
                                source={require('SystemManager/icons/icons8-medal-third-place-80.png')}
                            />
                            <View style={{ flexDirection: 'column', margin: '1%' }}>
                                <Text style={{ color: 'white' }}>Third</Text>
                                <Text style={{ color: 'white' }}>40 câu toán</Text>
                                <Text style={{ color: 'white' }}>80 câu điểm</Text>
                            </View>
                        </View>
                        <View>
                            {/* <TextInput
            keyboardType = 'numeric'
            style={styles.multilineBox }
            placeholderTextColor = 'grey'
            placeholder= 'Số câu'
            multiline={true}
            maxLength={3}
            onChangeText={(text) => {
                this.setState({ sen: text });
            }}
            /> */}
                            {/* <Text style = {{margin: '2%'}}>{this.state.point}</Text>
            <Button
            onPress= { this.total.bind(this)}
            >
                {this.state.sen}
            </Button> */}
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
