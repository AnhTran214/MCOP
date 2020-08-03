import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Platform,
    TextInput,
    ScrollView,
    ImageBackground,
    ActivityIndicator,
    BackHandler
} from 'react-native';
import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import { setItemToAsyncStorage } from 'thitracnghiem/Function/function';
import AsyncStorage from '@react-native-community/async-storage';
import { Home, info, changePass } from 'thitracnghiem/Navigation/screenName';
import Header from 'thitracnghiem/subComponent/Header';
import Footer from 'thitracnghiem/subComponent/footer';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
const LearnAppUser = firebase.database().ref('Customer');
export default class infoAccComponent extends Component {
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Thông tin cá nhân';
        let drawerIcon = () => (
            <Image
                source={require('thitracnghiem/icons/user.png')}
                style={{ width: 26, height: 26, tintColor: '#1E90FF' }}
            />
        );

        return { drawerLabel, drawerIcon };
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userData: {},
            pickerDisplayed: false,
            key: "",
            Username: '',
            Fullname: '',
            Phone: '',
            Email: '',
            Address: '',
            Birthday: '',
            Password: '',
            Facebook:'',
            Google:'',
            Status: 1,
            err_email: "",
            err_phone:"",
        };
    }


    async update() {
        this.setState({loading:true});
        LearnAppUser.child(this.state.key)
            .update({
                Fullname: this.state.Fullname,
                Phone: this.state.Phone,
                Email: this.state.Email,
                Address: this.state.Address,
                Birthday: this.state.Birthday,
                Status: this.state.Status,
                Image: this.state.Image,
                Facebook: this.state.Facebook,
                Google: this.state.Google
            })
            .then(async (value) => {
                console.log(value);
                this.state.userData.Fullname = this.state.Fullname;
                this.state.userData.Phone = this.state.Phone;
                this.state.userData.Email = this.state.Email;
                this.state.userData.Address = this.state.Address;
                this.state.userData.Birthday = this.state.Birthday;
                this.state.userData.Status = this.state.Status;
                this.state.userData.Image = this.state.Image;
                this.state.userData.Password = this.state.Password;
                this.state.userData.Facebook = this.state.Facebook;
                this.state.userData.Google = this.state.Google;
                await setItemToAsyncStorage('userData',
                this.state.userData);
                    this.setState({loading:false});
                Alert.alert('Thông báo', 'Cập nhật thành công!');
            }).catch((error) => {
                this.setState({loading:false});
                Alert.alert("Thay đổi không thành công");
            })
    }
    Reset = () => {
        this.setState(
            {
                Username: this.state.userData.Username,
                Fullname: this.state.userData.Fullname,
                Phone: this.state.userData.Phone,
                Email: this.state.userData.Email,
                Address: this.state.userData.Address,
                Birthday: this.state.userData.Birthday,
                Password: this.state.userData.Password,
                Status: this.state.userData.Status,
                Image: this.state.userData.Image,
                Facebook: this.state.userData.Facebook,
                Google: this.state.userData.Google,
                err_email:'',
                err_phone:''
            }
        )
    }
    AlertUpdate = () => {
        Alert.alert(
            'Thông báo',
            'Bạn muốn cập nhật thông tin ?',
            [
                { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Có',
                    onPress: () => {
                        this.update();
                    }
                }
            ],
            { cancelable: true }
        );
    };
    connectfb = (token) => {
        this.setState({
            loading:true
        })
        if (token!=null)
        {
            fetch('https://graph.facebook.com/v2.8/me?fields=id&access_token=' + token)
            .then((response) => response.json())
            .then((json) => {
                firebase.database().ref('Customer').orderByChild('Facebook').equalTo(json.id).limitToFirst(1).once(
                    'value',
                    (value) => {
                        if (value.exists()) {
                            this.setState({
                                loading:false
                            });
                           var kt= value.toJSON().hasOwnProperty(this.state.key);
                            if (kt)
                            {
                                Alert.alert('Thông báo', 'Facebook đã được liên kết với tài khoản này');
                            return;
                            }
                            else
                            {
                            Alert.alert('Thông báo', 'Facebook đã được liên kết với tài khoản khác');
                            return;
                            }
                        }
                        else {
                            this.setState({
                                Facebook:json.id,
                                loading:false
                            });
                            Alert.alert('Thông báo', 'Facebook đã được thêm');
                            return;
                        }
                    });
            })
            .catch(() => {
                this.setState({
                    loading:false
                })
                Alert.alert('Thông báo', 'Không thể lấy dữ liệu Facebook');
                return;
            });
        }
	}
	connectgg = (id) => {
        firebase.database().ref('Customer').orderByChild('Google').equalTo(id).limitToFirst(1).once(
            'value',
            (value) => {
                if (value.exists()) {
                        this.setState({
                            loading:false
                        });
                       var kt= value.toJSON().hasOwnProperty(this.state.key);
                        if (kt)
                        {
                            Alert.alert('Thông báo', 'Google đã được liên kết với tài khoản này');
                        return;
                        }
                        else
                        {
                        Alert.alert('Thông báo', 'Google đã được liên kết với tài khoản khác');
                        return;
                        }
                }
                else {
                    this.setState({
                        Google:id,
                        loading:false
                    });
                    Alert.alert('Thông báo', 'Google đã được thêm');
                    return;
                }
            });
	}
    renderImage(image) {
        if (image==null || image=='')
        return <View
        style={{
            width: 125,
            height: 125,
            borderRadius: 125,
            flexDirection: 'row',
            justifyContent: 'center',
            borderColor: 'black',
            borderWidth: 1,
        }}>
            <Image
                style={{ width: 125, height: 125,borderRadius: 125,tintColor: 'black'}}
                source={require('thitracnghiem/icons/user.png')}
            />
    </View>
        else
        return <View
        style={{
            width: 125,
            height: 125,
            borderRadius: 125,
            flexDirection: 'row',
            justifyContent: 'center'
        }}
    >
        <Image style={{ width: 125, height: 125,borderRadius: 125}} source={{ uri: image }} />
    </View>;
    }
    pickSig() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: false,
            includeBase64: true
        })
            .then((image) => {
                this.setState({
                    Image: `data:${image.mime};base64,${image.data}`
                });
            })
            .catch((e) =>Alert.alert("Thông Báo","Không chọn được ảnh"));
    }
    checkEmail = (text) => {
        if (text.trim().length == 0) {
            this.setState({ err_email: "" })
        }
        else {
            var reg = new RegExp("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}");
            if (reg.test(text) === false) {
                this.setState({ err_email: "Định dạng Email không đúng" })
            }
            else {
                this.setState({ err_email: "" })
            }
        }
        this.setState({ Email: text })

    }
    checkPhone= (text)=>
    {
        if (text.trim().length == 0) {
            this.setState({ err_phone: "" })
        }
        else {
            var reg = new RegExp("(09|03)+([0-9]{8})");
            if (reg.test(text) === false) {
                this.setState({ err_phone: "ĐT phải là 10 số và số đầu là 09 hoặc 03" })
            }
            else {
                this.setState({ err_phone: "" })
            }
        }
        this.setState({ Phone: text })
    }
   async componentDidMount() {
        await setItemToAsyncStorage('currentScreen', info);
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
                this.setState({
                    key: userData.Id,
                    userData: userData,
                    Username: userData.Username,
                    Fullname: userData.Fullname,
                    Phone: userData.Phone,
                    Email: userData.Email,
                    Address: userData.Address,
                    Birthday: userData.Birthday,
                    Password: userData.Password,
                    Status: userData.Status,
                    Facebook: userData.Facebook,
                    Google: userData.Google,
                    Image: userData.Image
                });
        });
    }
    async componentWillUnmount() {
        AccessToken.getCurrentAccessToken().then(() => {
			LoginManager.logOut();
		}).catch(() => {
		});
		const isSignedIn = await GoogleSignin.isSignedIn();
		if (isSignedIn) {
			try {
				await GoogleSignin.revokeAccess();
				await GoogleSignin.signOut();
			} catch (error) {
				console.error(error);
			}
		}
    }
    render() {
        return (
            <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0 }}>
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Header {...this.props} title={'Thông tin tài khoản'}/>
                    <ScrollView style={{marginVertical:10}}>
                        <View
                            style={{
                                borderLeftWidth: 2,
                                borderRightWidth: 2,
                                borderBottomWidth: 2,
                                borderColor: '#1E90FF',
                                marginLeft: '1%',
                                marginRight: '1%',
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5,
                                backgroundColor: 'rgba(241,241,241,0.7)',
                            }}
                        >
                            <View
                                style={{
                                    alignSelf: 'flex-start',
                                    marginTop: '1%',
                                    marginLeft: '2%',
                                    flexDirection: 'column'
                                }}
                            >
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'center',
                                        color: 'red',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {this.state.Username}
                                </Text>
                                <View
                                    style={{
                                        marginTop: 10,
                                        marginBottom: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                        {this.renderImage(this.state.Image)}
                                    <Button onPress={() => this.pickSig()}>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontStyle: 'italic',
                                                color: 'black'
                                            }}
                                        >
                                            Chọn ảnh
                                            </Text>
                                    </Button>
                                </View>
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start',
                                        color: 'black'
                                    }}
                                >
                                    Họ và tên:
                                </Text>
                                <View style={[styles.propertyValueRowView]}>
                                    <TextInput
                                        style={styles.multilineBox}
                                        keyboardType='default'
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='black'
                                        placeholder={this.state.Fullname}
                                        autoCapitalize='none'
                                        value={this.state.Fullname}
                                        onChangeText={(text) => {
                                            this.setState({
                                                Fullname: text
                                            });
                                        }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start',
                                        color: 'black'
                                    }}
                                >
                                    Email:
                                </Text>
                                <View style={[styles.propertyValueRowView]}>
                                    <TextInput
                                        style={styles.multilineBox}
                                        keyboardType='default'
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='black'
                                        placeholder={this.state.Email}
                                        autoCapitalize='none'
                                        maxLength={100}
                                        value={this.state.Email}
                                        onChangeText={(text) => {
                                            this.checkEmail(text);
                                        }}
                                    />
                                </View>
                               {this.state.err_email.length>0?<Text style={{ color: 'red', flex: 0, textAlign: 'center' }}>{this.state.err_email}</Text>:null}
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start',
                                        color: 'black'
                                    }}
                                >
                                    Ngày sinh:
                                </Text>
                                <View style={[styles.propertyValueRowView]} >
                                    <DatePicker
                                        style={{ flex:1 }}
                                        date={this.state.Birthday}
                                        mode="date"
                                        placeholder="select date"
                                        format="YYYY-MM-DD"
                                        minDate="1960-05-01"
                                        maxDate="2099-06-01"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                right: 0,
                                                top: 0,
                                                marginLeft: 0
                                            },
                                            dateInput: {
                                                borderLeftWidth:0,
                                                borderRightWidth:0,
                                                borderTopWidth:0,
                                                width: '96%',
                                                height: 50,
                                                borderColor: '#1E90FF',
                                                borderBottomWidth: 2,
                                                textAlignVertical: 'top',
                                                marginLeft: '2%',
                                                marginRight: '2%',
                                                marginBottom:10
                                            }
                                        }}
                                        onDateChange={(date) => { this.setState({ Birthday: date }) }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start',
                                        color: 'black'
                                    }}
                                >
                                    Số điện thoại:
                                </Text>
                                <View style={[styles.propertyValueRowView]}>
                                    <TextInput
                                        style={styles.multilineBox}
                                        keyboardType='numeric'
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='black'
                                        placeholder={this.state.Phone}
                                        autoCapitalize='none'
                                        maxLength={10}
                                        value={this.state.Phone}
                                        onChangeText={(text) => {
                                           this.checkPhone(text);
                                        }}
                                    />
                                </View>
                                {this.state.err_phone.length>0?<Text style={{ color: 'red', flex: 0, textAlign: 'center' }}>{this.state.err_phone}</Text>:null}
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start',
                                        color: 'black'
                                    }}
                                >
                                    Địa chỉ:
                                </Text>
                                <View style={[styles.propertyValueRowView]}>
                                    <TextInput
                                        style={[styles.multilineBox]}
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='black'
                                        placeholder={this.state.Address}
                                        autoCapitalize='none'
                                        value={this.state.Address}
                                        multilineBox={true}
                                        maxLength={200}
                                        onChangeText={(text) => {
                                            this.setState({
                                                Address: text
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ alignSelf: 'center', flexDirection: 'row',marginVertical:20 }}>
								<Button
									onPress={() => {
										LoginManager.logInWithPermissions(["public_profile"]).then(
											(result) => {
												if (result.isCancelled) {
													console.log("Login cancelled");
												} else {
													AccessToken.getCurrentAccessToken().then(
														(data) => {
															this.connectfb(data.accessToken.toString());
														}
													).catch(() => {
                                                        Alert.alert('Thông báo', 'Không thành công!')
													})

												}
											},
											(error) => {
                                                Alert.alert(
                                                    'Thông báo', 'Kết nối Facebook không thành công.'
                                                )
											}
										)
									}
									}
								>
									<Image
										style={{ width: 30, height: 30, marginRight: '5%' }}
										source={require('thitracnghiem/icons/icons8-facebook-480.png')} />
								</Button>
								<Button
									onPress={async () => {
										try {
											await GoogleSignin.hasPlayServices();
											var userInfo = await GoogleSignin.signIn();
											this.connectgg(userInfo.user.id);
										}
										catch (error) {
                                            console.log(error)
                                            Alert.alert(
                                                'Thông báo', 'Kết nối Google không thành công.'
                                            )
										}
									}}
								>
									<Image
										style={{ width: 30, height: 30 }}
										source={require('thitracnghiem/icons/icons8-google-plus-480.png')} />
								</Button>
							</View> 
					
                              </View>
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
        
                    </ScrollView>
                    <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom:10
                            }}
                        >
                            <Button
                                
                                onPress={this.Reset}
                            >
                                <Image source={require('thitracnghiem/icons/icons8-available-updates-16.png')} style={{ width: 30, height: 30, tintColor:'white' }} />
                            </Button>
                        </View>
                    
                    <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={this.state.err_email.length>0 || this.state.err_phone.length>0 ?['grey', 'grey']: ['rgb(86, 123, 248)', 'rgb(95,192,255)']  }
                            style={{
                                width: '75%',
                                height: 60,
                                backgroundColor: '#1E90FF',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 20
                            }}
                        >
                            <Button
                                style={{
                                    fontSize: 16,
                                    color: 'white',
                                    textAlign: 'center',
                                    textAlignVertical: 'center'
                                }}
                                disabled={(this.state.err_email.length>0 || this.state.err_phone.length>0)}
                                onPress={this.AlertUpdate}
                            >
                                CẬP NHẬT THÔNG TIN
                            </Button>
                        </LinearGradient>
                        <Button
                            containerStyle={{
                                borderRadius: 5,
                                alignSelf: 'center',
                                marginVertical:10
                            }}
                            onPress={() => {
                                const { navigate } = this.props.navigation; //chu y
                                navigate(changePass);
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: 'white',
                                    fontStyle: 'italic'
                                }}
                            >
                                Đổi mật khẩu
                            </Text>
                        </Button>
                    <Footer {...this.props} />
                </ImageBackground>
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
        width: '96%',
        height: 50,
        borderColor: '#1E90FF',
        borderBottomWidth: 2,
        textAlignVertical: 'top',
        marginLeft: '2%',
        marginRight: '2%',
    },
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 0,
        marginBottom: 0,
        width: '96%'
    },
    dropdownView: {
        width: '100%',
        height: 25,
        fontSize: 13,
        marginBottom: '1%',
        marginTop: '2%'
    }
});
