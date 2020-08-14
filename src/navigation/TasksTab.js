import { createStackNavigator } from "react-navigation";
import {
  YourTasks,
  TaskDetails,
  Chat,
  History,
  EditEmployeeProfile,
  Transactions
} from "../screens";
import { defaultNavigationOptions } from "./options";

const TasksTab = createStackNavigator(
  {
    YourTasks: {
      screen: YourTasks
    },
    TaskDetails: {
      screen: TaskDetails
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
export default TasksTab;
