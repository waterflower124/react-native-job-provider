import React, { Component } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {
  defaultNavigationOptions,
  whiteHeaderOptions,
} from "./options";
import { BackButton, DrawerIcon } from "../components";
import { strings } from "../strings";
import { colors } from "../constants";

import { EditEmployeeProfile } from "../screens/EditEmployeeProfile";

const Stack = createStackNavigator();

export default class EditEmployeeProfileTab extends Component {

  constructor(props) {
      super(props);
      
  }

  render() {
      return (
            <Stack.Navigator headerMode = "screen" initialRouteName = "EditEmployeeProfile">
                <Stack.Screen name = "EditEmployeeProfile" component = {EditEmployeeProfile} options = {defaultNavigationOptions} prop_navigation = {this.props.navigation}/>
            </Stack.Navigator>
      );
  }
}

