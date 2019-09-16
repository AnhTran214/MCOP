import React, {Component} from 'react';
import { Text, View, TouchableHighlight, Image, Alert, StatusBar} from 'react-native';
import Button from 'react-native-button';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from "react-native-firebase";
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice.js'; */
import {Login, Home} from 'SystemManager/Navigation/screenName';
import {setItemToAsyncStorage,getItemFromAsyncStorage} from 'SystemManager/Function/function';

export default class Header extends Component{
    constructor(props){
        super(props);
        this.state = ({
            loading: false,
            currentItemId: '',
            typedEmail: '',
            shortEmail: '',
            userData: {},
            currentUser: null
        });
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
  }
    render(){
        const { currentUser } = this.state
        return (
            <View>
                <StatusBar 
                backgroundColor = "#1E90FF"
                barStyle = "light-content"
                />
            <View style = {{
                height: 50,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#1E90FF',
            }}>
                 <TouchableHighlight style = {{
                    marginLeft: 10,
                    //marginTop: 20,
                }}
                underlayColor = '#F1F1F1'
                onPress = {() => {
                    this.props.navigation.openDrawer();
                }}>
                    <Image 
                    source = {require('SystemManager/icons/menu-alt-512.png')}
                    style = {{ width: 32, height: 32, tintColor:'white'}}
               />
                </TouchableHighlight>
                {/* <Button
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
						}}
						source={require('SystemManager/icons/icons8-long-arrow-left-80.png')}
					/>
					</Button> */}
                <Text style = {{color: 'white'}}>
                 {this.state.userData.name}
                </Text>
                <TouchableHighlight style = {{
                    marginRight: 10,
                    //marginTop: 20,
                }}
                onPress = { async () => {
                    Alert.alert('Thông báo', 'Đăng xuất thành công');
                    await AsyncStorage.clear();
                    this.props.navigation.navigate(Login);
                }}>
                    <Image 
                    source = {require('SystemManager/icons/icons8-export-40.png')}
                    style = {{ width: 32, height: 32}}
               />
                </TouchableHighlight>
            </View>
            {/* <OfflineNotice /> */}
            </View>
        );
    }
}