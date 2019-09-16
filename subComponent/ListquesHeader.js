import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet, Alert, TextInput, FlatList, Image} from 'react-native';
import Button from 'react-native-button';
/* import OfflineNotice from 'PhanAnh/miniComponent/OfflineNotice'; */
import { Home, info,math} from 'SystemManager/Navigation/screenName'; 
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import {setItemToAsyncStorage,getItemFromAsyncStorage,setItemToAsyncStorage1} from 'SystemManager/Function/function';
import Header from 'SystemManager/subComponent/Header';

const quesRef = firebase.database().ref('Manager/Question/Math/Exam1');
export default class ListquesHeaderComponent extends Component {
    constructor(props){
        super(props);
        this.state = ({
            currentItemId1: '',
            typedEmail: '',
            shortEmail: '',
            currentUser: null,
            arrayQues: [],
            user: '',
            loading: false,
            userData: {},
        });
    }
    getDataFromDB(){
        quesRef.on('value',(childSnapshot) =>{
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
                   d: doc.toJSON().D,
               });
           });
               this.setState({
                arrayQues : arrayQues,
                   loading: false,
               });
       });
   }
   async componentDidMount(){
    await setItemToAsyncStorage('currentScreen', Home);
    await AsyncStorage.getItem('userData').then(async (value) => {
    const userData = JSON.parse(value);
    await this.setState({userData: userData});
    console.log(this.state.userData);
    const shortEmail = this.state.userData.email.split('@').shift();
    await this.setState({
    typedEmail: this.state.userData.email,
        shortEmail: shortEmail
    });
});

    const { currentUser } = firebase.auth()
    this.setState({ currentUser })
   this.getDataFromDB();
}
async setItemId(currentItemId1) {
    await setItemToAsyncStorage1('currentItemId1', currentItemId1);
    /* console.log(`set currentItemId = ${currentItemId}`); */
     this.props.navigation.navigate(math);
}
    render(){
		const { currentUser } = this.state
        return(
            <View style = {{ /* flex: 1, marginTop: Platform.OS === 'ios' ? 34:0, */backgroundColor:'#F1F1F1' }}>
                {/* <Header {...this.props} /> 
				 <View style = {{
            backgroundColor: '#1E90FF',
            justifyContent: 'center',
            alignItems:'center',
            height: 64,
            
          }}>
            <Text style = {{
              justifyContent: 'center',
              alignItems:'center',
              //marginBottom: '2%',
              color:'white',
              fontSize:16,
              fontWeight:'bold'
            }}>
              Danh sách câu hỏi
            </Text>
          </View> */}
                <FlatList 
                 horizontal = {true} 
                data = {this.state.arrayQues}
                renderItem = {({item, index}) => {
                    return(
                        <Button
                        containerStyle={{
                            width: 50,
                            height: 50,
                            marginTop: '1%',
                            marginBottom: '1%',
                            backgroundColor: '#1E90FF',
                            /* alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center', */
                            borderRadius: 50,
                        }}
                        onPress = {() =>     this.setItemId(item.id)      /* Alert.alert('Thông báo',item.question ) */}
                        >
                        <Text style = {{
                            fontSize: 13,
                            margin:'2%',
                            textAlign:'center' 
                        }}>{item.sen}</Text>
                        </Button>
                    );
                }}
                >
                </FlatList>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor:'#F1F1F1'
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
  },
})