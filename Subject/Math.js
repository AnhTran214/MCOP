import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	Alert,
	ImageBackground,
	StatusBar,
	Image,
	TextInput,
	FlatList
} from 'react-native';
import Button from 'react-native-button';
import { Login, Home, info, math,result } from 'SystemManager/Navigation/screenName';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import {
	setItemToAsyncStorage,
	getItemFromAsyncStorage,
	setItemToAsyncStorage1
} from 'SystemManager/Function/function';
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice';*/
import Header from 'SystemManager/subComponent/Header';
import FooterSub from 'SystemManager/subComponent/footerSub';
import ListquesComponent from 'SystemManager/subComponent/Listques';
import Result from 'SystemManager/Subject/Result';
import CountDown from 'react-native-countdown-component';

const quesRef = firebase.database().ref('Manager/Question/Math/Exam1');

export default class MathComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			email: '',
			itemData: {},
			typedEmail: '',
			shortEmail: '',
			userData: {},
			pickerDisplayed: false,
			count: 5,
			change:[true,true,true,true],
			quesNumArray: [],
			clickedSen: '01',
			ls: []
		};
		this.onPressAdd = this.onPressAdd.bind(this);
	}

	changeAw = (cauHoiThu,id) => {
		console.log(cauHoiThu);
		console.log(id);
			var arr= [true,true,true,true];	
			var res= this.state.ls;
			if (id<4)
			{
				arr[id]=false;		
				var stt=parseInt(cauHoiThu);
				res[stt]=id;		
			}		
			console.log(res);
			this.setState({
				ls:res
			});
	
			this.setState({
				change:arr
			});
	};
	onPressAdd = () => {
		Alert.alert(
			'Thông báo',
			'Bạn có muốn nộp bài?',
			[
				{ text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'Có',
					onPress: () => {
						this.props.navigation.navigate(result);
					}
				}
			],
			{ cancelable: true }
		);
	};

	onPressBack = () => {
		Alert.alert(
			'Thông báo',
			'Bạn có muốn hủy bài?',
			[
				{ text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'Có',
					onPress: () => {
						this.props.navigation.navigate(Home);
					}
				}
			],
			{ cancelable: true }
		);
	};

	startclock = async () => {
		var t = 5;
		var temp = await setInterval(() => {
			if (t != 0) {
				t--;
				this.setState({ count: t });
			}
			else {
				Alert.alert('Thông báo', 'Cuộc thi kết thúc');
				clearInterval(temp);
			}
		}, 1000);
	};

	getQuesNum() {
        quesRef.on('value', (childSnapshot) => {
            const quesNumArray = [];
            childSnapshot.forEach((doc) => {
                quesNumArray.push({
                    sen: doc.toJSON().sen,
                });
            });
            this.setState({
                quesNumArray: quesNumArray,
                loading: false
            });
        });
    }

	 getCauHoiDetail (cauHoiThu) {
		quesRef.orderByChild('sen').equalTo(cauHoiThu).on('value', (childSnapshot) => {
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
					d: doc.toJSON().D
				};
				this.setState({
					itemData: itemData
				});
			});
		});
		var stt=parseInt(cauHoiThu);
		
		if (this.state.ls[stt]>=0 && this.state.ls[stt]<=3) 
		{
			this.changeAw(cauHoiThu,this.state.ls[stt])
		}
		else
		{
			this.changeAw(cauHoiThu,4);
		}
	}

	async componentDidMount() {
		const { currentUser } = firebase.auth();
		this.setState({ currentUser });
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
		this.getQuesNum();
		this.getCauHoiDetail('01');
		console.log('currentItemId of Math', currentItemId);
	}

	render() {
		const { currentUser } = this.state;
		return (
			<View style={styles.contain}>
				{/* <ImageBackground source = {require('PhanAnh/Image/blue-technology-4669.jpg')} style={{width: '100%', height: '100%'}}>
				<OfflineNotice/>*/}
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'flex-start',
						justifyContent: 'space-between',
						width: '100%',
						backgroundColor: '#1E90FF'
					}}
				>
					<Button
						containerStyle={{
							width: 30,
							margin: '2%',
							alignSelf: 'flex-start'
						}}
						onPress={this.onPressBack}
					>
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
					<View
						style={{
							flexDirection: 'row'
						}}
					>
						<Image
							source={require('SystemManager/icons/icons8-alarm-clock-64.png')}
							style={{ width: 30, height: 30, alignItems: 'center', tintColor: 'white', marginTop: '2%' }}
						/>
						<CountDown
							until={60 * 0 + 30}
							size={15}
							onFinish={() =>
								Alert.alert(
									'Thông báo',
									'Hết giờ làm bài',
									[
										{
											text: 'Chấm điểm',
											onPress: () => {
												this.props.navigation.navigate(result);
											}
										}
									],
									{ cancelable: true }
								)}
							digitStyle={{ backgroundColor: '#1E90FF', margin: '2%', marginTop: '5%' }}
							digitTxtStyle={{ color: 'white' }}
							timeToShow={[ 'M', 'S' ]}
							timeLabels={{ m: null, s: null }}
							showSeparator
						/>
					</View>
					<Text> </Text>
				</View>
				{/* ListCauHoi */}
				<View
					style={{
						borderBottomWidth: 2,
						borderColor: '#1E90FF'
					}}
				>

					<FlatList
                    horizontal={true}
					data={this.state.quesNumArray}
					
                    renderItem={({ item, index }) => {
                        return (
                            <View>
                                    <Button
                                        containerStyle={{
                                            width: 50,
                                            height: 50,
                                            backgroundColor: '#1E90FF',
                                            borderRadius: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            margin: 5
                                        }}
                                        onPress={async () => {
											await this.setState({clickedSen: item.sen});
											this.getCauHoiDetail(this.state.clickedSen);
                                        }}
                                        style={{
                                            fontSize: 13,
                                            color: 'white'
                                        }}
                                    >
                                        {item.sen}
                                    </Button>

                            </View>
						);
					}}
					keyExtractor={(item) => item.sen}
                />


				</View>

				<ScrollView>
					<View style={{ alignItems: 'center', justifyContent: 'center' }}>
						{/* <Text
							style={{
								fontSize: 22,
								fontWeight: 'bold',
								textAlign: 'center',
								color: 'black'
							}}
						>
							Toán học
						</Text> */}
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								alignSelf: 'flex-start',
								color: 'black',
								marginLeft: '2%'
							}}
						>
							Câu hỏi số {this.state.itemData.sen}
						</Text>
						<Button
							containerStyle={{
								width: '98%',
								height: 30,
								justifyContent: 'center',
								alignItems: 'center',
							}}
							style={{
								fontSize: 13,
								fontStyle:'italic',
								color: 'black',
								alignSelf: 'flex-start',
								marginLeft: '1%'
							}}
							onPress={() => {
								Alert.alert('Câu hỏi', this.state.itemData.question);
							}}
						>
							{this.state.itemData.question}
						</Button>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								alignSelf: 'flex-start',
								color: 'black',
								marginTop: '1%',
								marginLeft: '2%'
							}}
						>
							Trả lời:
						</Text>
						<View style = {{
							width:'95%',
							borderColor:'grey',
							borderWidth:2
						}}>
						
						<View style = {{flexDirection:'row', marginTop:'2%'}}>
						<Button
							containerStyle={[
								styles.stylerepButton,
								{ backgroundColor: this.state.change[0] === true ? 'white' : 'grey', borderColor:'white' }
							]}
							style={[ styles.repButton, { color: this.state.change[0] === true ? 'black' : 'white' } ]}
							onPress={()=>this.changeAw(this.state.clickedSen,0)}
						>
							A
						</Button>
						<Text style = {{
							alignSelf:'center',
							marginLeft:'2%'
						}}>
						{this.state.itemData.a}
						</Text>
						</View>

						<View style = {{borderBottomWidth:1, borderColor:'gey', marginBottom:'2%', marginTop:'2%'}}/>
						<View style = {{flexDirection:'row'}}>
						<Button
							containerStyle={[
								styles.stylerepButton,
								{ backgroundColor: this.state.change[1] === true ? 'white' : 'grey' }
							]}
							style={[ styles.repButton, { color: this.state.change[1] === true ? 'black' : 'white' } ]}
							onPress={()=>this.changeAw(this.state.clickedSen,1)}
						>
							B
						</Button>
						<Text style = {{
							alignSelf:'center',
							marginLeft:'2%'
						}}>
						{this.state.itemData.b}
						</Text>
						</View>
						<View style = {{borderBottomWidth:1, borderColor:'gey', marginBottom:'2%', marginTop:'2%'}}/>
						<View style = {{flexDirection:'row'}}>
						<Button
							containerStyle={[
								styles.stylerepButton,
								{ backgroundColor: this.state.change[2] === true ? 'white' : 'grey' }
							]}
							style={[ styles.repButton, { color: this.state.change[2] === true ? 'black' : 'white' } ]}
							onPress={()=>this.changeAw(this.state.clickedSen,2)}
						>
							C
						</Button>
						<Text style = {{
							alignSelf:'center',
							marginLeft:'2%'
						}}>
						{this.state.itemData.c}
						</Text>
						</View>
						<View style = {{borderBottomWidth:1, borderColor:'gey', marginBottom:'2%', marginTop:'2%'}}/>
						<View style = {{flexDirection:'row', marginBottom:'2%'}}>
						<Button
							containerStyle={[
								styles.stylerepButton,
								{ backgroundColor: this.state.change[3] === true ? 'white' : 'grey', borderColor:'white' }
							]}
							style={[ styles.repButton, { color: this.state.change[3] === true ? 'black' : 'white' } ]}
							onPress={()=>this.changeAw(this.state.clickedSen,3)}
						>
							D
						</Button>
						<Text style = {{
							alignSelf:'center',
							marginLeft:'2%'
						}}>
						{this.state.itemData.d}
						</Text>
						</View>
					</View>
					</View>
				</ScrollView>

				<View
					style={{
						height: 70,
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'white'
					}}
				>
					<Button
						containerStyle={{
							width: 120,
							height: 60,
							backgroundColor: '#1E90FF',
							borderRadius: 20,
							 alignSelf:'center',
							borderColor: '#1E90FF',
							borderWidth: 3,
							justifyContent:'center',
							alignItems:'center'
						}}
						style={{
							fontSize: 16,
							color: 'white',
						}}
						onPress={this.onPressAdd}
					>
						Nộp bài
					</Button>
				</View>

				<Result ref={'Result'} gotoHome={() => this.props.navigation.navigate(Home)} />
				{/* </ImageBackground> */}
			</View>
		);
	}
}
const styles = StyleSheet.create({
	contain: {
		flex: 1,
		backgroundColor: 'white'
	},
	repButton: {
		fontSize: 13,
		fontWeight: 'bold',
		alignSelf: 'center',
		marginLeft: '1%'
	},
	stylerepButton: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius:50
	}
});
