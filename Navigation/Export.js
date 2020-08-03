import React, { Component } from 'react';
import { Image,  ScrollView, ImageBackground } from 'react-native';
import { createAppContainer, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
//---------------------------------------------------------------
import loginComponent from 'thitracnghiem/LoginSignUp/Login';
import signupComponent from 'thitracnghiem/LoginSignUp/SignUp';
import homeComponent from 'thitracnghiem/Main/Home';
import AuthLoadingScreen from 'thitracnghiem/subComponent/Loading';
import infoAccComponent from 'thitracnghiem/Main/infoAcc';
import MathComponent from 'thitracnghiem/Subject/Math';
import DttComponent from 'thitracnghiem/Subject/Dtt';
import ListquesComponent from 'thitracnghiem/subComponent/Listques';
import HeaderDrawer from 'thitracnghiem/Navigation/HeaderDrawer';
import chartsComponent from 'thitracnghiem/Main/Charts';
import changePassComponent from 'thitracnghiem/subComponent/changePass';
import Resultmain from 'thitracnghiem/Subject/resultmain';
import HistoryCom from 'thitracnghiem/Main/History';
import FopassCom from 'thitracnghiem/LoginSignUp/fopassword';
import TakepassCom from 'thitracnghiem/LoginSignUp/takepass';
import {
    Login,
    SignUp,
    Home,
    AuthLoading,
    info,
    math,
    listques,
    charts,
    changePass,
    result,
    histo,
    fopass,
    takepass
} from 'thitracnghiem/Navigation/screenName';
const AuthStack = createStackNavigator(
    { Login: loginComponent, SignUp: signupComponent, fopass: FopassCom, takepass: TakepassCom },
    { headerMode: 'none' }
);
const HomeStack = createStackNavigator(
    {
        Home: homeComponent,
        listques: ListquesComponent
    },
    { headerMode: 'none' }
);
const HisStack = createStackNavigator(
    {
        his: HistoryCom,
    },
    { headerMode: 'none' }
);
const ResStack = createStackNavigator(
    {
        res: chartsComponent
    },
    { headerMode: 'none' }
);
const MathStack = createStackNavigator(
    {
        math: MathComponent,
        dtt: DttComponent,
        result: Resultmain
    },
    { headerMode: 'none' }
);
const DrawerContent = (props) => (
    <ImageBackground
        source={require('thitracnghiem/img/70331284_752704455184910_2392173157533351936_n.jpg')}
        style={{ width: '100%', height: '100%' }}
    >
        <ScrollView>
            <HeaderDrawer />
            <DrawerNavigatorItems {...props} />
        </ScrollView>
    </ImageBackground>
);
const infoStack = createStackNavigator(
    {
        info: infoAccComponent,
        changePass: changePassComponent
    },
    { headerMode: 'none' }
);
let routeConfig = {
    Home: {
        screen: HomeStack,
        navigationOptions: {
            drawerLabel: 'Trang chủ',
            drawerIcon: (
                <Image
                    source={require('thitracnghiem/icons/icons8-home-480.png')}
                    style={{ width: 26, height: 26, tintColor: 'white' }}
                />
            )
        }
    },
    info: {
        screen: infoStack,
        navigationOptions: {
            drawerLabel: 'Thông tin cá nhân',
            drawerIcon: (
                <Image
                    source={require('thitracnghiem/icons/icons8-user-male-512.png')}
                    style={{ width: 26, height: 26, tintColor: 'white' }}
                />
            )
        }
    },
    histo: {
        screen: HisStack,
        navigationOptions: {
            drawerLabel: 'Lịch sử thi',
            drawerIcon: (
                <Image
                    source={require('thitracnghiem/icons/icons8-time-machine-100.png')}
                    style={{ width: 26, height: 26, tintColor: 'white' }}
                />
            )
        }
    },
    charts: {
        screen: ResStack ,
        navigationOptions: {
            drawerLabel: 'Xếp hạng',
            drawerIcon: (
                <Image
                    source={require('thitracnghiem/icons/icons8-crown-480.png')}
                    style={{ width: 26, height: 26, tintColor: 'white' }}
                />
            )
        }
    },
};
let drawerNavConfig = {
    unmountInactiveRoutes: true,
    drawerPosition: 'left',
    contentOptions: {
        activeTintColor: 'white'
    },
    contentComponent: DrawerContent
};
const drawer = createDrawerNavigator(routeConfig, drawerNavConfig);
const SwithNav = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        Auth: AuthStack,
        App: drawer,
        mathstack: MathStack
    },
    {
        initialRouteName: AuthLoading
    }
);
export default (Run = createAppContainer(SwithNav));
