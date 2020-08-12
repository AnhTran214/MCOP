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
import {  Login, takepass } from 'thitracnghiem/Navigation/screenName';
import LinearGradient from 'react-native-linear-gradient';
import RNSmtpMailer from 'react-native-smtp-mailer';
import OfflineNotice from 'thitracnghiem/Navigation/OfflineNotice.js';
export default class FopassCom extends Component {
    constructor(props) {
        super(props);
        this.unsubcriber = null;
        this.state = {
            Email: '',
            Username: '',
            loading: false,
            Code: '',
            securenumber: '',
            err_email: '',
            key: ''
        };
    }
    makeEmall = async () => {
        var email=this.state.Email.trim();
        var username=this.state.Username.trim().toLowerCase();
        if (email.length == 0 || username.length == 0) {
            Alert.alert('Thông báo', 'Vui lòng nhập Email và Tài Khoản trước');
            return;
        }
        if (this.state.err_email.length>0) 
        {
            Alert.alert('Thông báo', 'Định dạng Email không hợp lệ');
            return;
        }
        this.setState({ loading: true });
        await firebase
            .database()
            .ref('Customer')
            .orderByChild('Username')
            .equalTo(username).limitToFirst(1)
            .once('value', (value) => {
                if (value.exists()) {
                    value.forEach((element) => {
                        if (element.toJSON().Email == email) {
                            var rd = '';
                            this.setState({
                                key: element.key
                            });
                            for (var i = 0; i < 6; i++) {
                                rd += Math.floor(Math.random() * 10).toString();
                            }
                            fetch('https://www.smtpeter.com/v1/send?access_token=', {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "recipient":    email,
                                    "from":         "mcopf4@gmail.com",
                                    "to":          email,
                                    "subject":      'Mã xác nhận tài khoản ' + email + ' từ MCOP',
                                    "text":          '<p>Mã xác nhận của tài khoản ' +
                                    username +
                                    ' : ' +
                                    rd +
                                    '.<p></br><p>Nếu xảy ra lỗi xin vui lòng liên hệ mcopf4@gmail.com để được giúp đỡ.</p>'
                                })
                                });
                            RNSmtpMailer.sendMail({
                                mailhost: 'smtp.gmail.com',
                                port: '465',
                                ssl: true,
                                username: 'mcopf4@gmail.com',
                                password: 'mcop@2019',
                                from: 'mcopf4@gmail.com',
                                recipients: email,
                                subject: 'Mã xác nhận tài khoản ' + email + ' từ MCOP',
                                htmlBody:
                                    '<p>Mã xác nhận của tài khoản ' +
                                    username +
                                    ' : ' +
                                    rd +
                                    '.<p></br><p>Nếu xảy ra lỗi xin vui lòng liên hệ mcopf4@gmail.com để được giúp đỡ.</p>',
                                attachmentPaths: [],
                                attachmentNames: [],
                                attachmentTypes: []
                            })
                                .then(() => {
                                    this.setState({ securenumber: rd, loading: false });
                                    Alert.alert('Thông báo', 'Gửi thành công');
                                })
                                .catch((err) => {
                                    console.log(err)
                                    this.setState({ securenumber: '', loading: false });
                                    Alert.alert('Thông báo', 'Không gửi được mã xác nhận');
                                });
                        }
                        else {
                            this.setState({ loading: false });
                            Alert.alert('Thông báo', 'Người dùng không tồn tại trong email nhập');
                        }
                        return;
                    });
                }
                else {
                    this.setState({ loading: false });
                    Alert.alert('Thông báo', 'Người dùng không tồn tại');
                    return;
                }
            });
    };
    checkEmail = (text) => {
        if (text.trim().length == 0) {
            this.setState({ err_email: '' });
        }
        else {
            var reg = new RegExp('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}');
            if (reg.test(text) === false) {
                this.setState({ err_email: 'Định dạng Email không đúng' });
            }
            else {
                this.setState({ err_email: '' });
            }
        }
        this.setState({ Email: text });
    };
    submit= () =>
    {
        if (this.state.Code == this.state.securenumber) {
            this.props.navigation.navigate(takepass, { key: this.state.key });
        }
        else {
            Alert.alert('Mã xác nhận không đúng');
        }
    }
    checkValue = () => {
        return this.state.Email.trim() === '' || this.state.Username.trim() === '' || this.state.err_email.length > 0;
    };
    componentDidMount() {
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
                                height: 200
                            }}
                        />
                     <View style={[ styles.propertyValueRowView ]}>
                            <TextInput
                                style={styles.multilineBox}
                                underlineColorAndroid='transparent'
                                placeholderTextColor='white'
                                keyboardType='default'
                                autoCapitalize='none'
                                placeholder='Tài Khoản *'
                                editable={true}
                                maxLength={100}
                                onChangeText={(text) => {
                                    this.setState({ Username: text });
                                }}
                                ref={'Username'}
                                onSubmitEditing={()=>this.refs.Email.focus()}
                            />
                        </View>
                     
                        <View style={[ styles.propertyValueRowView ]}>
                            <TextInput
                                style={styles.multilineBox}
                                underlineColorAndroid='transparent'
                                placeholderTextColor='white'
                                keyboardType='default'
                                autoCapitalize='none'
                                placeholder='Email *'
                                editable={true}
                                maxLength={100}
                                onChangeText={(text) => {
                                    this.checkEmail(text)
                                }}
                                ref={'Email'}
                                onSubmitEditing={()=>this.makeEmall()}
                            />
                              <Button
                                    containerStyle={{
                                        position: 'absolute',
                                        right:'10%',
                                        height:'100%',
                                        justifyContent:'center'
                                    }}
                                    onPress={this.makeEmall}
                                >
                                    <Text
                                    style={{
                                    color: 'white',  
                                     borderWidth:0.5,
                                     padding:10,
                                    borderColor:'white'}}
                                    >
                                        Gửi Mã
                                    </Text>
                                </Button>
                        </View>
                      <View style={[ styles.propertyValueRowView ]}>
                            <TextInput
                                style={styles.multilineBox}
                                underlineColorAndroid='transparent'
                                placeholderTextColor='white'
                                keyboardType='number-pad'
                                autoCapitalize='none'
                                placeholder='Mã *'
                                editable={true}
                                maxLength={6}
                                onChangeText={(text) => {
                                    this.setState({ Code: text });
                                }}
                                ref={'Code'}
                                onSubmitEditing={()=>this.checkValue() || this.state.loading || this.state.Code==''?null:this.submit()}
                            />
                        </View>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={
                                this.checkValue() || this.state.loading || this.state.Code==''?  (
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
                                disabled={this.checkValue() || this.state.loading || this.state.Code==''? true : false}
                                style={{
                                    fontSize: 16,
                                    color: 'white'
                                }}
                                onPress={() => this.submit()}
                            >
                                GỬI YÊU CẦU
                            </Button>
                        </LinearGradient>
                            <Text 
                            style={{color:"white",fontWeight:"bold",textAlign:'center'}}
                            >
                                {this.state.err_email.length>0?this.state.err_email:''}
                            </Text>
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
});
