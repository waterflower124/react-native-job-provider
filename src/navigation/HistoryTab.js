import React, { Component } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {
  defaultNavigationOptions,
  whiteHeaderOptions,
} from "./options";
import { BackButton, DrawerIcon } from "../components";
import { strings } from "../strings";
import { colors } from "../constants";

import { History } from "../screens/History";

const Stack = createStackNavigator();

export default class HistoryTab extends Component {

  constructor(props) {
      super(props);
      
  }

  render() {
      return (
            <Stack.Navigator headerMode = "screen" initialRouteName = "History">
                <Stack.Screen name = "History" component = {History} options = {defaultNavigationOptions}/>
                
            </Stack.Navigator>
      );
  }
}

