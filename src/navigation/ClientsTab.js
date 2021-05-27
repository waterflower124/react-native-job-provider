import React, { Component } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { defaultNavigationOptions } from "./options";

import { NewTasks } from "../screens/NewTasks";
import { AddOffer } from "../screens/AddOffer";
import { History} from "../screens/History";
import { EditEmployeeProfile } from "../screens/EditEmployeeProfile";
import { Chat } from "../screens/Chat";
import { Transactions } from "../screens/Transactions";

const Stack = createStackNavigator();

export default class ClientTab extends Component {

    constructor(props) {
        super(props);
        
    }

    render() {
      return (
            <Stack.Navigator headerMode = "screen" initialRouteName = "NewTasks" screenOptions = {defaultNavigationOptions}>
                <Stack.Screen name = "NewTasks" component = {NewTasks} />
                <Stack.Screen name = "AddOffer" component = {AddOffer} />
                <Stack.Screen name = "History" component = {History} />
                <Stack.Screen name = "EditEmployeeProfile" component = {EditEmployeeProfile} />
                <Stack.Screen name = "Chat" component = {Chat} />
                <Stack.Screen name = "Transactions" component = {Transactions} />
            </Stack.Navigator>
        );
    }
}

