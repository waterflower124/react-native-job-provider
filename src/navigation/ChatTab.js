import React from "react";
import { createStackNavigator } from "react-navigation";
import { Chat, Messages, History, EditEmployeeProfile } from "../screens";
import {
  defaultNavigationOptions,
  whiteHeaderOptions,
} from "./options";
import { BackButton, DrawerIcon } from "../components";
import { strings } from "../strings";
import { colors } from "../constants";

const ChatTab = createStackNavigator(
  {
    Messages: {
      screen: Messages,
      navigationOptions: ({ navigation }) => ({
        ...whiteHeaderOptions,
        headerRight: (
          <DrawerIcon
            imageStyle={{ tintColor: colors.black }}
            onPress={() => navigation.openDrawer()}
          />
        ),
        headerLeft: (
          <BackButton
            backWithTitle
            onPress={() => navigation.goBack()}
            title={strings.conversions}
            hideBack
          />
        )
      })
    },
    Chat: {
      screen: Chat
    },
    History: {
      screen: History
    },
    EditEmployeeProfile: {
      screen: EditEmployeeProfile
    }
  },

  {
    defaultNavigationOptions
  }
);
export default ChatTab;
