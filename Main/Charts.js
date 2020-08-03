import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    FlatList,
    StyleSheet,
    ImageBackground,
    TouchableHighlight
} from 'react-native';
import Button from 'react-native-button';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import Header from 'thitracnghiem/subComponent/Header';
import Footer from 'thitracnghiem/subComponent/footer';
import LinearGradient from 'react-native-linear-gradient';
export default class chartsComponent extends Component {
    static navigationOptions = ({ navigation }) => {
        let drawerLabel = 'Xếp hạng';
        let drawerIcon = () => (
            <Image
                source={require('thitracnghiem/icons/icons8-crown-480.png')}
                style={{ width: 26, height: 26, tintColor: '#1E90FF' }}
            />
        );

        return { drawerLabel, drawerIcon };
    };
    constructor(props) {
        super(props);
        this.state = {
            objTop: {},
            objCon: {},
            objCus: {},
            listTop: [],
            listRes: [],
            Id_Top: '',
            key: '',
            index: 0,
            point: 0,
            scrollViewWidth:0,
			currentXOffset:0
        };
    }
    getCus = async () => {
        await firebase.database().ref("Customer").on("value", (value) => {
            if (value.exists()) {
                this.setState({ objCus: value.val() });
            }
        })
    }
    getCon = async () => {
        await firebase.database().ref("Contest").once("value", (value) => {
            if (value.exists()) {
                this.setState({ objCon: value.val() });
            }
        })
    }
    changeTime = (time) => {
        var min = parseInt(time / 60);
        var sec = time % 60;
        if (min < 10 && min > 0) min = '0' + min;
        if (sec < 10 && sec > 0) sec = '0' + sec;
        return min + ' phút ' + sec + ' giây';
    }
    getRes = async () => {
        await firebase.database().ref("Result").orderByChild('Point').once("value", (value) => {
            if (value.exists()) {
                var arr = [];
                value.forEach((element) => {
                        arr.push(
                            element.toJSON()
                        );
                });
                arr.sort(function (a, b) { return b.Point - a.Point || (b.Point == a.Point && a.TimeLeft_Res > b.TimeLeft_Res) });
                    this.setState({
                        listRes: arr
                    })
                }
        })
    }

    getTop = async () => {
        await firebase.database().ref("Topic").orderByChild("Status").equalTo(1).once("value", (value) => {
            if (value.exists()) {
                var arr = [];
                value.forEach((element) => {
                    arr.push(
                        {
                            Id: element.key,
                            Name_Top: element.toJSON().Name_Top,
                            Status: element.toJSON().Status
                        });
                })
                this.setState({
                    objTop: value.val(),
                    listTop: arr,
                    Id_Top: arr[0].Id 
                })
            }
        })
    }
    async componentDidMount() {
        await AsyncStorage.getItem('userData').then((value) => {
            const userData = JSON.parse(value);
            this.setState({
                key: userData.Id,
            });
        });
        await this.getTop();
        await this.getCon();
        await this.getRes();
        await this.getCus();
    }
    _handleScroll = (event) => {
		var newXOffset = event.nativeEvent.contentOffset.x
		this.setState({currentXOffset:newXOffset})
	  }
	leftArrow = () => {
	var	eachItemOffset = 120; 
	var	_currentXOffset =  this.state.currentXOffset - eachItemOffset;
		this.refs.scrollView.scrollToOffset({offset: _currentXOffset, animated: true});
	  }
	
	  rightArrow = () => {
		var eachItemOffset = 120;
		var	_currentXOffset =  this.state.currentXOffset + eachItemOffset;
		this.refs.scrollView.scrollToOffset({offset: _currentXOffset, animated: true})
	  }
    setIdTop = async (id) => {
        this.setState({
            Id_Top: id
        });
    }
    getCur = ()=>
    {
        var cus=[];
        var user=null;
        var index=-1;
        this.state.listRes.forEach(async(element)=>{
            if (this.state.objCus.hasOwnProperty(element.Id_Cus) 
            && !cus.includes(element.Id_Cus) && this.state.objCon[element.Id_Con].Id_Top==this.state.Id_Top)
            {
                cus.push(element.Id_Cus);
                if (element.Id_Cus==this.state.key)
                {
                    index++;
                    user=element;
                    return;
                }
                else
                {
                    index++;
                }
            }
        });
         index=cus.indexOf(this.state.key);
        return (
            <View style={{ flexGrow: 1 }}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['rgb(86, 123, 248)', 'rgb(95,192,255)']}
                style={{
                    width: '95%',
                    paddingVertical:20,
                    backgroundColor: 'white',
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        color: 'white',
                        alignSelf: 'center',
                        fontSize: 18
                    }}
                >
                    Hạng của tôi
            </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: '2%'
                    }}
                >
                    <Text
                        style={{
                            color: 'white'
                        }}
                    >
                        {cus.length>0?user.Point:'0'} điểm
                    </Text>
                    <Text
                        style={{
                            color: 'white'
                        }}
                    >
                        Hạng  {index>=-1?(index+1):'∞'}
                    </Text>


                </View>
            </LinearGradient>
        </View>
        )
    }
    getTopRes = () => {
        var arr = [];
        var index = 0;
        var cus=[];
        for (let i = 0; i < this.state.listRes.length; i++) {
            var element = this.state.listRes[i];          
            if (this.state.objCus.hasOwnProperty(element.Id_Cus) 
            && !cus.includes(element.Id_Cus) && this.state.objCon[element.Id_Con].Id_Top==this.state.Id_Top) {
               cus.push(element.Id_Cus);
                    arr.push(
                        <View
                            key={index}
                            style={{
                                width: '85%',
                                padding: 5,
                                flexDirection: 'row',
                                borderWidth: 2,
                                borderColor: '#1E90FF',
                                alignSelf: 'center',
                                marginBottom:10
                            }}
                        >
                            <View style={{ flexDirection: 'column',justifyContent:'center',marginRight:10}}>
                                <Image
                                    style={{
                                        width: 50,
                                        height: 50,
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                    
                                    }}
                                    source={index==0?require('thitracnghiem/icons/icons8-trophy-96.png'):index==1?require('thitracnghiem/icons/icons8-medal-second-place-80.png'):
                                    index==2?require('thitracnghiem/icons/icons8-medal-third-place-80.png'):require('thitracnghiem/icons/icons8-star-64.png')
                                    }
                                />
                            </View>
                            <View style={{ flexDirection: 'column',justifyContent:'center'}}>
                                <Text style={{ color: 'white' }}>Hạng {index+1}</Text>
                                <Text style={{ color: 'white' }}>Tài khoản : {this.state.objCus[element.Id_Cus].Username}</Text>
                                <Text style={{ color: 'white' }}>{element.Point} điểm</Text>
                                {this.state.Id_Top!='-MDBLQgsR3ZDZTyrrf8_'?<Text style={{ color: 'white' }}>{this.changeTime(element.TimeLeft_Res)}</Text>:null}
                            </View>
                        </View>
                    );
                        index++;
                        if (index==10)
                        {
                            break;
                        }
            }
        }
        for (let i = index ; i < 10; i++) {
            arr.push(
                <View
                    key={i}
                    style={{
                        width: '85%',
                        padding: 5,
                        flexDirection: 'row',
                        borderWidth: 2,
                        borderColor: '#1E90FF',
                        alignSelf: 'center',
                        marginBottom:10
                    }}
                >
                    <View style={{ flexDirection: 'column',justifyContent:'center',marginRight:10}}>
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                                justifyContent: 'center',
                                alignSelf: 'center',
                            
                            }}
                            source={i==0?require('thitracnghiem/icons/icons8-trophy-96.png'):i==1?require('thitracnghiem/icons/icons8-medal-second-place-80.png'):
                            i==2?require('thitracnghiem/icons/icons8-medal-third-place-80.png'):require('thitracnghiem/icons/icons8-star-64.png')
                            }
                        />
                    </View>
                    <View style={{ flexDirection: 'column',justifyContent:'center'}}>
                        <Text style={{ color: 'white' }}>Hạng ∞</Text>
                        <Text style={{ color: 'white' }}>Tài khoản : Không có</Text>
                        <Text style={{ color: 'white' }}>0 điểm</Text>
                        {this.state.Id_Top!='-MDBLQgsR3ZDZTyrrf8_'?<Text style={{ color: 'white' }}>{this.changeTime(0)}</Text>:null}
                    </View>
                </View>
            );
        }
        if (arr.length == 0) return null
        else
            return arr;
    }
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#F1F1F1'
                }}
            >
                <ImageBackground
                    source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Header {...this.props} title={'Bảng Xếp Hạng'} />
                    <View
						style={{
							 flexDirection:'row', 
							justifyContent:'center'
						}}
					>
						<TouchableHighlight
						style={{ justifyContent:'center',marginHorizontal:10,}}
						onPress={this.leftArrow}>
							<Image
								source={require('thitracnghiem/icons/icons8-left-24.png')}
								style={{ width: 20, height: 20, tintColor: 'white'}}
							/>
					</TouchableHighlight>
                    <FlatList
                        horizontal={true}
                        ref={'scrollView'}
                        onContentSizeChange={(w, h) => this.setState({scrollViewWidth:w})}
                        scrollEventThrottle={16}
                        onScroll={this._handleScroll}
                        data={this.state.listTop}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}
                        renderItem={({ item, index }) => {
                            return (
                                <View>
                                    <LinearGradient
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        colors={this.state.Id_Top == item.Id ? ['gray', 'gray'] : ['rgb(86, 123, 248)', 'rgb(95,192,255)']}    
                                        style={
                                            {
                                            width: 100,
                                            height: 40,               
                                            borderRadius: 40,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            margin: 5
                                        }
                                        }
                                    >
                                        <Button
                                            containerStyle={{
                                                justifyContent: 'center'
                                            }}
                                            onPress={async () => {
                                                this.setIdTop(item.Id);
                                            }}
                                            style={{ alignSelf: 'center', color: 'white' }}
                                        >
                                            {item.Id=='-MDBLQgsR3ZDZTyrrf8_'?'ĐTT':item.Name_Top.length>20?(item.Name_Top.substr(27)+'...'):item.Name_Top}
                                        </Button>
                                    </LinearGradient>
                                </View>
                            );
                        }}

                    />
				<TouchableHighlight
						style={{ justifyContent:'center',marginHorizontal:10,}}
						onPress={this.rightArrow}>
							<Image
								source={require('thitracnghiem/icons/icons8-right-24.png')}
								style={{ width: 20, height: 20, tintColor: 'white'}}
							/>
					</TouchableHighlight>
					</View>
                    {this.getCur()}
                 

                    <ScrollView  style={{marginVertical:10}}>

                        <View>
                            {this.getTopRes()}
                        </View>

                    </ScrollView>

                    <Footer {...this.props} />
                </ImageBackground>
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