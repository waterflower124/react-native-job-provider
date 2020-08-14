import React from "react";
import { createStackNavigator } from "react-navigation";
import {
  AddOffer,
  Notification,
  TaskDetails,
  Chat,
  History,
  Messages,
  EditEmployeeProfile,
  PaymentWebview,
  Transactions
} from "../screens";
import { defaultNavigationOptions, whiteHeaderOptions } from "./options";
import { BackButton } from "../components";
import { strings } from "../strings";

const NotificationsTab = createStackNavigator(
  {
    Notification: {
      screen: Notification
    },
    PaymentWebview,
    AddOffer: {
      screen: AddOffer
    },
    TaskDetails: {
      screen: TaskDetails
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
    },
    History: {
      screen: History
    },
    EditEmployeeProfile: {
      screen: EditEmployeeProfile
    },
    Transactions: {
      screen: Transactions
    }
  },
  {
    defaultNavigationOptions
  }
);
export default NotificationsTab;
