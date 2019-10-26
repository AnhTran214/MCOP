import React, {Component} from 'react';
import { Text, View, TouchableHighlight, Image, Alert, StatusBar} from 'react-native';
import Button from 'react-native-button';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from "react-native-firebase";
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice.js'; */
import {Login, Home} from 'SystemManager/Navigation/screenName';
import {setItemToAsyncStorage,getItemFromAsyncStorage} from 'SystemManager/Function/function';
import LinearGradient from 'react-native-linear-gradient';

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
    logout = () => {
        Alert.alert('Thông báo','Bạn muốn đăng xuất?',
        [
            {text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'Có', onPress: async () => {  
            Alert.alert('Thông báo', 'Đăng xuất thành công');
            await AsyncStorage.clear();
            this.props.navigation.navigate(Login); }},
        ],
        {cancelable: true}
        )
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
                <Text style = {{color: 'white', fontStyle:'italic', fontWeight:'bold'}}>
                 {this.state.userData.name}
                {/*  M.C.O.P */}
                </Text>
                <TouchableHighlight style = {{
                    marginRight: 10,
                    //marginTop: 20,
                }}
                onPress = { this.logout}>
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