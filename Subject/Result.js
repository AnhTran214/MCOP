import React, {Component} from 'react';
import { Text, View, FlatList, StyleSheet, Image, Alert, Platform, 
    TouchableHighlight, TextInput, Dimensions} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';
import {Login, Home, info, math} from 'SystemManager/Navigation/screenName';

var screen = Dimensions.get('window');
export default class Result extends Component {
    constructor(props){
        super(props);
        this.state = ({
            pickerDisplayed: false,
        })
    }
    showAddModal = () =>{
        this.refs.myModal.open();
    }
    render(){
        return(
            <Modal
                ref = {'myModal'}
                style = {{
                    justifyContent: 'center',
                    borderRadius: Platform.OS === 'ios' ? 30 : 0,
                    shadowRadius: 10,
                    width: screen.width -80,
                    height: 500
                }}
                position = 'center'
                backdrop = {true}
               /*  onClosed = {() => {
                    Alert.alert('Thông báo','Modal đã đóng.')
                }} */
            >
                <Text style = {{
                    textAlign: "center",
                    color:'grey',
                    fontSize: 16,
                    fontStyle:'italic',
                    fontWeight:'bold'
                }}>
                    Xin chào! Đây là modal tính điểm
                </Text>
                <Button
                    containerStyle={{
						width: 100,
						height: 50,
						marginTop: '1%',
						marginBottom: '1%',
						backgroundColor: '#1E90FF',
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: 5
					}}
					style={{
						fontSize: 16,
						fontWeight: 'bold',
						color: 'white',
						marginTop: '1%',
						textAlign: 'center',
						textAlignVertical: 'center'
					}}
                    onPress={()=>{this.props.gotoHome()
                    }}
                >
                    Hoàn thành
                </Button>
            </Modal>
        );
    }
}