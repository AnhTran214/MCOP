import React, { Component } from 'react';
import {
	Text,
	View,
	Alert,
	StyleSheet,
	Image,
	TextInput,
	Platform,
	ImageBackground,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    BackHandler
} from 'react-native';
 import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import {Login} from 'thitracnghiem/Navigation/screenName';
import {setItemToAsyncStorage} from 'thitracnghiem/Function/function';
import LinearGradient from 'react-native-linear-gradient';
import md5 from 'md5';
import OfflineNotice from 'thitracnghiem/Navigation/OfflineNotice.js'
 
 const LearnAppRefUsers = firebase.database().ref('Customer');
export default class signupComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Username: '',
			Password: '',
            Fullname: '',
            rePassword:'',
            FacebookID : '',
            GoogleID:'',
			loading: false,
			showhidenPass: true,
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
	 onRegister = () => {
		if (this.state.Username == '' || this.state.Password == '') {
			Alert.alert('Thông báo','Tài Khoản và Mật Khẩu không được để trống');
			return;
		}
		if (this.state.Password.length<6)
		{
			Alert.alert('Thông báo','Mật khẩu phải từ 6 kí tự trở lên');
			return;
		}
		if (this.state.Password!=this.state.rePassword) {
			Alert.alert('Thông báo','Tài Khoản và Mật Khẩu không được để trống');
			return;
		}
		this.setState({
			loading: true
		});
		var username= this.state.Username.trim();
		var fullname= this.state.Fullname.trim();
		LearnAppRefUsers.orderByChild("Username").equalTo(username).limitToFirst(1).once('value', async(value) => {
			if (value.exists()) {
				Alert.alert('Thông báo', 'Tài Khoản Đã Tồn Tại');
				this.setState({
					loading: false
				});
			}
			else {
				var userData={
					Username: username,
					Fullname:fullname,
					Phone: '',
					Email:  '',
					Address: '',
					Birthday: '',
                    Password: md5(this.state.Password),
                    Facebook: this.state.FacebookID,
                    Google: this.state.GoogleID,
					Status: 1,
					Image:'',
				};
			var key=LearnAppRefUsers.push(userData).key;
				if (key!=null)
				{
					userData["Id"]=key;
					await setItemToAsyncStorage('userData', userData);
					this.setState({
						loading: false
					});
					Alert.alert('Thông báo','Đăng ký thành công\nTự động đăng nhập...');
					this.props.navigation.navigate('App');
				}
				else
				{
					Alert.alert('Thông báo', 'Đăng Ký Thất Bại');
					this.setState({
						loading: false
					});
				}
			}

		})
	
	}

	  checkValue = () =>
	  {
		return this.state.Username.trim() ==='' || this.state.Fullname.trim() ==='' || this.state.Password ==='' || this.state.rePassword === '';
	  }
      componentDidMount() {
        this.state.FacebookID = this.props.navigation.getParam('facebook', '');
        this.state.GoogleID = this.props.navigation.getParam('google', '');
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
					<View
					style = {{
						position:'absolute',
						left:0,
						top:0
					}}
					>
						<Button
						containerStyle = {{
							padding:10,
						}}
						style = {{
							color:'white',
						}}
						onPress = {() => {
							this.props.navigation.navigate(Login);
						}}>
						<Image 
						style = {{width:30, height:30, tintColor: 'white'}}
						source = {require('thitracnghiem/icons/back.png')}/>
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
                                        this.setState({ Username: text });
									}}
									onSubmitEditing={()=>this.refs.Fullname.focus()}
                                />
                            </View>
							<View style={[ styles.propertyValueRowView ]}>
                                <TextInput
                                    style={styles.multilineBox}
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor='white'
                                    keyboardType='default'
                                    autoCapitalize='none'
                                    placeholder='Họ Tên'
                                    editable={true}
                                    maxLength={100}
                                    onChangeText={(text) => {
                                        this.setState({ Fullname: text });
									}}
									ref={'Fullname'}
									onSubmitEditing={()=>this.refs.Password.focus()}
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
                                    editable={true}
                                    maxLength={100}
                                    onChangeText={(text) => {
                                        this.setState({ Password: text });
									}}
									ref={'Password'}
									onSubmitEditing={()=>this.refs.rePassword.focus()}
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
                            <View style={[ styles.propertyValueRowView ]}>
                                <TextInput
                                    style={[ styles.multilineBox ]}
                                    keyboardType='default'
                                    placeholderTextColor='white'
                                    underlineColorAndroid='transparent'
                                    autoCapitalize='none'
                                    secureTextEntry={this.state.showhidenPass} 
                                    placeholder='Nhập Lại Mật khẩu *'
                                    editable={true}
                                    maxLength={100}
                                    onChangeText={(text) => {
                                        this.setState({ rePassword: text });
									}}
									ref={'rePassword'}
									onSubmitEditing={()=>!this.checkValue() && !this.state.loading?this.onRegister():null}
                                />
                            </View>
						    <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={
									this.checkValue() ||	 this.state.loading?  (
                                        [ 'grey', 'grey' ]
                                    ) : (
                                        [ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]
                                    )
                                }
                                style={{
                                    margin: 10,
                                    padding: '3%',
                                    borderRadius: 20,
                                    width: 250
                                }}
                            >
                                <Button
                                    disabled={this.checkValue() || this.state.loading? true : false}
                                    style={{
                                        fontSize: 16,
                                        color: 'white'
                                    }}
                                    onPress={this.onRegister}
                                >
                                    ĐĂNG KÝ
                                </Button>
                            </LinearGradient>
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
    },
  dropdownView: {
    width: '100%',
    height: 25,
    fontSize: 13,
    marginBottom: '1%',
    marginTop: '2%',
},
})