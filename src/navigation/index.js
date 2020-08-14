import {
  createAppContainer,
  createDrawerNavigator,
  createSwitchNavigator
} from "react-navigation";
import {
  YourTasks,
  YourRequests,
  Notification,
  History,
  EditClientProfile,
  Messages,
  EditEmployeeProfile
} from "../screens";
import authNavigator from "./AuthNavigator";
import tabNavigation from "./TabNavigator";
import { drawerOptions } from "./options";
import { SideMenu } from "../components";

const rootNavigator = createDrawerNavigator(
  {
    NewTasks: {
      screen: tabNavigation
    },
    YourTasks: {
      screen: YourTasks
    },
    Home: {
      screen: tabNavigation
    },
    YourRequests: {
      screen: YourRequests
    },
    Messages: {
      screen: Messages
    },
    Notification: {
      screen: Notification
    },
    History: {
      screen: History
    },
    EditClientProfile: {
      screen: EditClientProfile
    },
    EditEmployeeProfile: {
      screen: EditEmployeeProfile
    }
  },
  {
    contentComponent: SideMenu,
    ...drawerOptions
  }
);

const switchNavigator = createSwitchNavigator({
  authNavigator: {
    screen: authNavigator
  },
  rootNavigator: {
    screen: rootNavigator
  }
});

export default createAppContainer(switchNavigator);
