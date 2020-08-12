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
    ActivityIndicator,
    BackHandler
} from 'react-native';
import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import { SignUp, fopass } from 'thitracnghiem/Navigation/screenName';
import { setItemToAsyncStorage, setItemToAsyncStorage1 } from 'thitracnghiem/Function/function';
import LinearGradient from 'react-native-linear-gradient';
import md5 from 'md5';
import OfflineNotice from 'thitracnghiem/Navigation/OfflineNotice.js';
import { NavigationActions, StackActions } from 'react-navigation';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
GoogleSignin.configure();
export default class loginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Username: '',
            Password: '',
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
        if (this.checkValue()) {
            Alert.alert('Thông báo', 'Tài khoản và mật khẩu không được để trống');
            return;
        };
        if (this.state.Password.length<6)
        {
            Alert.alert('Thông báo', 'Mật Khẩu phải từ 6 kí tự trở lên');
            return;
        }
        this.setState({
            loading: true
        });
        var user=this.state.Username.trim().toLowerCase();
        firebase.database().ref('Customer').orderByChild('Username').limitToFirst(1).equalTo(user).once(
            'value',
            (value) => {
                if (value.exists()) {
                    value.forEach(async (data) => {
                        if (data.toJSON().Password == md5(this.state.Password)) {
                            if (data.toJSON().Status == 1) {
                                var userData=data.toJSON();
                                userData.Id=data.key;
                                await setItemToAsyncStorage('userData', userData);
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
                    });
                }
                else {
                    Alert.alert('Thông báo', 'Tài Khoản Không Tồn Tại');
                    this.setState({
                        loading: false
                    });
                }
            },
            (error) => {
                Alert.alert('Thông báo', 'Lỗi Server');
                this.setState({
                    loading: false
                });
            }
        );
    };
    checkValue = () => {
        return this.state.Username.trim() === '' || this.state.Password === '';
    };
    connectfb = (token) => {
        this.setState({ loading: true });
        if (token!=null)
        {
            fetch('https://graph.facebook.com/v2.8/me?fields=id&access_token=' + token)
            .then((response) => response.json())
            .then((json) => {
             firebase.database().ref('Customer').orderByChild('Facebook').equalTo(json.id).limitToFirst(1).once(
                'value',
                (value) => {
                    if (value.exists()) {
                        value.forEach(async (data) => {
                            var userData=data.toJSON();
                            userData.Id=data.key;
                            await setItemToAsyncStorage('userData', userData);
                            await setItemToAsyncStorage1('key', data.key);
                            this.setState({
                                loading: false
                            });
                            Alert.alert('Thông báo', 'Đăng nhập thành công');
                            this.props.navigation.navigate('App');
                        });
                    }
                    else {
                        this.setState({
                            loading: false
                        });
                        Alert.alert(
                            'Thông báo',
                            'Facebook chưa liên kết với tài khoản, bạn có muốn đăng ký tài khoản mới và liên kết với Facebook?',
                            [
                                { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                {
                                    text: 'Có',
                                    onPress: async () => {
                                        this.props.navigation.dispatch(
                                            StackActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({
                                                        routeName: 'SignUp',
                                                        params: {
                                                            facebook: json.id
                                                        }
                                                    })
                                                ]
                                            }))
                                    }
                                }
                            ],
                            { cancelable: true }
                        )
                    }
                },
                (error) => {
                    Alert.alert('Thông báo', 'Lỗi Server');
                    this.setState({
                        loading: false
                    });
                }
            );
            })
            .catch(() => {
                this.setState({
                    loading: false
                });
                Alert.alert('Thông báo', 'Không thể lấy dữ liệu Facebook');
                return;
            });
        }
	}
	connectgg = (id) => {
        this.setState({ loading: true });
             firebase.database().ref('Customer').orderByChild('Google').equalTo(id).limitToFirst(1).once(
                'value',
                (value) => {
                    if (value.exists()) {
                        value.forEach(async (data) => {
                            var userData=data.toJSON();
                                userData.Id=data.key;
                                await setItemToAsyncStorage('userData', userData);
                            await setItemToAsyncStorage1('key', data.key);
                            this.setState({
                                loading: false
                            });
                            Alert.alert('Thông báo', 'Đăng nhập thành công');
                            this.props.navigation.navigate('App');
                        });
                    }
                    else {
                        this.setState({
                            loading: false
                        });
                        Alert.alert(
                            'Thông báo',
                            'Google chưa liên kết với tài khoản, bạn có muốn đăng ký tài khoản mới và liên kết với Google?',
                            [
                                { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                {
                                    text: 'Có',
                                    onPress: async () => {
                                        this.props.navigation.dispatch(
                                            StackActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({
                                                        routeName: 'SignUp',
                                                        params: {
                                                            google: id
                                                        }
                                                    })
                                                ]
                                            }))
                                    }
                                }
                            ],
                            { cancelable: true }
                        )
                    }
                },
                (error) => {
                    Alert.alert('Thông báo', 'Lỗi Server');
                    this.setState({
                        loading: false
                    });
                }
            );
	}
    componentDidMount() {
        this.backButton = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                'Thông báo',
                'Bạn có muốn thoát ứng dụng',
                [
                    { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    {
                        text: 'Có',
                        onPress: async () => {
                            BackHandler.exitApp();
                        }
                    }
                ],
                { cancelable: true }
            );
            return true;
        });
    }
    async componentWillUnmount() {
        AccessToken.getCurrentAccessToken().then(() => {
			LoginManager.logOut();
		}).catch(() => {
		});
		const isSignedIn = await GoogleSignin.isSignedIn();
		if (isSignedIn) {
			try {
				await GoogleSignin.revokeAccess();
				await GoogleSignin.signOut();
			} catch (error) {
				console.error(error);
			}
		}
    }
    render() {
        return (
            <View style={styles.contain}>
                <StatusBar backgroundColor='#1E90FF' barStyle='light-content' />
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                    pointerEvents={this.state.loading?'none':'auto'}
                >
                    <OfflineNotice />
                    <ScrollView  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
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
                                <TextInput
                                    style={styles.multilineBox}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='white'
                                    keyboardType='default'
                                    autoCapitalize='none'
                                    placeholder='Tài khoản *'
                                    editable={true}
                                    maxLength={100}
                                    onChangeText={(text) => {
                                        this.setState({ Username: text
                                         });
                                    }}
                                    onSubmitEditing={() => this.refs.Password.focus()}
                                />
                            </View>
                            <View style={[ styles.propertyValueRowView ]}>
                                <TextInput
                                    style={[ styles.multilineBox,{paddingRight:50} ]}
                                    keyboardType='default'
                                    placeholderTextColor='white'
                                    underlineColorAndroid='transparent'
                                    autoCapitalize='none'
                                    secureTextEntry={this.state.showhidenPass} 
                                    placeholder='Mật khẩu *'
                                    /* multiline={true} */
                                    editable={true}
                                    maxLength={100}
                                    onChangeText={(text) => {
                                        this.setState({ Password: text });
                                    }}
                                    ref={"Password"}
									onSubmitEditing={() => !this.checkValue() && !this.state.loading?this.onLogin():null}
                                />
                                <Button
                                    containerStyle={{
                                        position: 'absolute',
                                        right:'10%',
                                        height:'100%',
                                        justifyContent:'center'
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
                                    borderRadius: 5,
                                    width:'80%',
                                    paddingVertical:10,
                                    
                                }}
                                onPress={() => {
                                   this.props.navigation.navigate(fopass);
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: 'white',
                                        fontStyle: 'italic',
                                        textAlign:'right'
                                    }}
                                >
                                    Quên mật khẩu?
                                </Text>
                            </Button>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={
                                    this.checkValue() || this.state.loading ? (
                                        [ 'grey', 'grey' ]
                                    ) : (
                                        [ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]
                                    )
                                }
                                style={{    
                                    padding: '3%',
                                    borderRadius: 20,
                                    width: 250
                                }}
                            >
                                <Button
                                    disabled={this.checkValue() || this.state.loading ? true : false}
                                    style={{
                                        fontSize: 16,
                                        color: 'white'
                                    }}
                                    onPress={this.onLogin}
                                >
                                    ĐĂNG NHẬP
                                </Button>
                            </LinearGradient>
                            <Button
                                containerStyle={{
                                    padding: '3%',
                                    borderRadius: 5,
                                    alignSelf: 'center'
                                }}
                                onPress={() => {
                                   this.props.navigation.navigate(SignUp);
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
                            <View style={{ alignSelf: 'center', flexDirection: 'row', marginBottom: '5%' }}>
								<Button
									onPress={() => {
										LoginManager.logInWithPermissions(["public_profile"]).then(
											(result) => {
												if (result.isCancelled) {
													console.log("Login cancelled");
												} else {
													AccessToken.getCurrentAccessToken().then(
														(data) => {
															this.connectfb(data.accessToken.toString());
														}
													).catch(() => {
                                                        Alert.alert('Thông báo', 'Không thành công!')
													})

												}
											},
											(error) => {
                                                Alert.alert(
                                                    'Thông báo', 'Kết nối Facebook không thành công.'
                                                )
											}
										)
									}
									}
								>
									<Image
										style={{ width: 30, height: 30, marginRight: '5%' }}
										source={require('thitracnghiem/icons/icons8-facebook-480.png')} />
								</Button>
								<Button
									onPress={async () => {
										try {
											await GoogleSignin.hasPlayServices();
											var userInfo = await GoogleSignin.signIn();
											this.connectgg(userInfo.user.id);
										}
										catch (error) {
                                            console.log(error)
                                            Alert.alert(
                                                'Thông báo', 'Kết nối Google không thành công.'
                                            )
										}
									}}
								>
									<Image
										style={{ width: 30, height: 30 }}
										source={require('thitracnghiem/icons/icons8-google-plus-480.png')} />
								</Button>
							</View> 
					
                        </View>
                    </ScrollView>
                </ImageBackground>
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
        width: '90%',
        borderColor: 'rgba(255,255,255,0.7)',
        borderBottomWidth: 1,
        justifyContent:'center',
        borderRadius: 5,
        color: 'white',
        paddingVertical:15
    },
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom:0,
        width: '90%'
    }
});
