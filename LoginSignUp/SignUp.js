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
	ScrollView,StatusBar,ActivityIndicator
} from 'react-native';
 import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import {Login} from 'thitracnghiem/Navigation/screenName';
 import AsyncStorage from '@react-native-community/async-storage';
import {setItemToAsyncStorage,setItemToAsyncStorage1} from 'thitracnghiem/Function/function';
import LinearGradient from 'react-native-linear-gradient';
import md5 from 'md5';
import OfflineNotice from 'thitracnghiem/Navigation/OfflineNotice.js'
 
 const LearnAppRefUsers = firebase.database().ref('Customer');
export default class signupComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			role: 'Người dùng',
			isUploading: false,
			Username: '',
            Fullname: '',
            Phone: '',
            Email: '',
            Address: '',
            Birthday: '',
            Password: '',
			Status: 1,
			Image:'',
			rePassword:'' ,
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
	//ham thuc thi dang ky
	 onRegister = () => {
		if (this.state.Username == '' || this.state.Password == '' || this.state.Fullname == '') {
			Alert.alert('Thông báo','Xin bạn hãy nhập đầy đủ thông tin...');
			return;
		}
		this.setState({
			loading: true
		});
		LearnAppRefUsers.orderByChild("Username").equalTo(this.state.Username).once('value', (value) => {
			if (value.exists()) {
				Alert.alert('Thông báo', 'Tài Khoản Đã Tồn Tại');
				this.setState({
					loading: false
				});
			}
			else {
				LearnAppRefUsers.push(
					{
						Username: this.state.Username,
						Fullname: this.state.Fullname,
						Phone: '',
						Email:  '',
						Address: '',
						Birthday: '',
						Password: md5(this.state.Password),
						Status: 1,
						Image:'',
					}
				);
				LearnAppRefUsers.orderByChild("Username").equalTo(this.state.Username).once('value', (value) => {
					if (value.exists()) {
						value.forEach(async(data)=>
						{
								   await setItemToAsyncStorage('userData', value.val());
								   await setItemToAsyncStorage1('key', data.key);
									this.setState({
										loading: false
									});
									Alert.alert('Thông báo','Đăng ký thành công\nTự động đăng nhập...');
									console.log(value.val());
									this.props.navigation.navigate('App');
							return;
						})
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
			}

		})
	
	}

	  checkValue = () =>
	  {
		return this.state.Password !== this.state.rePassword || (this.state.typedUsername ==='' || this.state.Fullname ==='' || this.state.Password ==='' || this.state.rePassword === '');
	  }

	render() {
		return (
            <View style = {styles.contain}>
				<StatusBar 
                backgroundColor = "#1E90FF"
                barStyle = "light-content"
                />
			<ImageBackground source = {require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')} style={{width: '100%', height: '100%'}}>
				 <OfflineNotice />
				<ScrollView>
					<View
					style = {{
						flexDirection: 'row',
						justifyContent: 'flex-start',
						marginLeft:'5%',
						marginRight: '5%',
						marginTop: '5%',
						justifyContent: 'space-between',
						width:'90%',
						/* backgroundColor: 'red' */
					}}
					>
						<Button
						containerStyle = {{
							padding:10,
							/* backgroundColor:'white', */
						}}
						style = {{
							color:'white',
							marginBottom: '20%'
						}}
						onPress = {() => {
							const { navigate } = this.props.navigation;//chu y
							navigate(Login);
						}}>
						<Image 
						style = {{width:30, height:30, tintColor: 'white'}}
						source = {require('thitracnghiem/icons/back.png')}/>
					</Button>
						<Button
						containerStyle = {{
							padding:10,
							/* backgroundColor:'white' */
						}}
						style = {{
							color:'white',
							marginBottom: '20%'
						}}
						onPress = {() => {
							const { navigate } = this.props.navigation;//chu y
							navigate(Login);
						}}>
						Login
					</Button>
					</View>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent:'center',
					marginTop: Platform.OS == 'ios' ? '5%' : 0,
					borderRadius: Platform.OS == 'ios' ? '5%' : 0
				}}>
					<View style = {{alignItems: 'center',marginTop: '5%'}}>
				<Text
					style={{
						fontSize: 22,
						fontWeight: 'bold',
						textAlign: 'center',
						color: 'white',
					}}>
					ĐĂNG KÝ
				</Text>
				<View style={[styles.propertyValueRowView]}>
				<TextInput
					style={styles.multilineBox }
					keyboardType='default'
					underlineColorAndroid="transparent"
					placeholderTextColor = "white"
					placeholder='Nhập họ và tên'
					maxLength={255}
					autoCapitalize='none' // khong tu dong viet hoa
					onChangeText={(text) => {
						this.setState({
							Fullname: text
						});
					}}
				/>
				</View>
				<View style={[styles.propertyValueRowView]}>
				<TextInput
					style={styles.multilineBox }
					underlineColorAndroid="transparent"
					placeholderTextColor = "white"
					keyboardType='default'
					maxLength={255}
					placeholder='Nhập Username'
					autoCapitalize='none' // khong tu dong viet hoa
					onChangeText={(text) => {
						this.setState({
							Username: text
						});
					}}
				/>
				</View>
				<View style={[styles.propertyValueRowView]}>
				<TextInput
					style={styles.multilineBox1}
					keyboardType='default'
					placeholderTextColor = "white"
					placeholder='Nhập mật khẩu'
					secureTextEntry={this.state.showhidenPass} 
					autoCapitalize='none'
					maxLength={100}
					onChangeText={(text) => {
						this.setState({
							Password: text
						});
					}}
				/>
				  <Button
                                    containerStyle={{
                                        position: 'absolute',
                                        right:'5%',
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
				<View style={[styles.propertyValueRowView]}>
				<TextInput
					style={styles.multilineBox }
					keyboardType='default'
					placeholderTextColor = "white"
					placeholder='Nhập lại mật khẩu'
					secureTextEntry={this.state.showhidenPass} 
					autoCapitalize='none'
					onChangeText={(text) => {
						this.setState({
							rePassword: text
						});
					}}
				/>
				</View>
				{this.state.rePassword.trim().length>0 && this.state.rePassword!=this.state.Password?<Text style={{color:'red',textAlign:'center'}}>Mật khẩu nhập lại không trùng khớp</Text>:null}
				<LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
				colors = {this.checkValue()?['grey','grey']:['rgb(86, 123, 248)', 'rgb(95,192,255)']}
				style = {{
					margin: '3%',
					padding: '3%',
					width: 250,
					borderRadius: 20 ,
				}}
				>
					<Button
					disabled = {this.checkValue()? true: false}
						style={{
							fontSize: 16,
							color: 'white'
						}}
						onPress= { 
							 this.onRegister}>
						{/* <Image source={require('Demon/icons/design-team-512.png')} style={{
						padding: 10,
						height: 25,
						width: 25,
						resizeMode : 'stretch',
						marginRight: '2%'
				}} /> */}
						ĐĂNG KÝ
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
				</View>
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
        backgroundColor:'#00008B'
    },
    multilineBox: {
		width: '96%',
		height: 50,
		marginTop: 20,
		borderColor: 'rgba(255,255,255,0.7)',
		borderBottomWidth: 1,
        textAlignVertical: 'top',
        marginLeft: '2%',
        marginRight: '2%',
		borderRadius:5,
		color: 'white'
  },
  multilineBox1: {
	width: '96%',
	height: 50,
	marginTop: 20,
	borderColor: 'rgba(255,255,255,0.7)',
	borderBottomWidth: 1,
	textAlignVertical: 'top',
	marginLeft: '2%',
	marginRight: '2%',
	paddingRight: 50,
	borderRadius:5,
	color: 'white'
},
  propertyValueRowView: {
		flexDirection: 'row',
        justifyContent: 'flex-start',
		marginTop: 0,
		marginBottom: 0,
		width: '100%'
  },
  dropdownView: {
    width: '100%',
    height: 25,
    fontSize: 13,
    marginBottom: '1%',
    marginTop: '2%',
},
})