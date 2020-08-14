import { createBottomTabNavigator } from "react-navigation";
import { TabBar } from "../components";
import ClientsTab from "./ClientsTab";
import TasksTab from "./TasksTab";
import ChatTab from "./ChatTab";
import NotificationsTab from "./NotificationsTab";
import ServicesTab from "./ServicesTab";
import RequestTab from "./RequestTab";
import MyProfileTab from "./MyProfileTab";

const tabNavigation = createBottomTabNavigator(
  {
    ServicesTab: {
      screen: ServicesTab,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: isTabBarVisible(navigation)
      })
    },
    ClientsTab: {
      screen: ClientsTab,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: isTabBarVisible(navigation),
        tabBarOnPress({ navigation, defaultHandler }) {
          navigation.state.routes[0].params.refreshTasks();
          defaultHandler();
        }
      })
    },
    TasksTab: {
      screen: TasksTab,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: isTabBarVisible(navigation),
        tabBarOnPress({ navigation, defaultHandler }) {
          try {
            navigation.state.routes[0].params.refreshTasks();
          } catch (error) {}
          defaultHandler();
        }
      })
    },
    ChatTab: {
      screen: ChatTab,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: isTabBarVisible(navigation),
        tabBarOnPress({ navigation, defaultHandler }) {
          try {
            navigation.state.routes[0].params.refreshChatList();
          } catch (error) {}
          defaultHandler();
        }
      })
    },
    RequestTab: {
      screen: RequestTab,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: isTabBarVisible(navigation),
        tabBarOnPress({ navigation, defaultHandler }) {
          try {
            navigation.state.routes[0].params.refreshRequests();
          } catch (error) {}
          defaultHandler();
        }
      })
    },
    MyProfileTab: {
      screen: MyProfileTab,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: isTabBarVisible(navigation),
        tabBarOnPress({ navigation, defaultHandler }) {
          try {
            navigation.state.routes[0].params.refreshOrders();
          } catch (error) {}
          defaultHandler();
        }
      })
    },
    NotificationsTab: {
      screen: NotificationsTab,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: isTabBarVisible(navigation),
        tabBarOnPress({ navigation, defaultHandler }) {
          try {
            navigation.state.routes[0].params.refreshNotifications();
          } catch (error) {}
          defaultHandler();
        }
      })
    }
  },
  {
    tabBarComponent: TabBar
  }
);

export default tabNavigation;

const isTabBarVisible = (navigation, depth = 1) =>
  navigation.state.routes.length <= depth;
