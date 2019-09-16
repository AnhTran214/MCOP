import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet, Alert, ImageBackground,StatusBar,Image, TextInput} from 'react-native';
import Button from 'react-native-button';
import {Login, Home, info} from 'SystemManager/Navigation/screenName';
import AsyncStorage from '@react-native-community/async-storage';
 import firebase from 'react-native-firebase';
 import {setItemToAsyncStorage,getItemFromAsyncStorage} from 'SystemManager/Function/function';
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice';*/
import Header from 'SystemManager/subComponent/Header';
import FooterSub from 'SystemManager/subComponent/footerSub';
import ListquesHeaderComponent from 'SystemManager/subComponent/ListquesHeader'

const quesRef = firebase.database().ref('Manager/Question/Math/Exam1');
export default class MathComponent extends Component{
	constructor(props){
        super(props);
        this.state = ({
            loading: false,
            email: '',
			currentItemId: '',
			currentItemId1: '',
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
	getItemFromDataFromDB(){
        quesRef.orderByChild('id')
        .equalTo(this.state.currentItemId)
        .on('value',(childSnapshot) =>{
           var itemData = {};
           childSnapshot.forEach((doc) => {
               itemData = {
                key: doc.key,
                id: doc.toJSON().id,
				sen: doc.toJSON().sen,
				question: doc.toJSON().question,
				a: doc.toJSON().A,
				b: doc.toJSON().B,
                c: doc.toJSON().C,
                d: doc.toJSON().D,
               };
               this.setState({
                   itemData : itemData,
               });
           });
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
		const currentItemId1 = await getItemFromAsyncStorage('currentItemId1');
    	await AsyncStorage.getItem('userData').then((value) => {
        const userData = JSON.parse(value);
        this.setState({
            currentItemId: currentItemId,
			userData: userData,
			currentItemId1: currentItemId1
        });
        const shortEmail = this.state.userData.email.split('@').shift();
        this.setState({
      typedEmail: this.state.userData.email,
            shortEmail: shortEmail
        });
		});
		this.getItemFromDataFromDB();
		console.log('userdata', this.state.userData)

	  } 
    render(){
		const { currentUser } = this.state
        return(
            <View style = {styles.contain}>
				{/* <ImageBackground source = {require('PhanAnh/Image/blue-technology-4669.jpg')} style={{width: '100%', height: '100%'}}>
				<OfflineNotice/>*/}
				<View
					style = {{
						flexDirection: 'row',
						justifyContent: 'flex-start',
						justifyContent: 'space-between',
						width:'100%',
						backgroundColor: '#1E90FF' 
					}}
					>
				<Button
                        containerStyle={{
                            width: 30,
							margin: '2%',
							marginTop: '5%',
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
                            tintColor: 'white'
						}}
						source={require('SystemManager/icons/back.png')}
					/>
					</Button>
					<Button
						containerStyle={{
							margin: '2%',
							padding: '3%',
							width: 70,
						}}
						 style={{
							fontSize: 16,
							color: 'grey'
						}}
						onPress= { this.startclock.bind(this)} >
						<View style = {{
							flexDirection:'row'
						}}>
						<Image
						source = {require('SystemManager/icons/icons8-alarm-clock-64.png')}
						style = {{width:30, height: 30, alignItems:'center', tintColor:'white'}}
						/>
					<Text
						style={{
						fontSize: 16,
						fontWeight: 'bold',
						textAlign: 'center',
                        color: 'white',
                        marginTop: '1%'
					}}>
					{' '}{this.state.count}
				</Text>
					</View>
					</Button>
					<Text>
						{' '}
					</Text>
				</View>
				 <ListquesHeaderComponent {...this.props} />  
                <ScrollView>
                <View style = {{alignItems:'center', justifyContent:'center'}}>
                <Text
					style={{
						fontSize: 22,
						fontWeight: 'bold',
						textAlign: 'center',
                        color: 'black',
                        marginTop: '1%'
					}}>
					Toán học
				</Text>
				<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						alignSelf:'flex-start',
                        color: 'black',
						marginTop: '1%',
						marginLeft:'2%'
					}}>
					Câu hỏi số {this.state.itemData.sen}
				</Text>
				<Button
					containerStyle={{
						width: '98%',
						height: 60,
						backgroundColor: '#1E90FF',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: 50
					}}
					style={{
						fontSize: 13,
						fontWeight: 'bold',
						color: 'white',
						alignSelf:'flex-start',
						marginLeft: '1%'
					}}
					onPress={() => {
                         /* this.update(); */
                         Alert.alert('Câu hỏi', this.state.itemData.question)
					}}
					>
					{this.state.itemData.question}
				</Button>
						<Text
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						alignSelf:'flex-start',
                        color: 'black',
						marginTop: '1%',
						marginLeft:'2%'
					}}>
					Trả lời:
				</Text>
				<Button
					containerStyle={styles.stylerepButton}
					style={styles.repButton}
					onPress={() => {
                         /* this.update(); */
                         Alert.alert('Đáp án', 'Đúng')
					}}
					>
					{this.state.itemData.a}
				</Button>
				<Button
					containerStyle={styles.stylerepButton}
					style={styles.repButton}
					onPress={() => {
                         /* this.update(); */
                         Alert.alert('Đáp án', 'Sai')
					}}
					>
					{this.state.itemData.b}
				</Button>
				<Button
					containerStyle={styles.stylerepButton}
					style={styles.repButton}
					onPress={() => {
                         /* this.update(); */
                         Alert.alert('Đáp án', 'Sai')
					}}
					>
					{this.state.itemData.c}
				</Button>
				<Button
					containerStyle={styles.stylerepButton}
					style={styles.repButton}
					onPress={() => {
                         /* this.update(); */
                         Alert.alert('Đáp án', 'Sai')
					}}
					>
					{this.state.itemData.d}
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
    repButton: {
		fontSize: 13,
		fontWeight: 'bold',
		color: 'grey',
		alignSelf:'flex-start',
		marginLeft: '1%'
		
  },
  stylerepButton: {
	width: '98%',
	height: 60,
	backgroundColor: 'white',
	justifyContent: 'center',
	alignItems: 'center',
	borderRadius: 5,
	margin:'1%',
	borderColor: '#1E90FF',
	borderBottomWidth: 5,
},
})