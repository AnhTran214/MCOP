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
	FlatList,
	ActivityIndicator,
	BackHandler
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
			email: '',
			itemData: {},
			typedEmail: '',
			shortEmail: '',
			userData: {},
			pickerDisplayed: false,
			count: 5,
			change: [true, true, true, true],
			quesNumArray: [],
			ls: [],
			id: '',
			idtopic: {},
			questitem: {},
			questArray: [],
			con: 1,
			currentid: 0,
			Time_Left: 0,
			timeleft: 0,
			Max_Point: 0,
			TTQuest: [],
			ojbQuest: {},
			objCon: {},
			Id_Top: '',
			Id_Con: '',
			right: 0,
			result: [],
			stop: false
		};
		this.onPressAdd = this.onPressAdd.bind(this);
	}
	getCon = async () => {
			var Id_Top= await this.props.navigation.getParam('Id_Top', null);
			if (Id_Top==null)
			{
				Alert.alert('Không Tìm Thấy Chủ Đề');
				this.props.navigation.navigate(Home);
				return;
			}
			this.setState(
				{
					Id_Top: Id_Top
				}
			)
			con.orderByChild("Id_Top").equalTo(Id_Top).once("value", async (value) => {
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
					var x = Math.floor((Math.random() * leng) + 1);
					this.setState(
						{
							Id_Con: listCon[x - 1].Id_Con,
							Max_Point: listCon[x - 1].Max_Point,
							Time_Left: listCon[x - 1].Time_Left,
							timeleft: listCon[x - 1].Time_Left
						}
					);

					this.getInclude();
				}
			})
		
	}
	changeAw = (index, id) => {
		var res = this.state.ls;
		var result = this.state.result;
			res[index] = id;
			if (this.state.ojbQuest[this.state.TTQuest[this.state.currentid]].Answer == id + 1) {
				result[index] = true;

			}
			else {
				result[index] = false;

			}
		this.setState({
			ls: res,
			result: result
		});
		var len=this.state.TTQuest.length;
		if (index<len-1)
		{
		for (let i=index+1;i<len;i++)
		{
				if (!(this.state.ls[i]>=0 &&this.state.ls[i]<=3) )
				{
					this.getquestwithid(i);
					break;
				}

		}
	}
	else
	{
		for (let i=0;i<len;i++)
		{
			if (!(this.state.ls[i]>=0 &&this.state.ls[i]<=3))
			{
				this.getquestwithid(i);
				break;
			}
		}
	}
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
						this.setState(
							{
								stop: false
							}
						)
						var succ = [];
						var fail = [];
						succ = this.state.result.filter(x => x == true);
						fail = this.state.result.filter(x => x == false);
						var point = Math.round(parseFloat(this.state.Max_Point * succ.length / this.state.TTQuest.length) * 100) / 100;
						var time= this.state.Time_Left-this.state.timeleft+1;
						this.props.navigation.dispatch(
							StackActions.reset({
								index: 0,
								actions: [
									NavigationActions.navigate({
										routeName: 'result',
										params: {
											res_quest: succ.length + "|" + fail.length + "|" + this.state.TTQuest.length + "|" + point +"|"+time,
											Id_Con  : this.state.Id_Con
										}
									})
								]
							})
						)
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
	getInclude = async () => {
		var arr = [];
		await inc.orderByChild('Id_Con').equalTo(this.state.Id_Con).on('value', async (childSnapshot) => {
			childSnapshot.forEach(async (doc) => {
				arr.push(doc.toJSON().Id_Ques);
			
			});
			this.setState(
				{ 
					TTQuest: arr
				}
			)
			await quest.orderByChild("Id_Top").equalTo(this.state.Id_Top).on('value', async (childSnapshot) => {
				var list = {};
				list = await childSnapshot.val();
				this.setState({
					ojbQuest: list,
					stop:true,
					loading:false,
				})
			});

		});


	}
	getquestwithid = async (index) => {
		if (this.state.TTQuest.length > 0) {
			var questitem = this.state.ojbQuest[this.state.TTQuest[index]];
			await this.setState({
				currentid: index,
				questitem: questitem
			});
		
		}
	
	}
	async componentDidMount() {

		await setItemToAsyncStorage('currentScreen', math);
		this.setState(
			{
				loading:true
			}
		)
		await this.getCon();
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
	componentWillUnmount() {
        this.backButton.remove();
    }
	render() {

		return (
			<View style={styles.contain}>
				<ImageBackground source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')} style={{ width: '100%', height: '100%' }}>
					<OfflineNotice/>
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
									)
									var succ = [];
									var fail = [];
									succ = this.state.result.filter(x => x == true);
									fail = this.state.result.filter(x => x == false);
									var point = Math.round(parseFloat(this.state.Max_Point * succ.length / this.state.TTQuest.length) * 100) / 100;
									var time= this.state.Time_Left-this.state.timeleft;
									this.props.navigation.dispatch(
										StackActions.reset({
											index: 0,
											actions: [
												NavigationActions.navigate({
													routeName: 'result',
													params: {
														res_quest: succ.length + "|" + fail.length + "|" + this.state.TTQuest.length + "|" + point+"|"+time,
														Id_Con  : this.state.Id_Con
													}
												})
											]
										})
									)}
								}

				
								digitStyle={{ backgroundColor: '#1E90FF', margin: '2%', marginTop: '5%' }}
								digitTxtStyle={{ color: 'white' }}
								timeToShow={['M', 'S']}
								timeLabels={{ m: null, s: null }}
								showSeparator
							/>: null}
						</View>
			<Text></Text>
					</View>
					{/* ListCauHoi */}
					<View
						style={{
							borderBottomWidth: 2,
							borderColor: '#1E90FF'
						}}
					>
						<FlatList
						        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
							horizontal={true}
							data={this.state.TTQuest}
							keyExtractor={item => item.id}
							renderItem={({ item, index }) => {
								return (
									<View>
										{this.state.ls[index] >= 0 && this.state.ls[index] <= 3 ?  //khi chọn sẽ màu khác
											<Button
												containerStyle={{
													width: 50,
													height: 50,
													backgroundColor: 'gray',
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
												{index + 1}
											</Button>
										}
									</View>
								);
							}}

						/>


					</View>

					<ScrollView>
						<View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.5)' }}>
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
									{this.state.ojbQuest && this.state.ojbQuest[this.state.TTQuest[this.state.currentid]] ? this.state.ojbQuest[this.state.TTQuest[this.state.currentid]].Content_Ques + "?" : null}
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
							<View style={{
								width: '95%',
								borderColor: 'grey',
								borderWidth: 2
							}}>

								<View style={{ flexDirection: 'row', marginTop: '2%', width: "80%" }}>
									<Button
										containerStyle={[
											styles.stylerepButton,
											{ backgroundColor: this.state.ls[this.state.currentid] === 0 ? '#1E90FF': null  , borderColor: 'white' }
										]}
										style={[styles.repButton, { color: this.state.ls[this.state.currentid] === 0 ? 'white':'black'   }]}
										onPress={() => this.changeAw(this.state.currentid, 0)}
									>
										A
						</Button>
									<Text style={{
										alignSelf: 'center',
										marginLeft: '2%'
									}}>
										{this.state.ojbQuest && this.state.ojbQuest[this.state.TTQuest[this.state.currentid]] ? this.state.ojbQuest[this.state.TTQuest[this.state.currentid]].Answer1 : null}
									</Text>
								</View>

								<View style={{ borderBottomWidth: 1, borderColor: 'gey', marginBottom: '2%', marginTop: '2%' }} />
								<View style={{ flexDirection: 'row', width: "80%" }}>
									<Button
										containerStyle={[
											styles.stylerepButton,
											{ backgroundColor: this.state.ls[this.state.currentid] === 1 ? '#1E90FF': null }
										]}
										style={[styles.repButton, { color: this.state.ls[this.state.currentid] === 1 ? 'white':'black' }]}
										onPress={() => this.changeAw(this.state.currentid, 1)}
									>
										B
						</Button>
									<Text style={{
										alignSelf: 'center',
										marginLeft: '2%'
									}}>
										{this.state.ojbQuest && this.state.ojbQuest[this.state.TTQuest[this.state.currentid]] ? this.state.ojbQuest[this.state.TTQuest[this.state.currentid]].Answer2 : null}
									</Text>
								</View>
								<View style={{ borderBottomWidth: 1, borderColor: 'gey', marginBottom: '2%', marginTop: '2%' }} />
								<View style={{ flexDirection: 'row', width: "80%" }}>
									<Button
										containerStyle={[
											styles.stylerepButton,
											{ backgroundColor: this.state.ls[this.state.currentid] === 2 ? '#1E90FF': null }
										]}
										style={[styles.repButton, { color: this.state.ls[this.state.currentid] === 2 ? 'white':'black' }]}
										onPress={() => this.changeAw(this.state.currentid, 2)}
									>
										C
						</Button>
									<Text style={{
										alignSelf: 'center',
										marginLeft: '2%'
									}}>
										{this.state.ojbQuest && this.state.ojbQuest[this.state.TTQuest[this.state.currentid]] ? this.state.ojbQuest[this.state.TTQuest[this.state.currentid]].Answer3 : null}
									</Text>
								</View>
								<View style={{ borderBottomWidth: 1, borderColor: 'gey', marginBottom: '2%', marginTop: '2%' }} />
								<View style={{ flexDirection: 'row', marginBottom: '2%', width: "80%" }}>
									<Button
										containerStyle={[
											styles.stylerepButton,
											{ backgroundColor: this.state.ls[this.state.currentid] === 3 ? '#1E90FF': null, borderColor: 'white' }
										]}
										style={[styles.repButton, { color: this.state.ls[this.state.currentid] === 3 ? 'white':'black' }]}
										onPress={() => this.changeAw(this.state.currentid, 3)}
									>
										D
						</Button>
									<Text style={{
										alignSelf: 'center',
										marginLeft: '2%'
									}}>
										{this.state.ojbQuest && this.state.ojbQuest[this.state.TTQuest[this.state.currentid]] ? this.state.ojbQuest[this.state.TTQuest[this.state.currentid]].Answer4 : null}
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
								alignSelf: 'center',
								borderColor: '#1E90FF',
								borderWidth: 3,
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
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50
	}
});
