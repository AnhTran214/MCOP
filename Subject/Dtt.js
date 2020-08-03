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
export default class DttComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
            TTQuest: [],
            Id_Top:'',
            Name_Top:'',
            currentid:0,
            Time_Left:0
		};
    }
    shuffle(array) {
        var tmp, current, top = array.length;
        if(top) while(--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
        }
        return array;
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
        var list=[];
			await quest.orderByChild("Status").equalTo(1).once('value',  (value) => {
                if (value.exists())
                {
                    value.forEach((data) => {
                            list.push(data.toJSON())
                    });
                    list=this.shuffle(list);
                    this.setState({
                        TTQuest:list,
                        loading:false,
                        currentid:0,
                        stop: true,
                        Time_Left:10*list[0].Level,
                        timeleft:10*list[0].Level
                    });
                }
                else
                {
                    this.setState({
                        loading:false
                    });
                }
            });
	}
	changeAw = ( id) => {
        if (this.state.TTQuest[this.state.currentid].Answer==id.toString())
        {
            if (this.state.currentid<this.state.TTQuest.length)
            {
                var next=this.state.TTQuest[this.state.currentid+1].Level*10;
                this.setState({
                    currentid:this.state.currentid+1,
                    Time_Left:next,
                    timeleft:next
                })
            }
            else
            {
                this.setState({
                    stop: false
                });
                Alert.alert(
                    'Thông báo',
                    'Bạn đã hoàn thành hết tất cả câu');
                this.getPoint();
            }
        }
        else
        {
            this.setState({
                    stop: false
                });
            Alert.alert(
                'Thông báo',
                'Bạn đã thất bại tại câu hỏi này');
            this.getPoint();
        }
	}
	getPoint= ()=>
	{
		var point =this.state.currentid;
		this.props.navigation.dispatch(
			StackActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({
						routeName: 'result',
						params: {
							res_quest: point,
							Id_Con  : '-MDSV6A4mCgLzdFeyUPf'
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
                            })
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
	getValue = (key)=>
	{
		var content='';
		try
		{
			content=this.state.TTQuest[this.state.currentid][key];
		}
		catch{
			content='';
		};
		return content;
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
                                        'Bạn đã thất bại ở câu này');
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
                                            {margin:5,
                                               borderColor: 'white' }
										]}
										style={[styles.repButton, {color:  'black' }]}
										onPress={() => this.changeAw(0)}
									>
										A 
								</Button>
								<Button 
								containerStyle={{
									flex:1,
									justifyContent:'center',
								}}
								onPress={() => this.changeAw(0)}>
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
											{margin:5, borderColor: 'white' }
										]}
										style={[styles.repButton, {color:  'black' }]}
										onPress={() => this.changeAw( 1)}
									>
										B 
								</Button>
								<Button 
								containerStyle={{
									flex:1,
									justifyContent:'center',
								}}
								onPress={() => this.changeAw( 1)}>
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
											{margin:5, borderColor: 'white' }
										]}
										style={[styles.repButton, {color:  'black' }]}
										onPress={() => this.changeAw( 2)}
									>
										C 
								</Button>
								<Button 
								containerStyle={{
									flex:1,
									justifyContent:'center',
								}}
								onPress={() => this.changeAw( 2)}>
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
											{margin:5, borderColor: 'white' }
										]}
										style={[styles.repButton, {color:  'black' }]}
										onPress={() => this.changeAw( 3)}
									>
										D 
								</Button>
								<Button 
								containerStyle={{
									flex:1,
									justifyContent:'center',
								}}
								onPress={() => this.changeAw( 3)}>
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
