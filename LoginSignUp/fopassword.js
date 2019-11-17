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
/*import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice' */
import LinearGradient from 'react-native-linear-gradient';

const LearnAppRefUsers = firebase.database().ref('Manager/User');
export default class FopassCom extends Component {
    constructor(props) {
        super(props);
        this.unsubcriber = null;
        this.state = {
            typedEmail: '',
            typeUsername: '',
            user: null,
            isUploading: false,
            pickerDisplayed: false,
            isAuthenticated: false,
            userData: {},
            showhidenPass: true,
            loading: false,
            code: ''
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
    componentDidMount() {
        this.unsubcriber = firebase.auth().onAuthStateChanged((changedUser) => {
            this.setState({
                user: changedUser
            });
        });
    }

    componentWillUnmount() {
        if (this.unsubcriber) {
            this.unsubcriber();
        }
    }
    getUserFromDB() {
        return new Promise((resolve) => {
            LearnAppRefUsers.orderByChild('email').equalTo(this.state.typedEmail).on('value', (childSnapshot) => {
                var userData = {};
                childSnapshot.forEach((doc) => {
                    userData = {
                        id: doc.toJSON().id,
                        email: doc.toJSON().email,
                        password: doc.toJSON().password,
                        role: doc.toJSON().role,
                        name: doc.toJSON().name,
                        address: doc.toJSON().address,
                        contact: doc.toJSON().contact
                    };
                });
                resolve(userData);
            });
        });
    }
    onLogin = () => {
        this.setState({
            loading: true
        });
        if (this.state.typedEmail == '' || this.state.typeUsername == '') {
            Alert.alert('Thông báo', 'Email và Password không được bỏ trống');
            return;
        }
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.typedEmail, this.state.typeUsername)
            .then(async (loginUser) => {
                const userData = await this.getUserFromDB();
                setItemToAsyncStorage('userData', userData);
                Alert.alert('Thông báo', 'Đăng nhập thành công');
                this.props.navigation.navigate('App');
            })
            .catch((error) => {
                Alert.alert(`${error.toString().replace('Error: ', '')}`);
            });
    };
    checkValue = () => {
        return this.state.typedEmail === '' || this.state.typeUsername === '';
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
                                    style={styles.multilineBox}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='white'
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    placeholder='Email'
                                    editable={true}
                                    maxLength={50}
                                    onChangeText={(text) => {
                                        this.setState({ typedEmail: text });
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
                                    /* onPress={this.showhidenPassword.bind(this.state.showhidenPass)} */
                                >
                                    Gửi mã
                                </Button>
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
                                    source={require('thitracnghiem/icons/user.png')}
                                />
                                <TextInput
                                    style={[ styles.multilineBox ]}
                                    keyboardType='default'
                                    placeholderTextColor='white'
                                    underlineColorAndroid='transparent'
                                    autoCapitalize='none'
                                    secureTextEntry={this.state.showhidenPass} // ko dung dc khi multiline = {true}
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
                                    this.state.code === '' ||
                                    this.state.typeUsername === '' ||
                                    this.state.typedEmail === '' ? (
                                        [ 'grey', 'grey' ]
                                    ) : (
                                        [ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]
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
                                    disabled={
                                        this.state.code === '' ||
                                        this.state.typeUsername === '' ||
                                        this.state.typedEmail === '' ? (
                                            true
                                        ) : (
                                            false
                                        )
                                    }
                                    style={{
                                        fontSize: 16,
                                        color: 'white'
                                    }}
                                    onPress={/* this.onLogin */ () => {
                                        this.props.navigation.navigate(takepass);
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
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 0,
        marginBottom: 0,
        width: '90%'
    }
});
