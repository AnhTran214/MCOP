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
import { Login, Home, info, math,result } from 'thitracnghiem/Navigation/screenName';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import {
	setItemToAsyncStorage,
	getItemFromAsyncStorage,
	setItemToAsyncStorage1
} from 'thitracnghiem/Function/function';
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice';*/
import Header from 'thitracnghiem/subComponent/Header';
import FooterSub from 'thitracnghiem/subComponent/footerSub';
import ListquesComponent from 'thitracnghiem/subComponent/Listques';
import Result from 'thitracnghiem/Subject/Result';
import CountDown from 'react-native-countdown-component';
import { thisExpression } from '@babel/types';

const quesRef = firebase.database().ref('Manager/Question/Math/Exam1');
const topic = firebase.database().ref('Topic');
const quest= firebase.database().ref('Question');
const con= firebase.database().ref('Contest');
const inc= firebase.database().ref('Include');
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
			ls: [],
			id:'',
			idtopic: {},
			questitem:{},
			questArray : [],
			con:1,
			currentid:0,
			Time_Left: 0,
			timeleft:0,
			Max_Point: 0,
			TTQuest : [],
			ojbQuest: {},
			Id_Top: '',
			Id_Con: '',
			right:0
		};
		this.onPressAdd = this.onPressAdd.bind(this);
	}
	getCon= async() =>
	{
		await AsyncStorage.getItem('idTop').then((value) => {
            const Id_Top = value;
            this.setState({
				Id_Top: Id_Top
			})
			con.orderByChild("Id_Top").equalTo(Id_Top).once("value",async(value)=>
			{
				if (value.exists())
				{
					var listCon=[];
				await value.forEach((data)=>
					{
						if (data.toJSON().Status==1)
						listCon.push(
							{
								Id_Con:data.key,
								Max_Point: data.toJSON().Max_Point,
								Time_Left : data.toJSON().Time_Left,
								timeleft :  data.toJSON().Time_Left
							}
						)
					})
					var leng=listCon.length;
					var x = Math.floor((Math.random() * leng) + 1);
					this.setState(
						{
							Id_Con : listCon[x-1].Id_Con,
							Max_Point : listCon[x-1].Max_Point,
							Time_Left : listCon[x-1].Time_Left,
						}
					);

					this.getInclude();
				}
			})
        });
	}
	changeAw = (index,id) => {
			var arr= [true,true,true,true];	
			var res= this.state.ls;
			var count=this.state.right;
			if (id<4)
			{
				arr[id]=false;		
				res[index]=id;		
				console.log("test");
				console.log(this.state.questitem.a);
				console.log(id);
				console.log(this.state.ls[index]);
				if ((id+1)==this.state.questitem.a)
				count++;
				else
				if (this.state.questitem.a==this.state.ls[index]+1)
				count--;
			}		
			this.setState({
				ls:res,
				change:arr,
				right:count
			});
			console.log(this.state.right);
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
	 getInclude = async() =>{
		var arr=[];
	await inc.orderByChild('Id_Con').equalTo(this.state.Id_Con).on('value',async(childSnapshot)=>{
			childSnapshot.forEach(async(doc)=>{
					arr.push(doc.toJSON().Id_Ques);			
					this.setState(
						{TTQuest: arr}
					)
			});
			await	quest.on('value', async(childSnapshot)=>{
				var questitem={};
					questitem=await childSnapshot.val();
					this.setState({
						ojbQuest: questitem
					})
					console.log(this.state.ojbQuest);
			});
		
		});
	
	
	}
	 getquestwithid= async(index)=>{
	await quest.orderByChild('id').equalTo(this.state.TTQuest[index]).on('value', async(childSnapshot)=>{
			var questitem={};
			childSnapshot.forEach((doc)=>{
				if (doc.toJSON().status==1)
				questitem = {
					
					Id: doc.key,
				Id_Top: doc.toJSON().Id_Top,
					status: doc.toJSON().Status,
					Content_Ques: doc.toJSON().Content_Ques,
					Answer1: doc.toJSON().Answer1,
					Answer2: doc.toJSON().Answer2,
					Answer3: doc.toJSON().Answer3,
					Answer4: doc.toJSON().Answer4,
					Answer: doc.toJSON().Answer,
				};
			});
			await  this.setState({
				currentid: index,
				questitem: questitem
			});
		});
	
		if (this.state.ls[index]>=0 && this.state.ls[index]<=3) 
		{
			this.changeAw(index,this.state.ls[index])
		}
		else
		{
			this.changeAw(index,4);
		}
	}
	async componentDidMount() {

		await setItemToAsyncStorage('currentScreen', Home);
		await this.getCon();
			

	}
	render() {

		return (
			<View style={styles.contain}>
				 <ImageBackground source = {require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')} style={{width: '100%', height: '100%'}}>
				{/*<OfflineNotice/>*/}
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
							source={require('thitracnghiem/icons/back.png')}
						/>
					</Button>
					<View
						style={{
							flexDirection: 'row'
						}}
					>
						<Image
							source={require('thitracnghiem/icons/icons8-alarm-clock-64.png')}
							style={{ width: 30, height: 30, alignItems: 'center', tintColor: 'white', marginTop: '2%' }}
						/>
						<CountDown
							until={this.state.timeleft?this.state.timeleft:60}
							size={15}
							onFinish={() =>
								Alert.alert(
									'Thông báo',
									'Hết giờ làm bài'/* ,
									[	
										{text: 'Đồng ý', onPress : () => console.log('Cancel Pressed'), style:'cancel' },
										this.props.navigation.navigate(result)	
									],
									{cancelable: true} */
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
					data={this.state.TTQuest}
                    renderItem={({ item, index }) => {
                        return (
                            <View>
									{this.state.ls[index]>=0 && this.state.ls[index]<=3?  //khi chọn sẽ màu khác
                                    <Button
                                        containerStyle={{
                                            width: 30,
                                            height: 30,
                                            backgroundColor: 'dray',
                                            borderRadius: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            margin: 5
                                        }}
                                        onPress={async () => {
											this.getquestwithid(index);
                                        }}
                                        style={{
                                            fontSize: 13,
                                            color: 'white'
                                        }}
                                    >
                                        {index+1}
                                    </Button>
									:
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
										this.getquestwithid(index);
									}}
									style={{
										fontSize: 13,
										color: 'white'
									}}
								>
									{index+1}
								</Button> 
									}
                            </View>
						);
					}}
				
                /> 


				</View>

				<ScrollView>
					<View style={{ alignItems: 'center', justifyContent: 'center',backgroundColor:'rgba(255,255,255,0.5)' }}>
						 <Text
							style={{
								fontSize: 22,
								fontWeight: 'bold',
								textAlign: 'center',
								color: 'black'
							}}
						>
							{this.state.idtopic.name_top}
						</Text> 
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								alignSelf: 'flex-start',
								color: 'black',
								marginLeft: '2%'
							}}
						>
							Câu hỏi số {this.state.currentid+1}
						</Text>
						<View
							style={{
								width: '98%',
								height: 70,
								margin:'2%'
							}}
						>
							<Text style={{
								fontSize: 13,
								fontStyle:'italic',
								color: 'black',
								alignSelf: 'flex-start',
								marginLeft: '1%'
							}}>
							{this.state.questitem.content_ques}
							</Text>
						</View>
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
						
						<View style = {{flexDirection:'row', marginTop:'2%', width:"80%"}}>
						<Button
							containerStyle={[
								styles.stylerepButton,
								{ backgroundColor: this.state.change[0] === true ? null : '#1E90FF', borderColor:'white' }
							]}
							style={[ styles.repButton, { color: this.state.change[0] === true ? 'black' : 'white' } ]}
							onPress={()=>this.changeAw(this.state.currentid,0)}
						>
							A
						</Button>
						<Text style = {{
							alignSelf:'center',
							marginLeft:'2%'
						}}>
						{this.state.questitem.answer1}
						</Text>
						</View>

						<View style = {{borderBottomWidth:1, borderColor:'gey', marginBottom:'2%', marginTop:'2%'}}/>
						<View style = {{flexDirection:'row', width:"80%"}}>
						<Button
							containerStyle={[
								styles.stylerepButton,
								{ backgroundColor: this.state.change[1] === true ? null : '#1E90FF' }
							]}
							style={[ styles.repButton, { color: this.state.change[1] === true ? 'black' : 'white' } ]}
							onPress={()=>this.changeAw(this.state.currentid,1)}
						>
							B
						</Button>
						<Text style = {{
							alignSelf:'center',
							marginLeft:'2%'
						}}>
						{this.state.questitem.answer2}
						</Text>
						</View>
						<View style = {{borderBottomWidth:1, borderColor:'gey', marginBottom:'2%', marginTop:'2%'}}/>
						<View style = {{flexDirection:'row', width:"80%"}}>
						<Button
							containerStyle={[
								styles.stylerepButton,
								{ backgroundColor: this.state.change[2] === true ? null : '#1E90FF' }
							]}
							style={[ styles.repButton, { color: this.state.change[2] === true ? 'black' : 'white' } ]}
							onPress={()=>this.changeAw(this.state.currentid,2)}
						>
							C
						</Button>
						<Text style = {{
							alignSelf:'center',
							marginLeft:'2%'
						}}>
						{this.state.questitem.answer3}
						</Text>
						</View>
						<View style = {{borderBottomWidth:1, borderColor:'gey', marginBottom:'2%', marginTop:'2%'}}/>
						<View style = {{flexDirection:'row', marginBottom:'2%', width:"80%"}}>
						<Button
							containerStyle={[
								styles.stylerepButton,
								{ backgroundColor: this.state.change[3] === true ? null : '#1E90FF', borderColor:'white' }
							]}
							style={[ styles.repButton, { color: this.state.change[3] === true ? 'black' : 'white' } ]}
							onPress={()=>this.changeAw(this.state.currentid,3)}
						>
							D
						</Button>
						<Text style = {{
							alignSelf:'center',
							marginLeft:'2%'
						}}>
						{this.state.questitem.answer4}
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
						backgroundColor: 'rgba(255,255,255,0.5)'
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
				 </ImageBackground>
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
