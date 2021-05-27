import React, { Component } from "react";
import { createStackNavigator } from '@react-navigation/stack';

import { defaultNavigationOptions } from "./options";

import { YourTasks } from "../screens/YourTasks";
import { TaskDetails } from "../screens/TaskDetails";
import { Chat } from "../screens/Chat";
import { History} from "../screens/History";
import { EditEmployeeProfile } from "../screens/EditEmployeeProfile";
import { Transactions } from "../screens/Transactions";

const Stack = createStackNavigator();

export default class TasksTab extends Component {

  constructor(props) {
      super(props);
      
  }

  render() {
      return (
            <Stack.Navigator headerMode = "screen" initialRouteName = "YourTasks">
                <Stack.Screen name = "YourTasks" component = {YourTasks} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "TaskDetails" component = {TaskDetails} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "Chat" component = {Chat} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "History" component = {History} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "EditEmployeeProfile" component = {EditEmployeeProfile} options = {defaultNavigationOptions}/>
                <Stack.Screen name = "Transactions" component = {Transactions} options = {defaultNavigationOptions}/>
            </Stack.Navigator>
      );
  }
}
