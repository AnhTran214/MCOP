import React, { Component } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Platform,
    TouchableHighlight,
    RefreshControl,
    TextInput,
    ScrollView,
    Modal,
    ImageBackground
} from 'react-native';
import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import { setItemToAsyncStorage, getItemFromAsyncStorage, getStatusColor } from 'thitracnghiem/Function/function';
import AsyncStorage from '@react-native-community/async-storage';
import { Home, info, changePass } from 'thitracnghiem/Navigation/screenName';
import Header from 'thitracnghiem/subComponent/Header';
import Footer from 'thitracnghiem/subComponent/footer';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';
//tham chieu den root
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
            currentItemId: '',
            itemData: {},
            typedEmail: '',
            shortEmail: '',
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
            Status: 1,
        };
    }

    async componentDidMount() {
        await setItemToAsyncStorage('currentScreen', info);
        const currentItemId = await getItemFromAsyncStorage('currentItemId');
        //console.log(`get currentItemId = ${currentItemId}`);
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
            for (var key in userData) {
                this.setState({
                    key: key,
                    userData: userData[key],
                    itemData: userData,
                    Username: userData[key].Username,
                    Fullname: userData[key].Fullname,
                    Phone: userData[key].Phone,
                    Email: userData[key].Email,
                    Address: userData[key].Address,
                    Birthday: userData[key].Birthday,
                    Password: userData[key].Password,
                    Status: userData[key].Status,
                    Image: userData[key].Image
                });
            }
        });
    }
    async update() {
                LearnAppUser.child(this.state.key)
                    .update({
                        Fullname: this.state.Fullname,
                        Phone: this.state.Phone,
                        Email:this.state.Email,
                        Address: this.state.Address,
                        Birthday: this.state.Birthday,
                        Status: this.state.Status,
                        Image: this.state.Image
                    })
                    .then(async () => {
                        this.state.userData.Fullname=this.state.Fullname;
                        this.state.userData.Phone=this.state.Phone;
                        this.state.userData.Email=this.state.Email;
                        this.state.userData.Address=this.state.Address;
                        this.state.userData.Birthday=this.state.Birthday;
                        this.state.userData.Status=this.state.Status;
                        this.state.userData.Image=this.state.Image;
                        this.state.itemData[this.state.key]=this.state.userData;
                        setItemToAsyncStorage('userData', 
                        this.state.itemData);
                        Alert.alert('Thông báo', 'Cập nhật thành công!');
                        this.props.navigation.navigate(Home);
                    }).catch( (error)=> {
                        alert(error);
                    })
    }
    Reset  = ()=>
    {
        this.setState(
            {
                Username: this.state.userData.Username,
                Fullname: this.state.userData.Fullname,
                Phone:this.state.userData.Phone,
                Email: this.state.userData.Email,
                Address: this.state.userData.Address,
                Birthday: this.state.userData.Birthday,
                Password: this.state.userData.Password,
                Status: this.state.userData.Status,
                Image: this.state.userData.Image
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
    renderImage(image) {
        return <Image style={{ width: 125, height: 125, borderRadius: 125 }}   source = {{uri: image}} />;
    }
     pickSig() {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: false,
            includeBase64:true
        })
            .then((image) => {
                this.setState({
                    Image: `data:${image.mime};base64,${image.data}`
                });
            })
            .catch((e) => alert(e));
    }
    render() {
        return (
            <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0 }}>
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Header {...this.props} />
                    <ScrollView>
                        <View
                            style={{
                                backgroundColor: '#1E90FF',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 64,
                                marginLeft: '1%',
                                marginRight: '1%',
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                marginTop: '1%'
                            }}
                        >
                            <Text
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: 13
                                }}
                            >
                                Thông tin cá nhân
                            </Text>
                        </View>
                        <View
                            style={{
                                borderLeftWidth: 2,
                                borderRightWidth: 2,
                                borderBottomWidth: 2,
                                borderColor: '#1E90FF',
                                marginLeft: '1%',
                                marginRight: '1%',
                                marginBottom: '2%',
                                borderBottomLeftRadius: 5,
                                borderBottomRightRadius: 5,
                                backgroundColor: 'rgba(241,241,241,0.7)'
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
                                        fontWeight:'bold'
                                    }}
                                >
                                    {this.state.Username}
                                </Text>
                                <View
                                      style={{
                                        marginTop:10,
                                        marginBottom:10,
                                        width: 300,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                <View
                                                style={{
                                                    width: 125,
                                                    height: 125,
                                                    borderRadius: 125,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderColor: 'white',
                                                    borderWidth: 3,
                                                }}
                                            >
                                                {this.renderImage(this.state.Image)}
                                            </View>
                                <Button onPress={() => this.pickSig()}>
                                            <Text
                                                style={{
                                                    fontSize: 11,
                                                    fontStyle: 'italic',
                                                    color: 'rgb(26,141,255)'
                                                }}
                                            >
                                                    Thay đổi
                                            </Text>
                                        </Button>
                                        </View>
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start',
                                        color: 'grey'
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
                                        color: 'grey'
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
                                        value=  {this.state.Email}
                                        onChangeText={(text) => {
                                            this.setState({
                                                Email: text
                                            });
                                        }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start',
                                        color: 'grey'
                                    }}
                                >
                                    Ngày sinh:
                                </Text>
                                <View style={[styles.propertyValueRowView]} >
                                <DatePicker
                                        style={{ width: 200 }}
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
                                                top: 4,
                                                marginLeft: 0
                                            },
                                            dateInput: {
                                                
                                            }
                                        }}
                                        onDateChange={(date) => { this.setState({ Birthday: date }) }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start',
                                        color: 'grey'
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
                                        value=  {this.state.Phone}
                                        onChangeText={(text) => {
                                            this.setState({
                                                Phone: text
                                            });
                                        }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        marginLeft: '2%',
                                        alignSelf: 'flex-start',
                                        color: 'grey'
                                    }}
                                >
                                    Địa chỉ:
                                </Text>
                                <View style={[styles.propertyValueRowView]}>
                                    <TextInput
                                        style={[styles.multilineBox, { height: 100 }]}
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='black'
                                        placeholder={this.state.Address}
                                        autoCapitalize='none'
                                        value= {this.state.Address}
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
                        </View>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['rgb(86, 123, 248)', 'rgb(95,192,255)']}
                            style={{
                                width: '75%',
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
                                    textAlignVertical: 'center'
                                }}
                                onPress={this.Reset}
                            >
                              RESET
                            </Button>
                        </LinearGradient>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['rgb(86, 123, 248)', 'rgb(95,192,255)']}
                            style={{
                                width: '75%',
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
                                    textAlignVertical: 'center'
                                }}
                                onPress={this.AlertUpdate}
                            >
                                CẬP NHẬT THÔNG TIN
                            </Button>
                        </LinearGradient>
                        <Button
                            containerStyle={{
                                padding: '3%',
                                borderRadius: 5,
                                alignSelf: 'center'
                            }}
                            onPress={() => {
                                const { navigate } = this.props.navigation; //chu y
                                navigate(changePass);
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 11,
                                    color: '#1E90FF',
                                    fontStyle: 'italic'
                                }}
                            >
                                Đổi mật khẩu
                            </Text>
                        </Button>
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
        marginTop: '2%',
        borderColor: '#1E90FF',
        borderBottomWidth: 2,
        textAlignVertical: 'top',
        marginLeft: '2%',
        marginRight: '2%',
        marginBottom: '2%'
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
