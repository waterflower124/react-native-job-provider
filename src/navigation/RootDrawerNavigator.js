
import React, { Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { defaultNavigationOptions } from "./options";
import { I18nManager } from 'react-native'
import { drawerOptions } from "./options";
import { SideMenu } from "../components";
import { createDrawerNavigator } from '@react-navigation/drawer';


import tabNavigation from "./TabNavigator";
import YourTasks from "./TasksTab";
import Messages from "./ChatTab";
import Notification from "./NotificationsTab";
import History from "./HistoryTab";
import EditEmployeeProfileTab from "./EditEmployeeProfileTab";

import {navigationRef, isReadyRef} from '../global/ReactNavigation';

import { vScale, hScale, } from "step-scale";

const { isRTL } = I18nManager;

const Drawer = createDrawerNavigator();

export default class rootDrawerNavigator extends Component {

    constructor(props) {
        super(props);
        
    }
  
    render() {
        return (
            <Drawer.Navigator drawerContent = {(props) => <SideMenu {...props} />} drawerPosition =  {isRTL ? "left" : "right"} drawerStyle = {{drawerBackgroundColor: "transparent", width: hScale(243.1),}}>
                <Drawer.Screen name = "NewTasks" component = {tabNavigation}/>
                <Drawer.Screen name = "YourTasks" component = {YourTasks}/>
                <Drawer.Screen name = "Home" component = {tabNavigation}/>
                <Drawer.Screen name = "Messages" component = {Messages}/>
                <Drawer.Screen name = "Notification" component = {Notification}/>
                <Drawer.Screen name = "History" component = {History}/>
                <Drawer.Screen name = "EditEmployeeProfileTab" component = {EditEmployeeProfileTab} options={{unmountOnBlur: true}}/>
            </Drawer.Navigator>
        );
    }
}

