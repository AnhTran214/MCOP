import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet, Alert, ImageBackground,StatusBar, Image} from 'react-native';
import Button from 'react-native-button';
import {Login, Home, lite, math, eng, listques} from 'SystemManager/Navigation/screenName';
import AsyncStorage from '@react-native-community/async-storage';
 import firebase from 'react-native-firebase';
 import {setItemToAsyncStorage,getItemFromAsyncStorage} from 'SystemManager/Function/function';
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice';*/
import Header from 'SystemManager/subComponent/Header';
import Footer from 'SystemManager/subComponent/footer';

/* const LearnAppRef = firebase.database().ref('LearnApp/Users'); */
export default class homeComponent extends Component{
	constructor(props){
        super(props);
        this.state = ({
            loading: false,
            email: '',
            currentItemId: '',
            itemData: {},
            typedEmail: '',
            shortEmail: '',
            userData: {},
			pickerDisplayed: false,
			currentUser: null,
			userData: {},
			count : 5
        });
    }
     startclock = async () => {
		 var t = 5;
		var temp = await setInterval(() => {
			 if(t != 0)
			 {
				 t--;
				 this.setState ({ count: t })
			 }
			 else
			 {
				Alert.alert('Thông báo','Cuộc thi kết thúc')
				clearInterval(temp);
			 }
		 },1000);
	 }
	 deleteUser = () => {
		firebase
			.auth()
			.currentUser
			.delete() 
			.then( async () => {
				Alert.alert('Thông báo', 'Xóa tài khoản thành công');
				await LearnAppRef.orderByChild('id')
				.equalTo(this.state.userData.id)
				.on('child_added', (data) => {
					data.key;
					LearnAppRef.child(data.key).remove();
				}); 
                    await AsyncStorage.clear();
                    this.props.navigation.navigate(Login);
			})
			.catch((error) => {
				Alert.alert(`${error.toString().replace('Error: ', '')}`);
			});
	};
	
	 async componentDidMount() {
		const { currentUser } = firebase.auth()
		this.setState({ currentUser })
		await setItemToAsyncStorage('currentScreen', Home);
    	const currentItemId = await getItemFromAsyncStorage('currentItemId');
    	await AsyncStorage.getItem('userData').then((value) => {
        const userData = JSON.parse(value);
        this.setState({
            currentItemId: currentItemId,
            userData: userData
        });
        const shortEmail = this.state.userData.email.split('@').shift();
        this.setState({
      typedEmail: this.state.userData.email,
            shortEmail: shortEmail
        });
		});
		console.log('userdata', this.state.userData)

	  } 
    render(){
		const { currentUser } = this.state
        return(
            <View style = {styles.contain}>
				{/* <ImageBackground source = {require('PhanAnh/Image/blue-technology-4669.jpg')} style={{width: '100%', height: '100%'}}>
				<OfflineNotice/>*/}
				 <Header {...this.props} />
                <ScrollView>
                <Text
					style={{
						fontSize: 22,
						fontWeight: 'bold',
						textAlign: 'center',
                        color: '#1E90FF',
						marginTop: '1%',
						fontStyle:'italic'
					}}>
					M.C.O.P
				</Text>
				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						textAlign: 'center',
                        color: '#1E90FF',
						margin: '1%',
						fontStyle:'italic'
					}}>
					Thi trắc nghiệm online
				</Text>
					<View style ={{
						flexDirection:'row',
						width:'100%',
						flexWrap: 'wrap',
						justifyContent: 'center'
					}}>
						<View style = {{
								width: 150,
								height: 200,
								backgroundColor: 'white',
								borderColor: '#1E90FF',
								borderWidth: 2,
								margin: '2%',
								alignItems:'center',
								justifyContent:'center',
								borderRadius: 10,
						}}>
							<Image style = {{
								width: 50,
								height: 50,
								tintColor: '#1E90FF'
							}}
							source = {require('SystemManager/icons/icons8-coordinate-system-80.png')}
							/>
							<Text style = {{
								fontWeight:'bold',
								fontSize: 18
							}}>
								Toán
							</Text>
							<Text style = {{
								fontSize: 13,
								color:'grey',
								marginBottom:'2%'
							}}>
								10 câu, 90 phút
							</Text>
						<Button
						containerStyle={{
							margin: '2%',
							padding: '2%',
							backgroundColor: '#F1F1F1',
                            borderRadius: 50 ,
							width: 120,
							borderColor: '#1E90FF',
							borderWidth: 3,
						}}
						style={{
							fontSize: 16,
							color: 'grey'
						}}
						onPress= { async () => {
							  this.props.navigation.navigate(listques);
						}} >
						Thi ngay
						</Button>
						</View>

						<View style = {{
								width: 150,
								height: 200,
								backgroundColor: 'white',
								borderColor: '#1E90FF',
								borderWidth: 2,
								margin: '2%',
								alignItems:'center',
								justifyContent:'center',
								borderRadius: 10
						}}>
							<Image style = {{
								width: 50,
								height: 50,
								tintColor: '#1E90FF'
							}}
							source = {require('SystemManager/icons/icons8-earth-planet-64.png')}
							/>
							<Text style = {{
								fontWeight:'bold',
								fontSize: 18
							}}>
								Tiếng anh
							</Text>
							<Text style = {{
								fontSize: 13,
								color:'grey',
								marginBottom:'2%'
							}}>
								15 câu, 10 phút
							</Text>
							<Button
						containerStyle={{
							margin: '2%',
							padding: '2%',
							backgroundColor: '#F1F1F1',
                            borderRadius: 50 ,
							width: 120,
							borderColor: '#1E90FF',
							borderWidth: 3,
						}}
						style={{
							fontSize: 16,
							color: 'grey'
						}}
						onPress= { async () => {
							  this.props.navigation.navigate(eng);
						}} >
						Thi ngay
						</Button>
						</View>
						<View style = {{
								width: 150,
								height: 200,
								backgroundColor: 'white',
								borderColor: '#1E90FF',
								borderWidth: 2,
								margin: '2%',
								alignItems:'center',
								justifyContent:'center',
								borderRadius: 10
						}}>
							<Image style = {{
								width: 50,
								height: 50,
								tintColor: '#1E90FF'
							}}
							source = {require('SystemManager/icons/icons8-literature-80.png')}
							/>
							<Text style = {{
								fontWeight:'bold',
								fontSize: 18
							}}>
								Văn học
							</Text>
							<Text style = {{
								fontSize: 13,
								color:'grey',
								marginBottom:'2%'
							}}>
								20 câu, 15 phút
							</Text>
							<Button
						containerStyle={{
							margin: '2%',
							padding: '2%',
							backgroundColor: '#F1F1F1',
                            borderRadius: 50 ,
							width: 120,
							borderColor: '#1E90FF',
							borderWidth: 3,
						}}
						style={{
							fontSize: 16,
							color: 'grey'
						}}
						onPress= { async () => {
							  this.props.navigation.navigate(lite);
						}} >
						Thi ngay
						</Button>
						</View>
						<View style = {{
								width: 150,
								height: 200,
								backgroundColor: 'white',
								borderColor: '#1E90FF',
								borderWidth: 2,
								margin: '2%',
								alignItems:'center',
								justifyContent:'center',
								borderRadius: 10
						}}>
							<Text style = {{
								fontWeight:'bold',
								fontSize: 18
							}}>
								...
							</Text>
						</View>
					</View>
               {/*  <Button
						containerStyle={{
							margin: '5%',
							padding: '3%',
							backgroundColor: '#F1F1F1',
                            borderRadius: 5 ,
							width: 150,
							borderColor: '#1E90FF',
							borderWidth: 3,
						}}
						style={{
							fontSize: 16,
							color: 'grey'
						}}
						onPress={ async () => {
							Alert.alert('Thông báo', 'Đăng xuất thành công');
							await AsyncStorage.clear();
							this.props.navigation.navigate(Login);
						}}>
						Đăng xuất
					</Button> */}
                {/* <Button
						containerStyle={{
							margin: '5%',
							padding: '3%',
							backgroundColor: 'white',
                            borderRadius: 5 ,
							width: 300,
							borderColor: '#66CDAA',
							borderWidth: 3,
						}}
						style={{
							fontSize: 16,
							color: 'grey'
						}}
						onPress={async () => {
							const { navigate } = this.props.navigation;//chu y
                    		navigate(Info);
						}}>
						Danh sách tài khoản nhân viên
					</Button> */}
                    {/* <Button
						containerStyle={{
							margin: '5%',
							padding: '3%',
							backgroundColor: 'white',
                            borderRadius: 5 ,
							width: 300,
							borderColor: '#66CDAA',
							borderWidth: 3,
						}}
						style={{
							fontSize: 16,
							color: 'grey'
						}}
						onPress={async () => {
							const {navigate} = this.props.navigation;
							navigate(addAccount);
						}}>
						Thêm tài khoản
					</Button> */}
				{/* <Button containerStyle={{
							margin: '5%',
							padding: '3%',
							backgroundColor: 'red',
                            borderRadius: 5 ,
						}}
						style={{
							fontSize: 16,
							color: 'white'
						}}
                onPress = {this.deleteUser}
				>
                    Xóa tài khoản
				</Button> */}
                </ScrollView>
				<Footer {...this.props} />
				{/* </ImageBackground> */}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor:'#F1F1F1'
    },
    multilineBox: {
		width: '96%',
		height: 50,
		marginTop: 20,
		borderColor: '#66CDAA',
		borderWidth: 2,
        textAlignVertical: 'top',
         backgroundColor: 'white',
        marginLeft: '2%',
        marginRight: '2%',
        borderRadius:5
  },
  propertyValueRowView: {
		flexDirection: 'row',
        justifyContent: 'flex-start',
		marginTop: 0,
		marginBottom: 0
  },
})