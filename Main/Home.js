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
import { Home, math, } from 'thitracnghiem/Navigation/screenName';
import firebase from 'react-native-firebase';
import {
    setItemToAsyncStorage,
} from 'thitracnghiem/Function/function';
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice';*/
import Header from 'thitracnghiem/subComponent/Header';
import Footer from 'thitracnghiem/subComponent/footer';
import LinearGradient from 'react-native-linear-gradient';

const topic = firebase.database().ref('Topic');
export default class homeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
   async getdataTopic() {
      await  topic.on('value', async(childSnapshot) => {
            const arrayTopic = [];
           await childSnapshot.forEach((doc) => {
                if (doc.toJSON().Status == 1)
                    arrayTopic.push({
                        Id: doc.key,
                        Name_Top: doc.toJSON().Name_Top,
                        Image : doc.toJSON().Image,
                        Status: doc.toJSON().Status
                    });
            });
            this.setState({
                arrayTopic: arrayTopic
            });
        });
    }
    async setTopicId(id) {
        Alert.alert(
            'Thông báo',
            'Bạn đã sẵn sàng làm bài?',
            [
                { text: 'Để sau', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Sẵn sàng',
                    onPress: async () => {
                        this.props.navigation.navigate(math,{Id_Top:id});
                    }
                }
            ],
            { cancelable: true }
        );
    }
    async componentDidMount() {

        await setItemToAsyncStorage('currentScreen', Home);
        await this.getdataTopic().then(()=>
        {
            this.gettopic();
        }
        );

     

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
                            height: 50
                        }}
                        source = {{uri: item.Image}}
                    />
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 18
                        }}
                    >
                        {item.Name_Top} 
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
                                this.setTopicId(item.Id);
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
