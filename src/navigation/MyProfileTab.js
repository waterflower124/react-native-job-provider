import React from "react";
import { createStackNavigator } from "react-navigation";
import { EditClientProfile, Messages, Chat } from "../screens";
import { defaultNavigationOptions, whiteHeaderOptions } from './options'
import { BackButton } from "../components";
import { strings } from "../strings";

const MyProfileTab = createStackNavigator(
  {
    EditClientProfile: {
      screen: EditClientProfile
    },
    Messages: {
      screen: Messages,
      navigationOptions: ({ navigation }) => ({
        ...whiteHeaderOptions,
        headerLeft: (
          <BackButton
            backWithTitle
            onPress={() => navigation.goBack()}
            title={strings.conversions}
          />
        )
      })
    },
    Chat: {
      screen: Chat
    }
  },
  {
    defaultNavigationOptions
  }
);
export default MyProfileTab;
