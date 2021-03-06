import React, { Component } from 'react';
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	Alert,
	ImageBackground,
	Image,
	FlatList,
	ActivityIndicator,
	TouchableHighlight
} from 'react-native';
import Button from 'react-native-button';
import {  Home,  math } from 'thitracnghiem/Navigation/screenName';
import firebase from 'react-native-firebase';
import {
	setItemToAsyncStorage,
} from 'thitracnghiem/Function/function';
import CountDown from 'react-native-countdown-component';
import { NavigationActions, StackActions } from 'react-navigation';
import OfflineNotice from 'thitracnghiem/Navigation/OfflineNotice.js'
const quest = firebase.database().ref('Question');
const con = firebase.database().ref('Contest');
const inc = firebase.database().ref('Include');
export default class MathComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			quesNumArray: [],
			ls: [],
			id: '',
			idtopic: {},
			questitem: {},
			questArray: [],
			currentid: 0,
			Time_Left:0,
			timeleft: 0,
			Max_Point: 0,
			TTQuest: [],
			ojbQuest: {},
			objCon: {},
			Id_Top: '',
			Id_Con: '',
			stop: false,
			scrollViewWidth:0,
			currentXOffset:0
		};
	}
	getCon = async () => {
			var Id_Top= await this.props.navigation.getParam('Id_Top', '');
			var Name_Top= await this.props.navigation.getParam('Name_Top', '');
			if (Id_Top==null)
			{
				Alert.alert('Không Tìm Thấy Chủ Đề');
				this.props.navigation.navigate(Home);
				return;
			}
			this.setState({
					Id_Top: Id_Top,
					Name_Top:Name_Top
			});
		await con.orderByChild("Id_Top").equalTo(Id_Top).once("value", async (value) => {
				if (value.exists()) {
					var listCon = [];
					await value.forEach((data) => {
						if (data.toJSON().Status == 1)
							listCon.push(
								{
									Id_Con: data.key,
									Max_Point: data.toJSON().Max_Point,
									Time_Left: data.toJSON().Time_Left
								}
							)
					})
					var leng = listCon.length;
					var x = Math.floor(Math.random() * leng);
					this.setState(
						{
							Id_Con: listCon[x].Id_Con,
							Max_Point: listCon[x].Max_Point,
							Time_Left:listCon[x].Time_Left,
							timeleft: listCon[x].Time_Left
						}
					);
					if (leng>0)
					{
						this.getInclude();
					}
				}
				else
				{
					this.setState({
						loading:false
					})
				}
			});
			await quest.orderByChild("Id_Top").equalTo(this.state.Id_Top).once('value', async (childSnapshot) => {
				var list = {};
				list = await childSnapshot.val();
				this.setState({
					ojbQuest: list
				})
			});
	}
	changeAw = (index, id) => {
			var res = [...this.state.ls];
			res[index]=id;
			this.setState({
				ls:res
			});
			var len=this.state.TTQuest.length;
			if (index<len)
			{
				for (let i=index+1;i<len;i++)
				{
					if (!(this.state.ls[i]>=0 &&this.state.ls[i]<=3) )
					{
						this.getquestwithid(i);
						this.refs.scrollView.scrollToOffset({offset: 60*i, animated: true});
						return;
					}

				}
				for (let i=0;i<len;i++)
					{
						if (!(this.state.ls[i]>=0 &&this.state.ls[i]<=3))
						{
							this.getquestwithid(i);
							this.refs.scrollView.scrollToOffset({offset: 60*i, animated: true});
							return;
						}
					}
				}
	}
	getPoint= ()=>
	{
		var point =0;
		var time= 0;		
		var time= this.state.Time_Left-this.state.timeleft+1;
		var right=0;
		var fail=0;
		for (let i=0;i<this.state.TTQuest.length;i++)
		{
			console.log(this.state.ls[i]+" "+this.state.ojbQuest[this.state.TTQuest[i].Id].Answer);
			if (this.state.ls[i].toString()==this.state.ojbQuest[this.state.TTQuest[i].Id].Answer)
			{
				right++;
			}
			else
			if (this.state.ls[i]!=-1)
			{
				fail++;
			}
		}
		point=Math.round(parseFloat(this.state.Max_Point * right / this.state.TTQuest.length) * 100) / 100;
		this.props.navigation.dispatch(
			StackActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({
						routeName: 'result',
						params: {
							res_quest: right+ "|" + fail+ "|" + this.state.TTQuest.length + "|" + point +"|"+time,
							Id_Con  : this.state.Id_Con
						}
					})
				]
			})
		);
	}
	onPressAdd = () => {
		Alert.alert(
			'Thông báo',
			'Bạn có muốn nộp bài?',
			[
				{ text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'Có',
					onPress: () => {
						this.setState(
							{
								stop: false
							}
						)
						this.getPoint();
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
	getInclude = async () => {
		var arr = [];
		await inc.orderByChild('Id_Con').equalTo(this.state.Id_Con).once('value', async (childSnapshot) => {
			if (childSnapshot.exists())
			{
			childSnapshot.forEach(async (doc) => {
				arr.push({
				Id:	doc.toJSON().Id_Ques,
				Order:doc.toJSON().Order
				});			
			});
			arr.reduce((a,b)=>a.Order>b.Order?1:a.Order<b.Order?-1:0);
			var ls=[];
			for(var i = 0; i < arr.length; i++) {
				ls.push(-1);
			}
			this.setState(
				{ 
					TTQuest: arr,
					stop:true,
					loading:false,
					currentid: 0,
					ls:ls
				});
			}
			else
			{
				this.setState(
				{ 
					loading:false,
				});			
			}
		});
	}
	getquestwithid = async (index) => {
		if (this.state.TTQuest.length > 0) {
			await this.setState({
				currentid: index,
			});
		
		}
	
	}
	getValue = (key)=>
	{
		var content='';
		try
		{
			content=this.state.ojbQuest[this.state.TTQuest[this.state.currentid].Id][key];
		}
		catch{
			content='';
		};
		return content;
	}
	_handleScroll = (event) => {
		var newXOffset = event.nativeEvent.contentOffset.x
		this.setState({currentXOffset:newXOffset})
	  }
	leftArrow = () => {
	var	eachItemOffset = 60; 
	var	_currentXOffset =  this.state.currentXOffset - eachItemOffset;
		this.refs.scrollView.scrollToOffset({offset: _currentXOffset, animated: true});
	  }
	
	  rightArrow = () => {
		var eachItemOffset = 60;
		var	_currentXOffset =  this.state.currentXOffset + eachItemOffset;
		this.refs.scrollView.scrollToOffset({offset: _currentXOffset, animated: true})
	  }
	async componentDidMount() {

		await setItemToAsyncStorage('currentScreen', math);
		this.setState({
				loading:true
			});
		await this.getCon();
	}
	render() {

		return (
			<View style={styles.contain}>
				<ImageBackground source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')} style={{ width: '100%', height: '100%' }}>
					<OfflineNotice/>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: '100%',
							backgroundColor: '#1E90FF',
							height: 50
						}}
					>
						
						<Button
							containerStyle={{
								width: 30,
								alignSelf: 'center'
							}}
							onPress={this.onPressBack}
						>
							<Image
								style={{
									width: 30,
									height: 30,
									tintColor: 'white'
								}}
								source={require('thitracnghiem/icons/back.png')}
							/>
						</Button>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								height: 50
							}}
						>
							<Image
								source={require('thitracnghiem/icons/icons8-alarm-clock-64.png')}
								style={{ width: 30, height: 30, alignItems: 'center', tintColor: 'white', marginTop: '2%' }}
							/>
							{this.state.Time_Left?
							<CountDown
								until={this.state.Time_Left}
								running={this.state.stop}
								size={15}
								onChange={(value)=>this.setState({timeleft:value})}
								onFinish={() => {
									Alert.alert(
										'Thông báo',
										'Hết giờ làm bài'
									);
									this.getPoint();
								}
								}
								digitStyle={{ backgroundColor: '#1E90FF' }}
								digitTxtStyle={{ color: 'white' }}
								separatorStyle={{ color: 'white' }}
								timeToShow={['M', 'S']}
								timeLabels={{ m: null, s: null }}
								showSeparator
							/>: null}
						</View>
					<Text></Text>
					</View>
					<View
						style={{
							 flexDirection:'row', 
							justifyContent:'center'
						}}
					>
						<TouchableHighlight
						style={{ justifyContent:'center',marginHorizontal:10,}}
						onPress={this.leftArrow}>
							<Image
								source={require('thitracnghiem/icons/icons8-left-24.png')}
								style={{ width: 20, height: 20, tintColor: 'white'}}
							/>
					</TouchableHighlight>
						<FlatList
						    contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
							horizontal={true}
							ref={'scrollView'}
							onContentSizeChange={(w, h) => this.setState({scrollViewWidth:w})}
							scrollEventThrottle={16}
							onScroll={this._handleScroll}
							data={this.state.TTQuest}
							keyExtractor={item => item.Id}
							renderItem={({ item, index }) => {
								return (
									<View>
											<Button
												containerStyle={{
													width: 50,
													height: 50,
													backgroundColor: this.state.ls[index] >= 0 && this.state.ls[index] <= 3?'gray':'#1E90FF',
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
												{index + 1}
											</Button>
									</View>
								);
							}}

						/>
				<TouchableHighlight
						style={{ justifyContent:'center',marginHorizontal:10,}}
						onPress={this.rightArrow}>
							<Image
								source={require('thitracnghiem/icons/icons8-right-24.png')}
								style={{ width: 20, height: 20, tintColor: 'white'}}
							/>
					</TouchableHighlight>

					</View>

					<ScrollView style={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
						<View style={{ alignItems: 'center', justifyContent: 'center',  }}>
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
							<Text
								style={{
									fontSize: 22,
									fontWeight: 'bold',
									textAlign: 'center',
									color: 'black'
								}}
							>
								{this.state.Name_Top}
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
								Câu hỏi số {this.state.currentid + 1}
							</Text>
							<View
								style={{
									width: '98%',
									height: 70,
									margin: '2%'
								}}
							>
								<Text style={{
									fontSize: 13,
									fontStyle: 'italic',
									color: 'black',
									alignSelf: 'flex-start',
									marginLeft: '1%'
								}}>
									{this.getValue('Content_Ques')}?
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

								<View style={{ flexDirection: 'row',width: '95%',	borderColor: 'grey',
								borderWidth: 2,marginVertical:10 }}>
									<Button
										containerStyle={[
											styles.stylerepButton,
											{margin:5,backgroundColor: this.state.ls[this.state.currentid] === 0 ? '#1E90FF': null  , borderColor: 'white' }
										]}
										style={[styles.repButton, {color: this.state.ls[this.state.currentid] === 0 ? 'white':'black'   }]}
										onPress={() => this.changeAw(this.state.currentid, 0)}
									>
										A 
								</Button>
								<Button 
								containerStyle={{
									flex:1,
									justifyContent:'center',
								}}
								onPress={() => this.changeAw(this.state.currentid, 0)}>
									<Text>
											{this.getValue('Answer1')}
									</Text>
								</Button>
									
								</View>

								<View style={{ flexDirection: 'row',  width: '95%',	borderColor: 'grey',
								borderWidth: 2,marginBottom:10 }}>
									<Button
										containerStyle={[
											styles.stylerepButton,
											{ margin:5,backgroundColor: this.state.ls[this.state.currentid] === 1 ? '#1E90FF': null  , borderColor: 'white' }
										]}
										style={[styles.repButton, { color:this.state.ls[this.state.currentid] === 1 ? 'white':'black'   }]}
										onPress={() => this.changeAw(this.state.currentid, 1)}
									>
										B
								</Button>
								<Button 
								containerStyle={{
									flex:1,
									justifyContent:'center',
								}}
								onPress={() => this.changeAw(this.state.currentid, 1)}>
									<Text>
											{this.getValue('Answer2')}
									</Text>
								</Button>
									
								</View>

								<View style={{ flexDirection: 'row', width: '95%',	borderColor: 'grey',
								borderWidth: 2,marginBottom:10 }}>
									<Button
										containerStyle={[
											styles.stylerepButton,
											{margin:5, backgroundColor: this.state.ls[this.state.currentid] === 2 ? '#1E90FF': null  , borderColor: 'white' }
										]}
										style={[styles.repButton, { color: this.state.ls[this.state.currentid] === 2 ? 'white':'black'   }]}
										onPress={() => this.changeAw(this.state.currentid, 2)}
									>
										C 
								</Button>
								<Button 
								containerStyle={{
									flex:1,
									justifyContent:'center',
								}}
								onPress={() => this.changeAw(this.state.currentid, 2)}>
									<Text>
											{this.getValue('Answer3')}
									</Text>
								</Button>
									
								</View>

								<View style={{ flexDirection: 'row',width: '95%',	borderColor: 'grey',
								borderWidth: 2,marginBottom:10 }}>
									<Button
										containerStyle={[
											styles.stylerepButton,
											{ margin:5,backgroundColor: this.state.ls[this.state.currentid] === 3 ? '#1E90FF': null  , borderColor: 'white' }
										]}
										style={[styles.repButton, { color: this.state.ls[this.state.currentid]=== 3 ? 'white':'black'   }]}
										onPress={() => this.changeAw(this.state.currentid, 3)}
									>
										D
								</Button>
								<Button 
								containerStyle={{
									flex:1,
									justifyContent:'center',
								}}
								onPress={() => this.changeAw(this.state.currentid, 3)}>
									<Text>
											{this.getValue('Answer4')}
									</Text>
								</Button>
							</View>
						</View>
					</ScrollView>
					<View
						style={{
							height: 70,
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'rgba(255,255,255,0.5)',
						}}
					>
						<Button
							containerStyle={{
								width: 120,
								backgroundColor: '#1E90FF',
								borderRadius: 20,
								alignSelf: 'center',
								borderColor: '#1E90FF',
								borderWidth: 3,
								paddingVertical:10,
								justifyContent: 'center',
								alignItems: 'center'
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
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 40
	}
});
