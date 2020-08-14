import { createStackNavigator } from "react-navigation";
import {
  NewTasks,
  AddOffer,
  History,
  EditEmployeeProfile,
  Chat,
  Transactions
} from "../screens";
import { defaultNavigationOptions } from "./options";

const ClientsTab = createStackNavigator(
  {
    NewTasks: {
      screen: NewTasks
    },
    AddOffer: {
      screen: AddOffer
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
export default ClientsTab;
