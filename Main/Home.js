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
    ActivityIndicator
} from 'react-native';
import Button from 'react-native-button';
import { Login, Home, lite, math, eng, listques } from 'thitracnghiem/Navigation/screenName';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import {
    setItemToAsyncStorage,
    getItemFromAsyncStorage,
    setItemToAsyncStorage1
} from 'thitracnghiem/Function/function';
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice';*/
import Header from 'thitracnghiem/subComponent/Header';
import Footer from 'thitracnghiem/subComponent/footer';
import LinearGradient from 'react-native-linear-gradient';
import { FlatList } from 'react-native-gesture-handler';

const LearnAppUser = firebase.database().ref('Manager/User');
const topic = firebase.database().ref('Topic');
export default class homeComponent extends Component {
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
            currentUser: null,
            userData: {},
            count: 5,
            history: {},
            arrayTopic: []
        };
    }
    getdataTopic() {
        topic.on('value', (childSnapshot) => {
            const arrayTopic = [];
            childSnapshot.forEach((doc) => {
                if (doc.toJSON().status == 1)
                    arrayTopic.push({
                        id: doc.toJSON().id,
                        name_top: doc.toJSON().name_top,
                        status: doc.toJSON().status
                    });
            });
            this.setState({
                arrayTopic: arrayTopic
            });
        });
    }
    async test() {
        try {
            await LearnAppUser.orderByChild('id').equalTo(this.state.userData.id).on('child_added', (data) => {
                data.key;
                const history = {
                    id: require('random-string')({ length: 10 }),
                    time: '',
                    date: '',
                    rightSen: 0,
                    score: 0
                };
                LearnAppUser.child(data.key).child('History').push(history);
                this.setState({
                    history: history
                });
                console.log(this.state.history);
            });
            this.props.navigation.navigate(math);
        } catch (error) {
            alert(error);
        }
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
    deleteUser = () => {
        firebase
            .auth()
            .currentUser.delete()
            .then(async () => {
                Alert.alert('Thông báo', 'Xóa tài khoản thành công');
                await LearnAppRef.orderByChild('id').equalTo(this.state.userData.id).on('child_added', (data) => {
                    data.key;
                    LearnAppRef.child(data.key).remove();
                });
                await AsyncStorage.clear();
                this.props.navigation.navigate(Login);
            })
            .catch((error) => {
                Alert.alert(`${error.toString().replace('Error: ', '')}`);
            });
    };
    async setTopicId(id) {
        await setItemToAsyncStorage1('id', id.toString());
        Alert.alert(
            'Thông báo',
            'Bạn đã sẵn sàng làm bài?',
            [
                { text: 'Để sau', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Sẵn sàng',
                    onPress: async () => {
                        this.props.navigation.navigate(math);
                    }
                }
            ],
            { cancelable: true }
        );
        this.setState({
            loading: true
        });
    }
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
        this.getdataTopic();
        console.log('userdata', this.state.userData);
    }
    gettopic = () => {
        var arr = [];
        this.state.arrayTopic.forEach((item, index) => {
            arr.push(
                <View
                    key={index}
                    style={{
                        width: 150,
                        height: 200,
                        backgroundColor: 'rgba(255,255,255, 0.7)',
                        borderColor: '#1E90FF',
                        borderWidth: 2,
                        margin: '2%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10
                    }}
                >
                    <Image
                        style={{
                            width: 50,
                            height: 50,
                            tintColor: '#1E90FF'
                        }}
                        source={require('thitracnghiem/icons/icons8-coordinate-system-80.png')}
                    />
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 18
                        }}
                    >
                        {item.name_top}
                    </Text>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[ 'rgb(86, 123, 248)', 'rgb(95,192,255)' ]}
                        style={{
                            margin: '2%',
                            padding: '2%',
                            borderRadius: 50,
                            width: 120
                        }}
                    >
                        <Button
                            style={{
                                fontSize: 16,
                                color: 'white'
                            }}
                            onPress={() => {
                                this.setTopicId(item.id);
                            }}
                        >
                            Thi ngay
                        </Button>
                    </LinearGradient>
                </View>
            );
        });
        if (arr.length == 0) return null;
        else return arr;
    };
    render() {
        const { currentUser } = this.state;
        return (
            <View style={styles.contain}>
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/*<OfflineNotice/>*/}
                    <Header {...this.props} />
                    <ScrollView>
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#1E90FF',
                                marginTop: '1%',
                                fontStyle: 'italic'
                            }}
                        >
                            M.C.O.P
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#1E90FF',
                                margin: '1%',
                                fontStyle: 'italic'
                            }}
                        >
                            Thi trắc nghiệm online
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}
                        >
                            {this.gettopic()}
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
                    <Footer {...this.props} />
                </ImageBackground>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#F1F1F1'
    },
    multilineBox: {
        width: '96%',
        height: 50,
        marginTop: 20,
        borderColor: '#66CDAA',
        borderWidth: 2,
        textAlignVertical: 'top',
        backgroundColor: 'white',
        marginLeft: '2%',
        marginRight: '2%',
        borderRadius: 5
    },
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 0,
        marginBottom: 0
    },
    itemText: {
        padding: '1%',
        fontSize: 12
    }
});
