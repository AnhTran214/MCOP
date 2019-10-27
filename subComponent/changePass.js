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
import { setItemToAsyncStorage, getItemFromAsyncStorage, getStatusColor } from 'SystemManager/Function/function';
import AsyncStorage from '@react-native-community/async-storage';
import { Home, info } from 'SystemManager/Navigation/screenName';
import Header from 'SystemManager/subComponent/Header';
import Footer from 'SystemManager/subComponent/footer';
import LinearGradient from 'react-native-linear-gradient';

//tham chieu den root
const LearnAppUser = firebase.database().ref('Manager/User');
export default class changePassComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            currentItemId: '',
            itemData: {},
            typedEmail: '',
            shortEmail: '',
            userData: {},
            pickerDisplayed: false,
            name: '',
            phone: '',
            address: '',
            birthday: '',
            status: '',
            newpassword: '',
            renewpassword: ''
        };
    }
    getItemFromDataFromDB() {
        LearnAppUser.orderByChild('id').equalTo(this.state.userData.id).on('value', (childSnapshot) => {
            var itemData = {};
            childSnapshot.forEach((doc) => {
                itemData = {
                    key: doc.key,
                    id: doc.toJSON().id,
                    email: doc.toJSON().email,
                    password: doc.toJSON().password,
                    role: doc.toJSON().role,
                    name: doc.toJSON().name,
                    phone: doc.toJSON().phone,
                    address: doc.toJSON().address,
                    birthday: doc.toJSON().birthday,
                    status: doc.toJSON().status
                };
                this.setState({
                    itemData: itemData,
                    name: this.state.itemData.name,
                    phone: this.state.itemData.phone,
                    address: this.state.itemData.address,
                    birthday: this.state.itemData.birthday,
                    status: this.state.itemData.status
                });
                console.log('db', this.state.itemData);
            });
        });
    }
    async componentDidMount() {
        await setItemToAsyncStorage('currentScreen', info);
        const currentItemId = await getItemFromAsyncStorage('currentItemId');
        //console.log(`get currentItemId = ${currentItemId}`);
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
        this.getItemFromDataFromDB();
        console.log('userdata', this.state.userData);
    }
    setPickerValue(newValue) {
        this.setState({
            itemData: {
                ...this.state.itemData,
                role: newValue
            }
        });

        this.togglePicker();
    }
    togglePicker() {
        this.setState({
            pickerDisplayed: !this.state.pickerDisplayed
        });
    }
    getUserFromDB() {
        return new Promise((resolve) => {
            LearnAppUser.orderByChild('email').equalTo(this.state.typedEmail).on('value', (childSnapshot) => {
                var userData = {};
                childSnapshot.forEach((doc) => {
                    userData = {
                        id: doc.toJSON().id,
                        email: doc.toJSON().email,
                        password: doc.toJSON().password,
                        role: doc.toJSON().role,
                        name: doc.toJSON().name
                    };
                });
                resolve(userData);
            });
        });
    }
    async update() {
        try {
            await LearnAppUser.orderByChild('id').equalTo(this.state.userData.id).on('child_added', (data) => {
                data.key;
                LearnAppUser.child(data.key)
                    .update({
                        name: this.state.name,
                        birthday: this.state.birthday,
                        phone: this.state.phone,
                        address: this.state.address
                    })
                    .then(async () => {
                        await AsyncStorage.clear();
                        const userData = await this.getUserFromDB();
                        setItemToAsyncStorage('userData', userData);
                        Alert.alert('Thông báo', 'Cập nhật thành công!');
                        this.props.navigation.navigate(Home);
                    });
            });
        } catch (error) {
            alert(error);
        }
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
                        /* this.update(); */
                        Alert.alert('Thông báo', 'Đổi mật khẩu thành công');
                        this.props.navigation.navigate(info);
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
                    source={require('SystemManager/img/70331284_752704455184910_2392173157533351936_n.jpg')}
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
                                Mật khẩu
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
                                backgroundColor: '#F1F1F1'
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
                                        placeholder='Nhập mật khẩu cũ'
                                        autoCapitalize='none'
                                        maxLength={10}
                                        onChangeText={(text) => {
                                            this.setState({
                                                password: text
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
                                    Nhập mật khẩu mới:
                                </Text>
                                <View style={[ styles.propertyValueRowView ]}>
                                    <TextInput
                                        style={styles.multilineBox}
                                        keyboardType='default'
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor='grey'
                                        placeholder='Nhập mật khẩu mới'
                                        autoCapitalize='none'
                                        maxLength={10}
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
                                        placeholder='Nhập lại mật khẩu mới'
                                        autoCapitalize='none'
                                        maxLength={10}
                                        onChangeText={(text) => {
                                            this.setState({
                                                renewpassword: text
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
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
                                    textAlignVertical: 'center'
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
        marginTop: '2%',
        borderColor: '#1E90FF',
        borderTopWidth: 5,
        textAlignVertical: 'top',
        backgroundColor: 'white',
        marginLeft: '2%',
        marginRight: '2%',
        borderRadius: 5,
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
