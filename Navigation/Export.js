import React, { Component } from 'react';
import { Dimensions, Image, View, Text, ScrollView, ImageBackground } from 'react-native';
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
import liteComponent from 'thitracnghiem/Subject/Literature';
import engComponent from 'thitracnghiem/Subject/English';
import addquesComponent from 'thitracnghiem/Main/Addques';
import ListquesComponent from 'thitracnghiem/subComponent/Listques';
import HeaderDrawer from 'thitracnghiem/Navigation/HeaderDrawer';
import chartsComponent from 'thitracnghiem/Main/Charts';
import changePassComponent from 'thitracnghiem/subComponent/changePass';
import Resultmain from 'thitracnghiem/Subject/resultmain';
//---------------------------------------------------------------
import {
    Login,
    SignUp,
    Home,
    AuthLoading,
    info,
    math,
    lite,
    eng,
    addques,
    listques,
    charts,
    changePass,
    result
} from 'thitracnghiem/Navigation/screenName';
//---------------------------------------------------------------

//---------------------------------------------------------------
const AuthStack = createStackNavigator({ Login: loginComponent, SignUp: signupComponent }, { headerMode: 'none' });
const HomeStack = createStackNavigator(
    {
        //'Home': homeComponent
        Home: homeComponent,
        lite: liteComponent,
        eng: engComponent,
        listques: ListquesComponent
    },
    { headerMode: 'none' }
);
const MathStack = createStackNavigator(
    {
        result: Resultmain,
        math: MathComponent
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
                    source={require('thitracnghiem/icons/icons8-home-100.png')}
                    style={{ width: 26, height: 26, tintColor: '#1E90FF' }}
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
                    source={require('thitracnghiem/icons/user.png')}
                    style={{ width: 26, height: 26, tintColor: '#1E90FF' }}
                />
            )
        }
    },
    addques: addquesComponent,
    charts: chartsComponent
};
let drawerNavConfig = {
    unmountInactiveRoutes: true,
    //drawerWidth : screenWidth /2,
    drawerPosition: 'left',
    contentOptions: {
        activeTintColor: 'crimson'
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
