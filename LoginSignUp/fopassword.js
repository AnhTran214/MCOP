import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Alert,
    TextInput,
    ImageBackground,
    Image,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import { SignUp, Home, Login, takepass } from 'thitracnghiem/Navigation/screenName';
import { setItemToAsyncStorage } from 'thitracnghiem/Function/function';
import LinearGradient from 'react-native-linear-gradient';
import RNSmtpMailer from 'react-native-smtp-mailer';
import OfflineNotice from 'thitracnghiem/Navigation/OfflineNotice.js';
export default class FopassCom extends Component {
    constructor(props) {
        super(props);
        this.unsubcriber = null;
        this.state = {
            typedEmail: '',
            typeUsername: '',
            loading: false,
            code: '',
            securenumber: '',
            err_email: '',
            key: ''
        };
    }
    makeEmall = async () => {
        if (this.state.typedEmail.trim().length == 0 || this.state.typeUsername.trim().length == 0) {
            Alert.alert('Thông báo', 'Vui lòng nhập email và username trước');
            return;
        }
        this.setState({ loading: true });
        await firebase
            .database()
            .ref('Customer')
            .orderByChild('Username')
            .equalTo(this.state.typeUsername)
            .once('value', (value) => {
                if (value.exists()) {
                    value.forEach((element) => {
                        if (element.toJSON().Email == this.state.typedEmail) {
                            var rd = '';
                            this.setState({
                                key: element.key
                            });
                            for (var i = 0; i < 6; i++) {
                                rd += Math.floor(Math.random() * 10).toString();
                            }

                            RNSmtpMailer.sendMail({
                                mailhost: 'smtp.gmail.com',
                                port: '465',
                                ssl: true,
                                username: 'mcopf4@gmail.com',
                                password: 'mcop2019',
                                from: 'mcopf4@gmail.com',
                                recipients: this.state.typedEmail,
                                subject: 'Mã xác nhận tài khoản ' + this.state.typedEmail + ' từ MCOP',
                                htmlBody:
                                    '<p>Mã xác nhận của tài khoản ' +
                                    this.state.typeUsername +
                                    ' : ' +
                                    rd +
                                    '.<p></br><p>Nếu xảy ra lỗi xin vui lòng liên hệ mcopf4@gmail.com để được giúp đỡ.</p>',
                                attachmentPaths: [],
                                attachmentNames: [],
                                attachmentTypes: []
                            })
                                .then(() => {
                                    this.setState({ securenumber: rd, loading: false });
                                    Alert.alert('Thông báo', 'Gửi thành công');
                                })
                                .catch((err) => {
                                    console.log(err);
                                    this.setState({ securenumber: '', loading: false });

                                    Alert.alert('Thông báo', 'Không gửi được mã xác nhận');
                                });
                        }
                        else {
                            this.setState({ loading: false });
                            Alert.alert('Thông báo', 'Người dùng không tồn tại trong email nhập');
                        }
                        return;
                    });
                }
                else {
                    this.setState({ loading: false });
                    Alert.alert('Thông báo', 'Người dùng không tồn tại');
                    return;
                }
            });
    };
    checkEmail = (text) => {
        if (text.trim().length == 0) {
            this.setState({ err_email: '' });
        }
        else {
            var reg = new RegExp('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}');
            if (reg.test(text) === false) {
                this.setState({ err_email: 'Định dạng Email không đúng' });
            }
            else {
                this.setState({ err_email: '' });
            }
        }
        this.setState({ typedEmail: text });
    };
    checkValue = () => {
        return this.state.typedEmail === '' || this.state.typeUsername === '' || this.state.err_email.length > 0;
    };

    render() {
        return (
            <View style={styles.contain}>
                <StatusBar backgroundColor='#1E90FF' barStyle='light-content' />
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    <OfflineNotice />
                    <ScrollView>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                marginLeft: '5%',
                                marginRight: '5%',
                                justifyContent: 'space-between',
                                width: '90%'
                                /* backgroundColor: 'red' */
                            }}
                        >
                            <Button
                                containerStyle={{
                                    padding: 10
                                    /* backgroundColor:'white', */
                                }}
                                style={{
                                    color: 'white',
                                    marginBottom: '20%'
                                }}
                                onPress={() => {
                                    const { navigate } = this.props.navigation; //chu y
                                    navigate(Login);
                                }}
                            >
                                <Image
                                    style={{ width: 30, height: 30, tintColor: 'white' }}
                                    source={require('thitracnghiem/icons/back.png')}
                                />
                            </Button>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('thitracnghiem/img/imageedit_18_6287752576.png')}
                                style={{
                                    width: 200,
                                    height: 200,
                                    marginTop: '5%'
                                }}
                            />
                            <View style={[ styles.propertyValueRowView ]}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        tintColor: 'white',
                                        position: 'absolute',
                                        top: '40%'
                                    }}
                                    source={require('thitracnghiem/icons/email.png')}
                                />
                                <TextInput
                                    style={styles.multilineBox1}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='white'
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    placeholder='Email'
                                    editable={true}
                                    maxLength={100}
                                    onChangeText={(text) => {
                                        this.checkEmail(text);
                                    }}
                                />
                                <Button
                                    containerStyle={{
                                        position: 'absolute',
                                        left: '80%',
                                        top: '40%',
                                        borderWidth: 2,
                                        borderColor: 'blue',
                                        backgroundColor: 'blue',
                                        borderRadius: 10,
                                        opacity: 0.5
                                    }}
                                    style={{ fontSize: 13, padding: 5, color: 'white' }}
                                    onPress={() => this.makeEmall()}
                                >
                                    Gửi mã
                                </Button>
                            </View>
                            {this.state.err_email.length > 0 ? (
                                <Text style={{ color: 'red', flex: 0, textAlign: 'center' }}>
                                    {this.state.err_email}
                                </Text>
                            ) : null}
                            <View style={[ styles.propertyValueRowView, { marginBottom: '5%' } ]}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        tintColor: 'white',
                                        position: 'absolute',
                                        top: '40%'
                                    }}
                                    source={require('thitracnghiem/icons/user.png')}
                                />
                                <TextInput
                                    style={[ styles.multilineBox ]}
                                    keyboardType='default'
                                    placeholderTextColor='white'
                                    underlineColorAndroid='transparent'
                                    autoCapitalize='none'
                                    placeholder='Username'
                                    /* multiline={true} */
                                    editable={true}
                                    maxLength={50}
                                    onChangeText={(text) => {
                                        this.setState({ typeUsername: text });
                                    }}
                                />
                            </View>
                            <View style={[ styles.propertyValueRowView, { marginBottom: '5%' } ]}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        tintColor: 'white',
                                        position: 'absolute',
                                        top: '40%'
                                    }}
                                    source={require('thitracnghiem/icons/icons8-qr-code-64.png')}
                                />
                                <TextInput
                                    style={[ styles.multilineBox ]}
                                    keyboardType='default'
                                    placeholderTextColor='white'
                                    underlineColorAndroid='transparent'
                                    autoCapitalize='none'
                                    placeholder='Mã xác nhận'
                                    /* multiline={true} */
                                    editable={true}
                                    maxLength={50}
                                    onChangeText={(text) => {
                                        this.setState({ code: text });
                                    }}
                                />
                            </View>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={
                                    this.checkValue() ? [ 'grey', 'grey' ] : [ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]
                                }
                                style={{
                                    margin: '2%',
                                    padding: '3%',
                                    borderRadius: 20,
                                    width: 250
                                }}
                            >
                                <Button
                                    disabled={this.checkValue() ? true : false}
                                    style={{
                                        fontSize: 16,
                                        color: 'white'
                                    }}
                                    onPress={/* this.onLogin */ () => {
                                        if (this.state.code == this.state.securenumber) {
                                            this.props.navigation.navigate(takepass, { key: this.state.key });
                                        }
                                        else {
                                            Alert.alert('Mã xác nhận không đúng');
                                        }
                                    }}
                                >
                                    XÁC NHẬN
                                </Button>
                            </LinearGradient>
                            {this.state.loading ? (
                                <View
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ActivityIndicator size={70} />
                                </View>
                            ) : null}
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    color: 'white',
                                    marginBottom: '5%'
                                }}
                            />
                        </View>
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#00008B'
    },
    multilineBox: {
        width: '80%',
        height: 50,
        marginTop: 20,
        borderColor: 'rgba(255,255,255,0.7)',
        borderBottomWidth: 1,
        textAlignVertical: 'top',
        marginLeft: '10%',
        marginRight: '2%',
        borderRadius: 5,
        color: 'white'
    },
    multilineBox1: {
        width: '80%',
        height: 50,
        marginTop: 20,
        borderColor: 'rgba(255,255,255,0.7)',
        borderBottomWidth: 1,
        textAlignVertical: 'top',
        marginLeft: '10%',
        marginRight: '2%',
        borderRadius: 5,
        color: 'white',
        paddingRight: '12%'
    },
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 0,
        marginBottom: 0,
        width: '90%'
    }
});
