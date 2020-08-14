import React from "react";
import { createStackNavigator } from "react-navigation";
import { YourRequests, RequestDetails, Messages, Chat } from "../screens";
import { defaultNavigationOptions,whiteHeaderOptions } from "./options";
import { BackButton } from "../components/";
import { strings } from "../strings";

const RequestTab = createStackNavigator(
  {
    YourRequests: {
      screen: YourRequests
    },
    RequestDetails: {
      screen: RequestDetails,
     
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
export default RequestTab;
