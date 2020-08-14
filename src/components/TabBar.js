import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Text
} from "react-native";
import { icons, fonts } from "../assets";
import { colors } from "../constants";
import { strings } from "../strings";
import { hScale, vScale, fScale, sWidth } from "step-scale";
import { SafeAreaView } from "react-navigation";
import { connect } from "step-react-redux";

class TabBarComponent extends Component {
  render() {
    const {
      mainContainer,
      background,
      textStyle,
      buttonStyle,
      buttonContainer,
      contentContainerStyle
    } = styles;
    const { navigation, user, onTabPress } = this.props;
    return (
      <SafeAreaView style={mainContainer}>
        <View style={background} />
        <FlatList
          data={tabs}
          horizontal
          extraData={this.props}
          contentContainerStyle={contentContainerStyle}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            const isActive = navigation.state.index == index;
            const { icon, screen, name, iconStyle } = item;
            const clientScreens = ["ServicesTab", "RequestTab", "MyProfileTab"];
            const employeeScreens = ["ClientsTab", "TasksTab", "ChatTab"];
            if (
              (clientScreens.includes(screen) &&
                user.data.type == "employee") ||
              (employeeScreens.includes(screen) && user.data.type == "client")
            ) {
              return;
            }

            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  onTabPress({ route: navigation.state.routes[index] });
                }}
                activeOpacity={1}
                style={buttonContainer}
              >
                <View style={buttonStyle}>
                  <Image
                    resizeMode={"contain"}
                    source={icon}
                    style={[
                      iconStyle,
                      isActive && { tintColor: colors.second }
                    ]}
                  />
                </View>
                <Text numberOfLines={1} style={textStyle}>
                  {name()}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    width: sWidth,
    height: hScale(82.6),
    position: "absolute",
    bottom: 0
  },
  background: {
    width: sWidth,
    height: vScale(61),
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.white
  },
  buttonStyle: {
    width: hScale(42.7),
    height: hScale(42.7),
    marginTop: vScale(10),
    marginBottom: vScale(6.1),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hScale(21.35),
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.22)",
    shadowOffset: {
      width: 0,
      height: vScale(3)
    },
    shadowRadius: hScale(5),
    shadowOpacity: 1,
    elevation: 10
  },
  textStyle: {
    fontSize: fScale(11),
    color: colors.mainText,
    fontFamily: fonts.arial
  },
  buttonContainer: {
    width: hScale(60),
    height: vScale(60),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: hScale(12)
  },
  contentContainerStyle: {
    width: sWidth,
    justifyContent: "center"
  }
});

const tabs = [
  {
    screen: "ServicesTab",
    name: () => strings.Services,
    icon: icons.service,
    iconStyle: {
      width: hScale(14.7),
      height: hScale(14.7)
    }
  },
  {
    screen: "ClientsTab",
    name: () => strings.clients,
    icon: icons.clientdrawer,
    iconStyle: {
      width: hScale(12),
      height: vScale(13.5)
    }
  },
  {
    screen: "TasksTab",
    name: () => strings.tasks,
    icon: icons.service,
    iconStyle: {
      width: hScale(15.1),
      height: hScale(15.1)
    }
  },
  {
    screen: "ChatTab",
    name: () => strings.chat,
    icon: icons.chatTabIcon,
    iconStyle: {
      width: hScale(15.6),
      height: hScale(15.6)
    }
  },
  {
    screen: "RequestTab",
    name: () => strings.requests,
    icon: icons.clientdrawer,
    iconStyle: {
      width: hScale(11.7),
      height: vScale(13.2)
    }
  },

  {
    screen: "MyProfileTab",
    name: () => strings.myprofile,
    icon: icons.myprofile,
    iconStyle: {
      width: hScale(12.2),
      height: hScale(12.2)
    }
  },
  {
    screen: "NotificationsTab",
    name: () => strings.notification,
    icon: icons.notify,
    iconStyle: {
      width: hScale(12.5),
      height: vScale(15.6)
    }
  }
];

export const TabBar = connect(TabBarComponent);
