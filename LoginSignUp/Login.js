import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet, Alert, TextInput, ImageBackground, Image,StatusBar} from 'react-native';
 import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import {SignUp, Home} from 'SystemManager/Navigation/screenName';
 import {setItemToAsyncStorage} from 'SystemManager/Function/function';
/*import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice' */
import LinearGradient from 'react-native-linear-gradient';

const LearnAppRefUsers = firebase.database().ref('Manager/User');
export default class loginComponent extends Component{
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
			showhidenPass: true
		};
	}
	showhidenPassword = () => {
		if(this.state.showhidenPass === true)
		{
			this.setState ({showhidenPass: false})
		}
		else{this.setState ({showhidenPass: true})}
	} 
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
			LearnAppRefUsers.orderByChild('email')
				.equalTo(this.state.typedEmail)
				.on('value', (childSnapshot) => {
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
		if (this.state.typedEmail == '' || this.state.typedPassword == '') {
			Alert.alert('Thông báo','Email và Password không được bỏ trống');
			return;
		}
		firebase
			.auth()
			.signInWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword) 
			.then( async (loginUser) => {
				const userData = await this.getUserFromDB();
				setItemToAsyncStorage('userData', userData);
				Alert.alert('Thông báo','Đăng nhập thành công');
				this.props.navigation.navigate('App');
			})
			.catch((error) => {
				Alert.alert(`${error.toString().replace('Error: ', '')}`);
			});
	}; 

    render(){
        return(
            <View style = {styles.contain}>
				<StatusBar 
                backgroundColor = "#1E90FF"
                barStyle = "light-content"
                />
				 <ImageBackground source = {require('SystemManager/img/70331284_752704455184910_2392173157533351936_n.jpg')} style={{width: '100%', height: '100%'}}>
				{/* <OfflineNotice /> */}
                <ScrollView>
                <View style = {{alignItems:'center', justifyContent:'center'}}>
				<Image
					source = {require('SystemManager/img/imageedit_18_6287752576.png')}
					style = {{
						width: 200,
						height: 200,
						marginTop: '5%',
					}}
					/>
                <View style={[styles.propertyValueRowView]}>
				<Image 
				style = {{width:30, height:30, tintColor: 'white',position : 'absolute',top:'40%'}}
				source = {require('SystemManager/icons/user.png')}/>
                    <TextInput
						style={styles.multilineBox }
						underlineColorAndroid="transparent"
						placeholderTextColor = "white"
						keyboardType='email-address'
						autoCapitalize='none'
						placeholder='Tài khoản'
						editable={true}
						maxLength={50}
						onChangeText={(text) => {
							this.setState({ typedEmail: text });
						}}
					/>
                    </View> 
                <View style={[styles.propertyValueRowView,{marginBottom:'5%'}]}>
				<Image 
				style = {{width:30, height:30, tintColor: 'white',position : 'absolute',top:'40%'}}
				source = {require('SystemManager/icons/56255.png')}/>
                    <TextInput
						style={[styles.multilineBox]}
						keyboardType='default'
						placeholderTextColor = "white"
						underlineColorAndroid="transparent"
						autoCapitalize='none'
						secureTextEntry={ this.state.showhidenPass }// ko dung dc khi multiline = {true}
						placeholder='Mật khẩu'
						/* multiline={true} */
						editable={true}
						maxLength={50}
						onChangeText={(text) => {
							this.setState({ typedPassword: text });
						}}
					/>
					<Button 
				containerStyle = {{ 
				position : 'absolute',
				left :'80%',
				top: '40%'
				}}
				onPress = {this.showhidenPassword.bind(this.state.showhidenPass)}>
				{this.state.showhidenPass === true ? 
				<Image 
				style = {{width:30, height:30, tintColor: 'white'}}
				source = {require('SystemManager/icons/2d4e09879b6f017f74ffaee0b0011c0a-eye-icon-by-vexels.png')}/>
				: 
				<Image 
				style = {{width:30, height:30,tintColor: 'white'}}
				source = {require('SystemManager/icons/mob32px045-512.png')}/>
				}
				</Button>
                </View> 
				<LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
				colors = {['rgb(86, 123, 248)', 'rgb(95,192,255)']}
				style = {{
					margin: '3%',
					padding: '3%',
					borderRadius: 20 ,
					width: 250
				}}
				>
                <Button
						style={{
							fontSize: 16,
							color: 'white'
						}}
						onPress= {this.onLogin}>
						ĐĂNG NHẬP
					</Button>
					</LinearGradient>
                    <Button
						containerStyle={{
							padding: '3%',
							borderRadius: 5,
							alignSelf:'center'
						}}
						onPress = {() => {
							const { navigate } = this.props.navigation;//chu y
							navigate(SignUp);
						}}>
						<Text style={{
							fontSize: 11,
							color: 'white',
							fontStyle: 'italic'
						}}>
							Bạn chưa có tài khoản? <Text style = {{color:'#1E90FF',fontStyle: 'italic'}}>Đăng ký</Text>
						</Text>
					</Button>
					<Text
					style={{
						fontSize: 22,
						fontWeight: 'bold',
						textAlign: 'center',
                        color: 'white',
						marginBottom:'5%'
					}}>
				</Text>
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
		width: '80%',
		height: 50,
		marginTop: 20,
		borderColor: 'rgba(255,255,255,0.7)',
		borderBottomWidth: 1,
        textAlignVertical: 'top',
        marginLeft: '10%',
        marginRight: '2%',
		borderRadius:5,
		color: 'white'
  },
  propertyValueRowView: {
		flexDirection: 'row',
        justifyContent: 'flex-start',
		marginTop: 0,
		marginBottom: 0,
		width: '90%'
  },
})