import React, { Component } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {
  defaultNavigationOptions,
  whiteHeaderOptions,
} from "./options";
import { BackButton, DrawerIcon } from "../components";
import { strings } from "../strings";
import { colors } from "../constants";

import { Chat } from "../screens/Chat";
import { Messages } from "../screens/Messages";
import { History} from "../screens/History";
import { EditEmployeeProfile } from "../screens/EditEmployeeProfile";

const Stack = createStackNavigator();

export default class ChatTab extends Component {

  constructor(props) {
      super(props);

      
  }

  render() {
      return (
            <Stack.Navigator headerMode = "screen" initialRouteName = "Messages" screenOptions = {defaultNavigationOptions}>
                <Stack.Screen name = "Chat" component = {Chat} />
                <Stack.Screen name = "Messages" component = {Messages} />
                <Stack.Screen name = "History" component = {History}/>
                <Stack.Screen name = "EditEmployeeProfile" component = {EditEmployeeProfile} />
            </Stack.Navigator>
      );
  }
}

