import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Alert,
    TextInput,
    ImageBackground,
    Image,
    StatusBar,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import { Login } from 'thitracnghiem/Navigation/screenName';
/*import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice' */
import LinearGradient from 'react-native-linear-gradient';
import md5 from 'md5';
import OfflineNotice from 'thitracnghiem/Navigation/OfflineNotice.js';
const LearnAppRefUsers = firebase.database().ref('Manager/User');
export default class TakepassCom extends Component {
    constructor(props) {
        super(props);
        this.unsubcriber = null;
        this.state = {
            rePassword: '',
            Password: '',
            showhidenPass: true,
            loading: false,
            key: ''
        };
    }
    showhidenPassword = () => {
        if (this.state.showhidenPass === true) {
            this.setState({ showhidenPass: false });
        }
        else {
            this.setState({ showhidenPass: true });
        }
    };
    async componentDidMount() {
        var key = await this.props.navigation.getParam('key', null);
        this.setState({
            key: key
        });
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

    checkValue = () => {
        return (
            this.state.Password === '' ||
            this.state.rePassword === '' 
        );
    };
    update = () => {
        if (this.state.Password === '' ||
        this.state.rePassword === '')
        {
            Alert.alert('Thông báo','Mật khẩu và mật khẩu nhập lại không được để trống');
			return;
        }
        if (this.state.Password.length<6)
		{
			Alert.alert('Thông báo','Mật khẩu phải từ 6 kí tự trở lên');
			return;
		}
        if (this.state.Password!=this.state.rePassword)
        {
            Alert.alert('Thông báo','Mật khẩu và mật khẩu nhập lại trùng khớp');
			return;
        }
        this.setState({
            loading: true
        });
        firebase
            .database()
            .ref('Customer/' + this.state.key)
            .update({
                Password: md5(this.state.Password)
            })
            .then(() => {
                this.setState({
                    loading: false
                });
                Alert.alert('Thông báo', 'Đổi mật khẩu thành công');
                this.props.navigation.navigate(Login);
            })
            .catch(() => {
                this.setState({
                    loading: false
                });
                Alert.alert('Thông báo', 'Đổi mật khẩu thất bại');
            });
    };
    render() {
        return (
            <View style={styles.contain}>
            <StatusBar backgroundColor='#1E90FF' barStyle='light-content' />
            <ImageBackground
                source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                style={{ width: '100%', height: '100%' }}
                pointerEvents={this.state.loading?'none':'auto'}
            >
                <OfflineNotice />
                <ScrollView  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View
                style = {{
                    position:'absolute',
                    left:0,
                    top:0
                }}
                >
                    <Button
                    containerStyle = {{
                        padding:10,
                    }}
                    style = {{
                        color:'white',
                    }}
                    onPress = {() => {
                        this.props.navigation.navigate(Login);
                    }}>
                    <Image 
                    style = {{width:30, height:30, tintColor: 'white'}}
                    source = {require('thitracnghiem/icons/back.png')}/>
                </Button>
                </View>
    
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('thitracnghiem/img/imageedit_18_6287752576.png')}
                            style={{
                                width: 200,
                                height: 200,
                                marginTop: '5%'
                            }}
                        />
                        <View style={[ styles.propertyValueRowView ]}>
                            <TextInput
                                style={[ styles.multilineBox,{paddingRight:50} ]}
                                keyboardType='default'
                                placeholderTextColor='white'
                                underlineColorAndroid='transparent'
                                autoCapitalize='none'
                                secureTextEntry={this.state.showhidenPass} 
                                placeholder='Mật khẩu *'
                                editable={true}
                                maxLength={100}
                                onChangeText={(text) => {
                                    this.setState({ Password: text });
                                }}
                                ref={'Password'}
                                onSubmitEditing={()=>this.refs.rePassword.focus()}
                            />
                            <Button
                                containerStyle={{
                                    position: 'absolute',
                                    right:'10%',
                                    height:'100%',
                                    justifyContent:'center'
                                }}
                                onPress={this.showhidenPassword.bind(this.state.showhidenPass)}
                            >
                                {this.state.showhidenPass === true ? (
                                    <Image
                                        style={{ width: 30, height: 30, tintColor: 'white' }}
                                        source={require('thitracnghiem/icons/2d4e09879b6f017f74ffaee0b0011c0a-eye-icon-by-vexels.png')}
                                    />
                                ) : (
                                    <Image
                                        style={{ width: 30, height: 30, tintColor: 'white' }}
                                        source={require('thitracnghiem/icons/mob32px045-512.png')}
                                    />
                                )}
                            </Button>
                        </View>
                        <View style={[ styles.propertyValueRowView ]}>
                            <TextInput
                                style={[ styles.multilineBox,{paddingRight:50} ]}
                                keyboardType='default'
                                placeholderTextColor='white'
                                underlineColorAndroid='transparent'
                                autoCapitalize='none'
                                secureTextEntry={this.state.showhidenPass} 
                                placeholder='Mật khẩu Nhập Lại *'
                                editable={true}
                                maxLength={100}
                                onChangeText={(text) => {
                                    this.setState({ rePassword: text });
                                }}
                                ref={'rePassword'}
                                onSubmitEditing={()=>this.checkValue() || this.state.loading?null:this.update()}
                            />
                        </View>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={
                                this.checkValue() || this.state.loading?  (
                                    [ 'grey', 'grey' ]
                                ) : (
                                    [ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]
                                )
                            }
                            style={{
                                margin: 10,
                                padding: '3%',
                                borderRadius: 20,
                                width: 250
                            }}
                        >
                            <Button
                                disabled={this.checkValue() || this.state.loading? true : false}
                                style={{
                                    fontSize: 16,
                                    color: 'white'
                                }}
                                onPress={this.update}
                            >
                                THAY ĐỔI
                            </Button>
                        </LinearGradient>
                    </View>
                </ScrollView>
            </ImageBackground>
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
        </View>
        );
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#00008B'
    },
    multilineBox: {
        width: '90%',
        borderColor: 'rgba(255,255,255,0.7)',
        borderBottomWidth: 1,
        justifyContent:'center',
        borderRadius: 5,
        color: 'white',
        paddingVertical:15
    },
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom:0,
        width: '90%'
    },
  dropdownView: {
    width: '100%',
    height: 25,
    fontSize: 13,
    marginBottom: '1%',
    marginTop: '2%',
},
})