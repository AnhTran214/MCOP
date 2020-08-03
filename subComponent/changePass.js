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
import { Home, info,changePass } from 'thitracnghiem/Navigation/screenName';
import Header from 'thitracnghiem/subComponent/Header';
import Footer from 'thitracnghiem/subComponent/footer';
import LinearGradient from 'react-native-linear-gradient';
import md5 from 'md5';
const LearnAppUser = firebase.database().ref('Customer');
export default class changePassComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            key:'',
            password:'',
            newpassword: '',
            renewpassword: '',
            showhidenPass: true,
            loading:false
        };
    }
    async componentDidMount() {
        await setItemToAsyncStorage('currentScreen', changePass);
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
                this.setState({
                    key: userData.Id,
                    userData: userData
                });
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
    showhidenPassword = () => {
        if (this.state.showhidenPass === true) {
            this.setState({ showhidenPass: false });
        }
        else {
            this.setState({ showhidenPass: true });
        }
    };
    async update() {
        if (this.state.password=='')
        {
            Alert.alert("Thông Báo","Mật Khẩu Hiện Tại Không Được Để Trống");
            return;
        }
        if (this.state.newpassword=='')
        {
            Alert.alert("Thông Báo","Mật Khẩu Mới Không Được Để Trống");
            return;
        }
        if (this.state.renewpassword=='')
        {
            Alert.alert("Thông Báo","Mật Khẩu Nhập Lại Không Được Để Trống");
            return;
        }
        if (this.state.newpassword.length<6)
        {
            Alert.alert("Thông Báo","Mật Khẩu Mới Phải Từ 6 Kí Tự Trở Lên");
            return;
        }
        if (this.state.newpassword!=this.state.renewpassword)
        {
            Alert.alert("Thông Báo","Mật Khẩu Nhập Lại Không Trùng Khớp");
            return;
        }
        var pass=md5(this.state.password);
        if (pass!=this.state.userData.Password)
        {
            Alert.alert("Thông Báo","Mật Khẩu Cũ Không Đúng");
            return;
        }
        this.setState({loading:true});
        LearnAppUser.child(this.state.key)
        .update({
            Password: pass
        })
        .then(async () => {
            this.state.userData.Password=pass;
           await setItemToAsyncStorage('userData', this.state.userData);
            this.setState({loading:false});
            Alert.alert('Thông báo', 'Cập nhật thành công!');
            this.props.navigation.navigate(Home);
        }).catch( (error)=> {
            this.setState({loading:false});
            Alert.alert("Thay đổi không thành công");
        })
    }
    AlertUpdate = () => {
        Alert.alert(
            'Thông báo',
            'Bạn muốn đổi mật khẩu ?',
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
    render() {
        return (
            <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0 }}>
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Header {...this.props} title={'Thay đổi mật khẩu'}/>
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
                                paddingVertical:10
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
                                        alignSelf: 'flex-start'
                                    }}
                                >
                                    Mật khẩu cũ:
                                </Text>
                                <View style={[ styles.propertyValueRowView ]}>
                                    <TextInput
                                        style={styles.multilineBox}
                                        keyboardType='default'
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='grey'
                                        placeholder=''
                                        autoCapitalize='none'
                                        secureTextEntry={this.state.showhidenPass} 
                                        maxLength={100}
                                        onChangeText={(text) => {
                                            this.setState({
                                                password: text
                                            });
                                        }}
                                    />
                                      <Button
                                    containerStyle={{
                                        position: 'absolute',
                                        right:'5%',
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
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start'
                                    }}
                                >
                                    Mật khẩu mới:
                                </Text>
                                <View style={[ styles.propertyValueRowView ]}>
                                    <TextInput
                                        style={styles.multilineBox}
                                        keyboardType='default'
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='grey'
                                        placeholder=''
                                        autoCapitalize='none'
                                        secureTextEntry={this.state.showhidenPass} 
                                        maxLength={100}
                                        onChangeText={(text) => {
                                            this.setState({
                                                newpassword: text
                                            });
                                        }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start'
                                    }}
                                >
                                    Nhập lại mật khẩu mới:
                                </Text>
                                <View style={[ styles.propertyValueRowView ]}>
                                    <TextInput
                                        style={[ styles.multilineBox ]}
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='grey'
                                        placeholder=''
                                        autoCapitalize='none'
                                        secureTextEntry={this.state.showhidenPass} 
                                        maxLength={100}
                                        onChangeText={(text) => {
                                            this.setState({
                                                renewpassword: text
                                            });
                                        }}
                                    />
                                </View>
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
                                                <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]}
                            style={{
                                width: '70%',
                                height: 60,
                                marginTop: '1%',
                                marginBottom: '1%',
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
                                    textAlignVertical: 'center',
                                }}
                                onPress={this.AlertUpdate}
                            >
                                ĐỔI MẬT KHẨU
                            </Button>
                        </LinearGradient>
                         </ScrollView>
             
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
