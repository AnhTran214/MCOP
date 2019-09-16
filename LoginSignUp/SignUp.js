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
	ScrollView,StatusBar
} from 'react-native';
 import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import {Login} from 'SystemManager/Navigation/screenName';
 import AsyncStorage from '@react-native-community/async-storage';
import {setItemToAsyncStorage} from 'SystemManager/Function/function';
/*import OfflineNotice from 'Demon/Democode/infor/OfflineNotice' */

 
 const LearnAppRefUsers = firebase.database().ref('Manager/User');
export default class signupComponent extends Component {
	/* static navigationOptions = ({ navigation }) => {
		let drawerLabel = 'Register';
		return { drawerLabel};
	} */
	constructor(props) {
		super(props);
		this.unsubcriber = null; // 1 cai object quan sat viec thay doi user
		this.state = {
			typedEmail: '',
			typedPassword: '',
			user: '',
			role: 'Người dùng',
			isUploading: false,
			code: '',
			pickerSelection: 'Chọn quyền',// gia tri ban dau cua chu
			pickerDisplayed: false,
			name: ''  
		};
	}

	// unsubcriber is called when ever the user changed
	// khi trang thai dang nhap thay doi se chui vao ham onAuthStateChanged((changedUser).....
	 componentDidMount() {
		this.unsubcriber = firebase.auth().onAuthStateChanged((changedUser) => {
			this.setState({
				user: changedUser
			});// cap nhat lai user
		});
	}

	 componentWillUnmount() {
		if (this.unsubcriber) {
			this.unsubcriber();
		}
	}
	//ham thuc thi dang ky
	 onRegister = () => {
		if (this.state.typedEmail == '' || this.state.typedPassword == '' || this.state.name == '') {
			Alert.alert('Thông báo','Xin bạn hãy nhập đầy đủ thông tin...');
			return;
		}
		firebase
			.auth()
			.createUserWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword) // tao ra email va pass voi createUserWithEmailAndPassword va email va pass lay tu state
            //dang ky thanh cong thi user = registerUser ban nhap
			.then( async () => {
				const userData = {
					id: require('random-string')({ length: 10 }),
                    email: this.state.typedEmail,
                    password: this.state.typedPassword,
					role: this.state.role,
					name: this.state.name
                };

                LearnAppRefUsers.push(userData); // Đẩy lên Database
                    
                await setItemToAsyncStorage('userData', userData); // Đẩy lên AsyncStorage
                Alert.alert('Thông báo','Đăng ký thành công\nTự động đăng nhập...');
                 this.props.navigation.navigate('App');

        })
			//dang ky that bai
			.catch((error) => {
				alert(`${error.toString().replace('Error: ', '')}`);
			});
	};

	//thay doi gia tri chu
	 setPickerValue(newValue) {
		this.setState({
		  pickerSelection: newValue,
		  role : newValue
		})
	
		this.togglePicker();
	  }
	 //an hien danh sach
	  togglePicker() {
		this.setState({
		  pickerDisplayed: !this.state.pickerDisplayed
		})
	  }

	render() {
		return (
            <View style = {styles.contain}>
				<StatusBar 
                backgroundColor = "#1E90FF"
                barStyle = "light-content"
                />
			<ImageBackground source = {require('SystemManager/img/70331284_752704455184910_2392173157533351936_n.jpg')} style={{width: '100%', height: '100%'}}>
				{/* <OfflineNotice /> */}
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
						source = {require('SystemManager/icons/back.png')}/>
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
					ĐĂNG KÝ TÀI KHOẢN
				</Text>
				<View style={[styles.propertyValueRowView]}>
				<TextInput
					style={styles.multilineBox }
					keyboardType='default'
					underlineColorAndroid="transparent"
					placeholderTextColor = "white"
					placeholder='Nhập họ và tên'
					autoCapitalize='none' // khong tu dong viet hoa
					onChangeText={(text) => {
						this.setState({
							name: text
						});
					}}
				/>
				</View>
				<View style={[styles.propertyValueRowView]}>
				<TextInput
					style={styles.multilineBox }
					underlineColorAndroid="transparent"
					placeholderTextColor = "white"
					keyboardType='email-address'
					placeholder='Nhập tài khoản'
					autoCapitalize='none' // khong tu dong viet hoa
					onChangeText={(text) => {
						this.setState({
							typedEmail: text
						});
					}}
				/>
				</View>
				<View style={[styles.propertyValueRowView]}>
				<TextInput
					style={styles.multilineBox }
					keyboardType='default'
					placeholderTextColor = "white"
					placeholder='Nhập mật khẩu'
					secureTextEntry={true}
					autoCapitalize='none'
					onChangeText={(text) => {
						this.setState({
							typedPassword: text
						});
					}}
				/>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<Button
						containerStyle={{
							margin: '5%',
							padding: '3%',
							backgroundColor: '#1E90FF',
							borderRadius: 50 ,
						}}
						style={{
							fontSize: 16,
							color: 'white'
						}}
						onPress= {async () => {
							await this.onRegister();
						}}>
						{/* <Image source={require('Demon/icons/design-team-512.png')} style={{
						padding: 10,
						height: 25,
						width: 25,
						resizeMode : 'stretch',
						marginRight: '2%'
				}} /> */}
						Đăng Ký
					</Button>
				</View>
				<Text style = {{
                                fontSize: 16,
                                fontWeight: 'bold',
                                fontStyle: 'italic',
								color: 'white',
								alignSelf: 'flex-start',  
								marginLeft: '2%'
                            }}>
								Chú ý:
				</Text>
				<Text style = {{
                                fontSize: 16,
                                fontWeight: 'bold',
                                fontStyle: 'italic',
								color: 'white',
								alignSelf: 'flex-start', 
								marginLeft: '5%'
                            }}>
								 1. Tài khoản đăng ký phải theo quy tắc: (Tên tự do)@gmail.com và không viết hoa các chữ cái (bắt buộc).
				</Text>
				<Text style = {{
                                fontSize: 16,
                                fontWeight: 'bold',
                                fontStyle: 'italic',
								color: 'white',
								alignSelf: 'flex-start', 
								marginLeft: '5%',
								marginBottom: '5%'
                            }}>
								 2. Mật khẩu đăng ký phải có 6 ký tự gồm cả chữ (không viết hoa các chữ cái) và số (bắt buộc).
				</Text>
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
		borderColor: '#1E90FF',
		borderBottomWidth: 5,
        textAlignVertical: 'top',
        marginLeft: '2%',
        marginRight: '2%',
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
