import React from "react";
import { createStackNavigator } from "react-navigation";
import { Home, NewRequest, Chat, Messages } from "../screens";
import { defaultNavigationOptions,whiteHeaderOptions } from "./options";
import { BackButton } from "../components/";
import { strings } from "../strings";

const ServicesTab = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    NewRequest: {
      screen: NewRequest
    },
    Chat: {
      screen: Chat
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
    }
  },
  {
    defaultNavigationOptions
  }
);
export default ServicesTab;
