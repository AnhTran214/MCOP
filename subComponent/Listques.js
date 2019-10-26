import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Alert, TextInput, FlatList, Image } from 'react-native';
import Button from 'react-native-button';
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice'; */
import { Home, info, math, listques } from 'SystemManager/Navigation/screenName';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import {
    setItemToAsyncStorage,
    getItemFromAsyncStorage,
    setItemToAsyncStorage1
} from 'SystemManager/Function/function';
import Header from 'SystemManager/subComponent/Header';
import Footer from 'SystemManager/subComponent/footer';
import { TouchableHighlight } from 'react-native-gesture-handler';

/* import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'; */

const quesRef = firebase.database().ref('Manager/Question/Math/Exam1');
export default class ListquesComponent extends Component {
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Danh sách câu hỏi';
        let drawerIcon = () => (
            <Image
                source={require('SystemManager/icons/icons8-summary-list-100.png')}
                style={{ width: 26, height: 26, tintColor: '#1E90FF' }}
            />
        );

        return { drawerLabel, drawerIcon };
    };
    constructor(props) {
        super(props);
        this.state = {
            currentItemId: '',
            typedEmail: '',
            shortEmail: '',
            currentUser: null,
            arrayQues: [],
            user: '',
            loading: false,
            userData: {}
        };
    }
    getDataFromDB() {
        quesRef.on('value', (childSnapshot) => {
            const arrayQues = [];
            childSnapshot.forEach((doc) => {
                arrayQues.push({
                    key: doc.key,
                    id: doc.toJSON().id,
                    sen: doc.toJSON().sen,
                    question: doc.toJSON().question,
                    a: doc.toJSON().A,
                    b: doc.toJSON().B,
                    c: doc.toJSON().C,
                    d: doc.toJSON().D
                });
            });
            this.setState({
                arrayQues: arrayQues,
                loading: false
            });
        });
    }
    async componentDidMount() {
        await setItemToAsyncStorage('currentScreen', Home);
        await AsyncStorage.getItem('userData').then(async (value) => {
            const userData = JSON.parse(value);
            await this.setState({ userData: userData });
            console.log(this.state.userData);
            const shortEmail = this.state.userData.email.split('@').shift();
            await this.setState({
                typedEmail: this.state.userData.email,
                shortEmail: shortEmail
            });
        });

        const { currentUser } = firebase.auth();
        this.setState({ currentUser });
        this.getDataFromDB();
    }
    async setItemId(currentItemId) {
        await setItemToAsyncStorage1('currentItemId', currentItemId);
        console.log(`set currentItemId = ${currentItemId}`);
        this.props.navigation.navigate(math);
        /* this.refs.FlatListtest.open(); */
    }

    render() {
        const { currentUser } = this.state;
        return (
            <View style={{ width: '100%', marginTop: Platform.OS === 'ios' ? 34 : 0, backgroundColor: '#F1F1F1' }}>
                <FlatList
                    horizontal={true}
                    data={this.state.arrayQues}
                    renderItem={({ item, index }) => {
                        return (
                            <View>
                                <Button onPress={this.props.pressCauHoi}>
                                    <Button
                                        containerStyle={{
                                            width: 50,
                                            height: 50,
                                            backgroundColor: '#1E90FF',
                                            borderRadius: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            margin: 5
                                        }}
                                        onPress={async () => {
                                            alert('setItemSen = ' + item.sen);
                                            await setItemToAsyncStorage('currentSen', item.sen);
                                        }}
                                        style={{
                                            fontSize: 13,
                                            color: 'white'
                                        }}
                                    >
                                        {item.sen}
                                    </Button>
                                </Button>
                            </View>
                        );
                    }}
                />

                {/* <FlatList 
                ref = {'FlatListtest'}
                horizontal = {true}
                data = {this.state.arrayQues}
                renderItem = {({item, index}) => {
                    return(
                        
                        <View
                        style={{
                            width: 450,
                            height: 300,
                            marginTop: '1%',
                            marginBottom: '1%',
                            backgroundColor: 'white',
                            borderRadius: 50,
                            flexDirection:'column'
                        }}
                        >
                         <View style = {{flexDirection:'column',margin:'5%', justifyContent: 'center'}}>
                        <Text style = {{
                            fontSize: 13,
                            marginLeft: '2%',
                            
                        }}>
                        <Text style = {{fontSize:14, color: '#1E90FF'}}>Câu hỏi thứ {item.sen}: </Text></Text>
                        <Text style = {{
                            fontSize: 13,
                            marginLeft: '2%',
                            
                        }}>{item.question}</Text>
                        <Text style = {{
                            fontSize: 13,
                            marginLeft: '2%',
                            
                        }}>
                        <Text style = {{fontSize:14, color: '#1E90FF'}}>Trả lời: </Text></Text>
                        <Button
					containerStyle={{
						width: 150,
						height: 20,
                        backgroundColor: 'white',
                        borderColor: '#1E90FF',
                        borderWidth:2,
						justifyContent: 'center',
						alignItems: 'center',
                        borderRadius: 50,
                        margin: '1%'
					}}
					style={{
						fontSize: 13,
						fontWeight: 'bold',
						color: 'grey',
						alignSelf:'flex-start',
						margin: '1%'
					}}
					onPress={() => {
                         Alert.alert('Câu trả lời',item.a)
					}}
					>
					{item.a}
				</Button>
                <Button
					containerStyle={{
						width: 150,
						height: 20,
                        backgroundColor: 'white',
                        borderColor: '#1E90FF',
                        borderWidth:2,
						justifyContent: 'center',
						alignItems: 'center',
                        borderRadius: 50,
                        margin: '1%'
					}}
					style={{
						fontSize: 13,
						fontWeight: 'bold',
						color: 'grey',
						alignSelf:'flex-start',
						margin: '1%'
					}}
					onPress={() => {
                         Alert.alert('Câu trả lời',item.b)
					}}
					>
					{item.b}
				</Button>
                <Button
					containerStyle={{
						width: 150,
						height: 20,
                        backgroundColor: 'white',
                        borderColor: '#1E90FF',
                        borderWidth:2,
						justifyContent: 'center',
						alignItems: 'center',
                        borderRadius: 50,
                        margin: '1%'
					}}
					style={{
						fontSize: 13,
						fontWeight: 'bold',
						color: 'grey',
						alignSelf:'flex-start',
						margin: '1%'
					}}
					onPress={() => {
                         Alert.alert('Câu trả lời',item.c)
					}}
					>
					{item.c}
				</Button>
                <Button
					containerStyle={{
						width: 150,
						height: 20,
                        backgroundColor: 'white',
                        borderColor: '#1E90FF',
                        borderWidth:2,
						justifyContent: 'center',
						alignItems: 'center',
                        borderRadius: 50,
                        margin: '1%'
					}}
					style={{
						fontSize: 13,
						fontWeight: 'bold',
						color: 'grey',
						alignSelf:'flex-start',
						margin: '1%'
					}}
					onPress={() => {
                         Alert.alert('Câu trả lời',item.d)
					}}
					>
					{item.d}
				</Button>
                            <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, alignSelf: 'stretch', width:'70%', alignSelf:'center',
                        marginBottom:'2%', marginTop:'2%'}} />
                         </View> 
                        </View>
                        
                    );
                }}
                >
                </FlatList> */}
                {/* <Footer {...this.props} /> */}
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
        textAlignVertical: 'top',
        marginLeft: '2%',
        marginRight: '2%',
        borderBottomWidth: 2
    },
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 0,
        marginBottom: 0
    }
});
