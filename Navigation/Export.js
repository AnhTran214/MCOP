import React, { Component } from 'react';
import {Dimensions, Image} from 'react-native';
import { createAppContainer, createBottomTabNavigator, createSwitchNavigator
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
//---------------------------------------------------------------
import loginComponent from 'SystemManager/LoginSignUp/Login';
import signupComponent from 'SystemManager/LoginSignUp/SignUp';
import homeComponent from 'SystemManager/Main/Home';
import AuthLoadingScreen from 'SystemManager/subComponent/Loading';
import infoAccComponent from 'SystemManager/Main/infoAcc';
import MathComponent from 'SystemManager/Subject/Math';
import liteComponent from 'SystemManager/Subject/Literature';
import engComponent from 'SystemManager/Subject/English';
import addquesComponent from 'SystemManager/Main/Addques';
import ListquesComponent from 'SystemManager/subComponent/Listques'
//---------------------------------------------------------------
import {Login, SignUp, Home, AuthLoading, info, math, lite, eng, addques, listques} from 'SystemManager/Navigation/screenName';
//---------------------------------------------------------------
const AuthStack = createStackNavigator({ Login: loginComponent, SignUp: signupComponent}, { headerMode: 'none' });
const HomeStack = createStackNavigator({
    Home: homeComponent,
    math: MathComponent,
    lite: liteComponent,
    eng: engComponent
}, 
    { headerMode: 'none' });
const MathStack = createStackNavigator({
        listques: ListquesComponent,
        math: MathComponent,
    }, 
        { headerMode: 'none' });
let routeConfig = {
    Home: {
        screen: HomeStack,
        navigationOptions: {
            drawerLabel: 'Home',
            drawerIcon: 
            <Image source = {require('SystemManager/icons/icons8-home-100.png')}
            style = {{width:26, height: 26, tintColor:'#1E90FF'}}
            />
        }
    },
    info: infoAccComponent,
    addques: addquesComponent,
    listques: {
        screen: MathStack,
        navigationOptions: {
            drawerLabel: 'Danh sách câu hỏi toán',
            drawerIcon: 
            <Image source = {require('SystemManager/icons/icons8-list-64.png')}
            style = {{width:26, height: 26, tintColor:'#1E90FF'}}
            />
        }
    },
};
let drawerNavConfig = {
    unmountInactiveRoutes: true,
    //drawerWidth : screenWidth /2,
    drawerPosition: 'left',
    contentOptions: {
      activeTintColor: 'crimson'
    },
  };
const drawer = createDrawerNavigator( routeConfig, drawerNavConfig );
const SwithNav = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        Auth: AuthStack,
        App: drawer
    },
    {
        initialRouteName: AuthLoading
    }
);
export default Run = createAppContainer(SwithNav);