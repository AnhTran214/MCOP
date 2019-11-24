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
import { SignUp, Home, fopass } from 'thitracnghiem/Navigation/screenName';
import { setItemToAsyncStorage,setItemToAsyncStorage1 } from 'thitracnghiem/Function/function';
/*import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice' */
import LinearGradient from 'react-native-linear-gradient';
import md5 from 'md5';
const LearnAppRefUsers = firebase.database().ref('Customer');
export default class loginComponent extends Component {
    constructor(props) {
        super(props);
        this.unsubcriber = null;
        this.state = {
            typedEmail: '',
            typedPassword: '',
            user: null,
            isUploading: false,
            pickerDisplayed: false,
            isAuthenticated: false,
            userData: {},
            showhidenPass: true,
            loading: false
        };
    }
    showhidenPassword = () => {
        if (this.state.showhidenPass === true) {
            this.setState({ showhidenPass: false });
        }
        else {
            this.setState({ showhidenPass: true });
        }
    };


    onLogin = () => {
        this.setState({
            loading: true
        });
        if (this.state.typedEmail == '' || this.state.typedPassword == '') {
            Alert.alert('Thông báo', 'Email và Password không được bỏ trống');
            return;
        }
        firebase
            .database()
            .ref("Customer").orderByChild("Username").equalTo(this.state.typedEmail).once('value', (value) => {
                if (value.exists()) {
                    value.forEach(async(data)=>
                    {
                        if (data.toJSON().Password == md5(this.state.typedPassword)) {
                            if (data.toJSON().Status == 1) {
    
                               await setItemToAsyncStorage('userData', value.toJSON());
                               await setItemToAsyncStorage1('key', data.key);
                                this.setState({
                                    loading: false
                                });
                                Alert.alert('Thông báo', 'Đăng nhập thành công');
                                this.props.navigation.navigate('App');
                            }
                            else {
                                Alert.alert('Thông báo', 'Tài Khoản Đã Bị Khóa');
                                this.setState({
                                    loading: false
                                });
                            }
                        }
                        else {
                            Alert.alert('Thông báo', 'Nhập Sai Mật Khẩu');
                            this.setState({
                                loading: false
                            });
                        }
                        return;
                    }
                    )
                }
                else {
                    Alert.alert('Thông báo', 'Tài Khoản Không Tồn Tại');
                    this.setState({
                        loading: false
                    });
                }

            }, (error) => {
                Alert.alert('Thông báo', 'Lỗi Server');
                this.setState({
                    loading: false
                });
            });
    };
    checkValue = () => {
        return this.state.typedEmail === '' || this.state.typedPassword === '';
    };

    render() {
        return (
            <View style={styles.contain}>
                <StatusBar backgroundColor='#1E90FF' barStyle='light-content' />
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* <OfflineNotice /> */}
                    <ScrollView>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('thitracnghiem/img/imageedit_18_6287752576.png')}
                                style={{
                                    width: 200,
                                    height: 200,
                                    marginTop: '5%'
                                }}
                            />
                            <View style={[styles.propertyValueRowView]}>
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
                                    style={styles.multilineBox}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='white'
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    placeholder='Tài khoản'
                                    editable={true}
                                    maxLength={100}
                                    onChangeText={(text) => {
                                        this.setState({ typedEmail: text });
                                    }}
                                />
                            </View>
                            <View style={[styles.propertyValueRowView, { marginBottom: '5%' }]}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        tintColor: 'white',
                                        position: 'absolute',
                                        top: '40%'
                                    }}
                                    source={require('thitracnghiem/icons/56255.png')}
                                />
                                <TextInput
                                    style={[styles.multilineBox1]}
                                    keyboardType='default'
                                    placeholderTextColor='white'
                                    underlineColorAndroid='transparent'
                                    autoCapitalize='none'
                                    secureTextEntry={this.state.showhidenPass} // ko dung dc khi multiline = {true}
                                    placeholder='Mật khẩu'
                                    /* multiline={true} */
                                    editable={true}
                                    maxLength={100}
                                    onChangeText={(text) => {
                                        this.setState({ typedPassword: text });
                                    }}
                                />
                                <Button
                                    containerStyle={{
                                        position: 'absolute',
                                        left: '80%',
                                        top: '40%'
                                    }}
                                    onPress={this.showhidenPassword.bind(this.state.showhidenPass)}
                                >
                                    {this.state.showhidenPass === true ? (
                                        <Image
                                            style={{ width: 30, height: 30, tintColor: 'white' }}
                                            source={require('thitracnghiem/icons/2d4e09879b6f017f74ffaee0b0011c0a-eye-icon-by-vexels.png')}
                                        />
                                    ) : (
                                            <Image
                                                style={{ width: 30, height: 30, tintColor: 'white' }}
                                                source={require('thitracnghiem/icons/mob32px045-512.png')}
                                            />
                                        )}
                                </Button>
                            </View>
                            <Button
                                containerStyle={{
                                    /* padding: '3%', */
                                    borderRadius: 5,
                                    alignSelf: 'center',
                                    left: 100
                                }}
                                onPress={() => {
                                    const { navigate } = this.props.navigation; //chu y
                                    navigate(fopass);
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: 'white',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    Quên mật khẩu?
                                </Text>
                            </Button>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={
                                    this.state.typedEmail === '' || this.state.typedPassword === '' ? (
                                        ['grey', 'grey']
                                    ) : (
                                            ['rgb(86, 123, 248)', 'rgb(95,192,255)']
                                        )
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
                                    onPress={this.onLogin}
                                >
                                    ĐĂNG NHẬP
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
                            <Button
                                containerStyle={{
                                    padding: '3%',
                                    borderRadius: 5,
                                    alignSelf: 'center'
                                }}
                                onPress={() => {
                                    const { navigate } = this.props.navigation; //chu y
                                    navigate(SignUp);
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: 'white',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    Bạn chưa có tài khoản?{' '}
                                    <Text style={{ color: '#1E90FF', fontStyle: 'italic' }}>Đăng ký</Text>
                                </Text>
                            </Button>
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
        paddingRight:40,
        color: 'white'
    },
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 0,
        marginBottom: 0,
        width: '90%'
    }
});
