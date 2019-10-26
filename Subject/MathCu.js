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
import { Login, Home, info, math } from 'SystemManager/Navigation/screenName';
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

export default class MathCuComponent extends Component {
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
			change: true
		};
		this.onPressAdd = this.onPressAdd.bind(this);
	}
	changeAw = () => {
		if (this.state.change === true) {
			this.setState({ change: false });
		}
		else {
			this.setState({ change: true });
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
						this.refs.Result.showAddModal();
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
	getItemFromDataFromDB(cauHoiThu) {
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
	}

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
		this.getItemFromDataFromDB('01');
		console.log('currentItemId of Math', currentItemId);
	}

	onClickCauHoi = async () => {
			let cauHoiMoi = await getItemFromAsyncStorage('currentSen');
			alert('getItemSen = ' + cauHoiMoi);
			await this.getItemFromDataFromDB(cauHoiMoi);

		
	};

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
												this.refs.Result.showAddModal();
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

				<View
					style={{
						borderBottomWidth: 2,
						borderColor: '#1E90FF'
					}}
				>
					<ListquesComponent pressCauHoi={this.onClickCauHoi} />
				</View>

				<ScrollView>
					<View style={{ alignItems: 'center', justifyContent: 'center' }}>
						<Text
							style={{
								fontSize: 22,
								fontWeight: 'bold',
								textAlign: 'center',
								color: 'black'
							}}
						>
							Toán học
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
						<Button
							containerStyle={[
								styles.stylerepButton,
								{ backgroundColor: this.state.change === true ? 'white' : 'grey' }
							]}
							style={[ styles.repButton, { color: this.state.change === true ? 'black' : 'white' } ]}
							onPress={this.changeAw.bind(this.state.change)}
						>
							{this.state.itemData.a}
						</Button>
						<Button
							containerStyle={styles.stylerepButton}
							style={styles.repButton}
							onPress={() => {
								Alert.alert('Đáp án', 'Sai');
							}}
						>
							{this.state.itemData.b}
						</Button>
						<Button
							containerStyle={styles.stylerepButton}
							style={styles.repButton}
							onPress={() => {
								Alert.alert('Đáp án', 'Sai');
							}}
						>
							{this.state.itemData.c}
						</Button>
						<Button
							containerStyle={styles.stylerepButton}
							style={styles.repButton}
							onPress={() => {
								Alert.alert('Đáp án', 'Sai');
							}}
						>
							{this.state.itemData.d}
						</Button>
					</View>
				</ScrollView>

				<View
					style={{
						height: 50,
						flexDirection: 'row',
						justifyContent: 'flex-start',
						alignItems: 'center',
						justifyContent: 'space-between',
						backgroundColor: 'white'
					}}
				>
					<Button
						containerStyle={{
							width: 100,
							margin: '2%',
							alignSelf: 'flex-start',
							backgroundColor: '#1E90FF',
							borderRadius: 50,
							borderColor: '#1E90FF',
							borderWidth: 3
						}}
						style={{
							fontSize: 16,
							color: 'white'
						}}
						onPress={async () => {
							Alert.alert('Thông báo', 'Câu trước');
						}}
					>
						Trước
					</Button>
					<Button
						containerStyle={{
							width: 120,
							height: 120,
							alignSelf: 'flex-start',
							backgroundColor: '#1E90FF',
							borderRadius: 50,
							borderColor: '#1E90FF',
							borderWidth: 3
						}}
						style={{
							fontSize: 16,
							color: 'white',
							marginTop: '5%'
						}}
						onPress={this.onPressAdd}
					>
						Nộp bài
					</Button>
					<Button
						containerStyle={{
							width: 100,
							margin: '2%',
							alignSelf: 'flex-start',
							backgroundColor: '#1E90FF',
							borderRadius: 50,
							borderColor: '#1E90FF',
							borderWidth: 3
						}}
						style={{
							fontSize: 16,
							color: 'white'
						}}
						onPress={async () => {
							Alert.alert('Thông báo', 'Câu sau');
						}}
					>
						Sau
					</Button>
				</View>

				<Result ref={'Result'} gotoHome={() => this.props.navigation.navigate(Home)} />
				{/*  <FooterSub {...this.props} /> */}
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
		alignSelf: 'flex-start',
		marginLeft: '1%'
	},
	stylerepButton: {
		width: '98%',
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		margin: '1%',
		borderColor: '#1E90FF',
		borderBottomWidth: 5
	}
});
