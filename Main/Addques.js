import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image, Alert, TextInput, ScrollView } from 'react-native';
import firebase from 'react-native-firebase';
import Button from 'react-native-button';
import { Home, info, listques } from 'SystemManager/Navigation/screenName';
import { setItemToAsyncStorage, getItemFromAsyncStorage } from 'SystemManager/Function/function';
import AsyncStorage from '@react-native-community/async-storage';
import Header from 'SystemManager/subComponent/Header';
import Footer from 'SystemManager/subComponent/footer';

//tham chieu den root
const quesRef = firebase.database().ref('Manager/Question/Math/Exam1');
export default class addquesComponent extends Component {
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Thêm câu hỏi';
        let drawerIcon = () => (
            <Image
                source={require('SystemManager/icons/icons8-question-mark-64.png')}
                style={{ width: 26, height: 26, tintColor: '#1E90FF' }}
            />
        );

        return { drawerLabel, drawerIcon };
    };
    constructor(props) {
        super(props);
        this.state = {
            userData: {},
            currentUser: null,
            itemData: {},
            question: '',
            sen: '',
            a: '',
            b: '',
            c: '',
            d: ''
        };
    }
    async componentDidMount() {
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
        const { currentUser } = firebase.auth();
        this.setState({ currentUser });
    }
    onPressAdd = () => {
        if (
            this.state.question.trim() === '' ||
            this.state.a.trim() === '' ||
            this.state.b.trim() === '' ||
            this.state.c.trim() === '' ||
            this.state.d.trim() === ''
        ) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }
        quesRef.push({
            id: require('random-string')({ length: 10 }),
            sen: this.state.sen,
            question: this.state.question,
            A: this.state.a,
            B: this.state.b,
            C: this.state.c,
            D: this.state.d
        });
        Alert.alert('Thông báo', 'Thêm thành công');
        this.props.navigation.navigate(Home);
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#F1F1F1' }}>
                <Header {...this.props} />
                <ScrollView>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            alignSelf: 'flex-start',
                            color: 'black',
                            marginTop: '1%',
                            marginLeft: '2%'
                        }}
                    >
                        Câu hỏi:
                    </Text>
                    <View style={{ alignSelf: 'center' }}>
                        <View style={[ styles.propertyValueRowView, { marginBottom: '2%' } ]}>
                            <TextInput
                                keyboardType='numeric'
                                style={styles.multilineBox}
                                placeholderTextColor='grey'
                                placeholder='Câu số...'
                                multiline={true}
                                maxLength={3}
                                /* editable = {false} */
                                onChangeText={(text) => {
                                    this.setState({ sen: text });
                                }}
                            />
                        </View>
                        <View style={[ styles.propertyValueRowView, { marginBottom: '2%' } ]}>
                            <TextInput
                                style={styles.multilineBox}
                                placeholderTextColor='grey'
                                placeholder='Thêm câu hỏi'
                                multiline={true}
                                maxLength={100}
                                /* editable = {false} */
                                onChangeText={(text) => {
                                    this.setState({ question: text });
                                }}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                alignSelf: 'flex-start',
                                color: 'black',
                                marginTop: '1%',
                                marginLeft: '2%'
                            }}
                        >
                            Trả lời:
                        </Text>
                        <View style={[ styles.propertyValueRowView, { marginBottom: '2%' } ]}>
                            <TextInput
                                style={styles.multilineBox}
                                placeholderTextColor='grey'
                                placeholder='A.Câu trả lời'
                                multiline={true}
                                maxLength={100}
                                /* editable = {false} */
                                onChangeText={(text) => {
                                    this.setState({ a: text });
                                }}
                            />
                        </View>

                        <View style={[ styles.propertyValueRowView, { marginBottom: '2%' } ]}>
                            <TextInput
                                style={styles.multilineBox}
                                placeholderTextColor='grey'
                                placeholder='B.Câu trả lời'
                                multiline={true}
                                maxLength={100}
                                /* editable = {false} */
                                onChangeText={(text) => {
                                    this.setState({ b: text });
                                }}
                            />
                        </View>
                        <View style={[ styles.propertyValueRowView, { marginBottom: '2%' } ]}>
                            <TextInput
                                style={styles.multilineBox}
                                placeholderTextColor='grey'
                                placeholder='C.Câu trả lời'
                                multiline={true}
                                maxLength={100}
                                /* editable = {false} */
                                onChangeText={(text) => {
                                    this.setState({ c: text });
                                }}
                            />
                        </View>
                        <View style={[ styles.propertyValueRowView, { marginBottom: '2%' } ]}>
                            <TextInput
                                style={styles.multilineBox}
                                placeholderTextColor='grey'
                                placeholder='D.Câu trả lời'
                                multiline={true}
                                maxLength={100}
                                /* editable = {false} */
                                onChangeText={(text) => {
                                    this.setState({ d: text });
                                }}
                            />
                        </View>
                        <Button
                            containerStyle={{
                                width: 150,
                                height: 60,
                                marginTop: '1%',
                                marginBottom: '1%',
                                backgroundColor: '#1E90FF',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5
                            }}
                            style={{
                                fontSize: 19,
                                fontWeight: 'bold',
                                color: 'white',
                                marginTop: '1%',
                                textAlign: 'center',
                                textAlignVertical: 'center'
                            }}
                            onPress={() => {
                                this.onPressAdd();
                            }}
                        >
                            Thêm
                        </Button>
                    </View>
                </ScrollView>
                <Footer {...this.props} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    propertyValueRowView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 0,
        marginBottom: 0,
        width: '100%'
    },
    multilineBox: {
        width: '96%',
        height: 50,
        marginTop: '2%',
        borderColor: '#1E90FF',
        borderBottomWidth: 5,
        textAlignVertical: 'top',
        marginLeft: '2%',
        marginRight: '2%',
        borderRadius: 5,
        color: 'black'
    },
    multilineBox1: {
        width: '98%',
        height: 50,
        marginTop: '1%',
        borderColor: '#66CDAA',
        borderBottomWidth: 2,
        textAlignVertical: 'top',
        backgroundColor: 'white',
        marginLeft: '1%',
        color: 'blue'
    }
});
