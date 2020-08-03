import React, { Component } from 'react';
import {  View,  Alert } from 'react-native';
import Button from 'react-native-button';
import Result from 'thitracnghiem/Subject/Result';

export default class FooterSub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentItemId: '',
            typedEmail: '',
            shortEmail: '',
            userData: {},
            currentUser: null
        };
        this.onPressAdd = this.onPressAdd.bind(this);
    }
    onPressAdd = () => {
        /* this.refs.Result.showAddModal();  */
        Alert.alert('Thông báo', 'Nộp bài thành công');
    };
    async componentDidMount() {
      
    }
    render() {
        return (
            <View>
                <View
                    style={{
                        height: 50,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'white'
                    }}
                >
                    <Button
                        containerStyle={{
                            width: 100,
                            margin: '2%',
                            alignSelf: 'flex-start',
                            backgroundColor: '#1E90FF',
                            borderRadius: 50,
                            borderColor: '#1E90FF',
                            borderWidth: 3
                        }}
                        style={{
                            fontSize: 16,
                            color: 'white'
                        }}
                        onPress={async () => {
                            /* this.props.navigation.navigate(Home); */
                            Alert.alert('Thông báo', 'Câu trước');
                        }}
                    >
                        Trước
                    </Button>
                    <Button
                        containerStyle={{
                            width: 120,
                            height: 120,
                            /* margin: '2%', */
                            alignSelf: 'flex-start',
                            backgroundColor: '#1E90FF',
                            borderRadius: 50,
                            borderColor: '#1E90FF',
                            borderWidth: 3
                        }}
                        style={{
                            fontSize: 16,
                            color: 'white',
                            marginTop: '5%'
                        }}
                        onPress={this.onPressAdd}
                    >
                        Nộp bài
                    </Button>
                    <Button
                        containerStyle={{
                            width: 100,
                            margin: '2%',
                            alignSelf: 'flex-start',
                            backgroundColor: '#1E90FF',
                            borderRadius: 50,
                            borderColor: '#1E90FF',
                            borderWidth: 3
                        }}
                        style={{
                            fontSize: 16,
                            color: 'white'
                        }}
                        onPress={async () => {
                            /* this.props.navigation.navigate(info); */
                            Alert.alert('Thông báo', 'Câu sau');
                        }}
                    >
                        Sau
                    </Button>
                    <Result ref={'Result'} />
                </View>
            </View>
        );
    }
}
