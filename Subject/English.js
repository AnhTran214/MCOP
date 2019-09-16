import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet, Alert, ImageBackground,StatusBar,Image} from 'react-native';
import Button from 'react-native-button';
import {Login, Home, info} from 'SystemManager/Navigation/screenName';
import AsyncStorage from '@react-native-community/async-storage';
 import firebase from 'react-native-firebase';
 import {setItemToAsyncStorage,getItemFromAsyncStorage} from 'SystemManager/Function/function';
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice';*/
import Header from 'SystemManager/subComponent/Header';
import FooterSub from 'SystemManager/subComponent/footerSub';

/* const LearnAppRef = firebase.database().ref('LearnApp/Users'); */
export default class engComponent extends Component{
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
				<Button
                        containerStyle={{
                            width: 30,
							margin: '2%',
							alignSelf: 'flex-start',
                    }}
						onPress={async () => {
							this.props.navigation.goBack();
						}}>
                            <Image
						style={{
							width: 30,
                            height: 30,
                            margin: '2%',
                            tintColor: '#1E90FF'
						}}
						source={require('SystemManager/icons/back.png')}
					/>
					</Button>
                <ScrollView>
                <View style = {{alignItems:'center', justifyContent:'center'}}>
                <Text
					style={{
						fontSize: 22,
						fontWeight: 'bold',
						textAlign: 'center',
                        color: '#1E90FF',
                        marginTop: '1%'
					}}>
					Tiếng anh
				</Text>
				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						textAlign: 'center',
                        color: 'black',
                        marginTop: '1%'
					}}>
					{this.state.count}
				</Text>
				<Button
						containerStyle={{
							margin: '5%',
							padding: '3%',
							backgroundColor: '#F1F1F1',
                            borderRadius: 50 ,
							width: 100,
							borderColor: '#1E90FF',
							borderWidth: 3,
						}}
						style={{
							fontSize: 16,
							color: 'grey'
						}}
						onPress= { this.startclock.bind(this)} >
						Start
					</Button>
                </View>
                </ScrollView>
				<FooterSub {...this.props} />
				{/* </ImageBackground> */}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor:'white'
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