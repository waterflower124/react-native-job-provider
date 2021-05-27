import React, { Component } from "react";
import { TabBar } from "../components";
import ClientsTab from "./ClientsTab";
import TasksTab from "./TasksTab";
import ChatTab from "./ChatTab";
import NotificationsTab from "./NotificationsTab";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default class tabNavigation extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            
        }
    }

    render() {
        const user = this.props.route.params && this.props.route.params.user;

        return (
            <Tab.Navigator tabBar = {(props) => <TabBar {...props}/>} initialRouteName = {"ClientsTab"}>
                <Tab.Screen name = "ClientsTab" component = {ClientsTab} 
                    options={({ route }) => ({
                        tabBarVisible: route.state && route.state.index > 0 ? false : true
                    })}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            routes[0].params.refreshTasks();
                        },
                    })}
                />
                <Tab.Screen name = "TasksTab" component = {TasksTab} 
                    options={({ route }) => ({
                        tabBarVisible: route.state && route.state.index > 0 ? false : true
                    })}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            // routes[0].params.refreshTasks();
                        },
                    })}
                />
                <Tab.Screen name = "ChatTab" component = {ChatTab} 
                    options={({ route }) => ({
                        tabBarVisible: route.state && route.state.index > 0 ? false : true
                    })}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            routes[0].params.refreshChatList();
                        },
                    })}
                />
                <Tab.Screen name = "NotificationsTab" component = {NotificationsTab} 
                    options={({ route }) => ({
                        tabBarVisible: route.state && route.state.index > 0 ? false : true
                    })}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            routes[0].params.refreshNotifications();
                        },
                    })}
                />
            </Tab.Navigator>
        );
    }
}

// const isTabBarVisible = (route) =>
//   route.state.index == 0;
