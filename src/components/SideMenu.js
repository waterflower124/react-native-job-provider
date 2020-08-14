import React, { Component } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
  I18nManager
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { fScale, hScale, vScale, rcScale } from "step-scale";
import { icons, fonts } from "../assets";
import { colors } from "../constants";
import { strings } from "../strings";
import { connect } from "step-react-redux";
import { StepRequest } from "step-api-client";
import { actions, changeLangAlert } from "../helpers";

class SideMenuDrawer extends Component {
  state = { logoutLoading: false };
  async onPressLogout() {
    const { navigation } = this.props;
    this.setState({ logoutLoading: true });
    try {
      const data = await StepRequest("logout", "POST");
      console.warn(data);
      actions.removeUserData();
      this.setState({ logoutLoading: false });
      navigation.closeDrawer();
      navigation.navigate("Intro");
    } catch (error) {
      this.setState({ logoutLoading: false });
      console.warn(error.message);
    }
  }
  render() {
    const {
      mainContainer,
      textStyle,
      buttonStyle,
      avatarStyle,
      avatarContainer,
      userDetailsContainer,
      logoutTextStyle,
      IndicatorStyle,
      placeholderImageStyle
    } = styles;
    const { navigation, user } = this.props;
    const { logoutLoading } = this.state;
    const { isRTL } = I18nManager;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={mainContainer}>
          <FlatList
            data={data}
            extraData={this.props}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const { icon, screen, name, iconStyle } = item;
              const clientScreens = [
                "Home",
                "YourRequests",
                "EditClientProfile"
              ];
              const employeeScreens = [
                "NewTasks",
                "YourTasks",
                "History",
                "EditEmployeeProfile"
              ];
              const isEmployee =
                clientScreens.includes(screen) && user.data.type == "employee";
              const isClient =
                employeeScreens.includes(screen) && user.data.type == "client";
              const shouldReturn = isEmployee || isClient;
              if (shouldReturn) {
                return;
              }
              return (
                <TouchableOpacity
                  style={buttonStyle}
                  onPress={() => {
                    navigation.navigate(screen);
                    navigation.closeDrawer();
                  }}
                >
                  <Image
                    source={icon}
                    resizeMode={"contain"}
                    style={[iconStyle, { marginEnd: hScale(12) }]}
                  />
                  <Text style={[textStyle, { fontSize: fScale(16) }]}>
                    {name()}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListHeaderComponent={() => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (user.data.type == "employee") {
                      navigation.navigate("EditEmployeeProfile");
                    } else {
                      navigation.navigate("EditClientProfile");
                    }
                    navigation.closeDrawer();
                  }}
                  style={avatarContainer}
                >
                  <Image
                    style={avatarStyle}
                    resizeMode={"cover"}
                    source={
                      user.data.avatar
                        ? { uri: user.data.avatar }
                        : icons.userPlaceholder
                    }
                  />
                  <View style={userDetailsContainer}>
                    <Text
                      numberOfLines={1}
                      style={[textStyle, isRTL && { textAlign: "left" }]}
                    >
                      {user.data.name}
                    </Text>
                    <Text
                      style={[
                        textStyle,
                        { color: colors.phoneNumDrawer },
                        isRTL && { textAlign: "left" }
                      ]}
                    >
                      {user.data.mobile}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={() => {
              return (
                <View>
                  <TouchableOpacity
                  style={buttonStyle}
                  onPress={() => {
                    Linking.openURL(socialURL.twitter)
                    navigation.closeDrawer();
                  }}
                >
                  <Image
                    source={icons.twitter}
                    resizeMode={"contain"}
                    style={{ width: hScale(20), marginEnd: hScale(12) }}
                  />
                  <Text style={[textStyle, { fontSize: fScale(16) }]}>
                    {strings.twitter}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={buttonStyle}
                  onPress={() => {
                    Linking.openURL(socialURL.whatsapp)
                    navigation.closeDrawer();
                  }}
                >
                  <Image
                    source={icons.whatsapp}
                    resizeMode={"contain"}
                    style={{ width: hScale(20), marginEnd: hScale(12) }}
                  />
                  <Text style={[textStyle, { fontSize: fScale(16) }]}>
                  {strings.whatsapp}
                  </Text>
                </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => changeLangAlert(strings.changeLang)}
                    style={[buttonStyle, { paddingStart: hScale(53.9) }]}
                  >
                    <Text style={[textStyle, { fontSize: fScale(16) }]}>
                      {strings.changeLangIntro}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.onPressLogout()}
                    style={[buttonStyle]}
                  >
                    <View style={{ width: hScale(32.5) }}>
                      {logoutLoading && (
                        <ActivityIndicator style={IndicatorStyle} />
                      )}
                    </View>
                    <Text style={logoutTextStyle}>{strings.logout}</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(79),
    shadowOpacity: 1,
    elevation: 10
  },
  avatarContainer: {
    width: hScale(243.1),
    flexDirection: "row",
    marginTop: vScale(25.8),
    marginBottom: vScale(32.8),
    paddingHorizontal: hScale(15.4)
  },
  avatarStyle: {
    width: hScale(58.9),
    height: hScale(58.9),
    borderRadius: hScale(29.45),
    marginEnd: hScale(17.4)
  },
  userDetailsContainer: {
    height: vScale(58.9),
    justifyContent: "center",
    flex: 1
  },

  buttonStyle: {
    flexDirection: "row",
    alignItems: "center",
    width: hScale(243.1),
    paddingStart: hScale(21.4),
    height: hScale(45)
  },
  textStyle: {
    fontSize: fScale(14),
    color: colors.mainText,
    fontFamily: fonts.arial
  },
  iconStyle: {
    width: hScale(22.5),
    height: hScale(22.5),
    marginStart: hScale(4.6)
  },
  logoutTextStyle: {
    fontSize: fScale(16),
    color: colors.logout,
    fontFamily: fonts.arial
  },
  placeholderImageStyle: {
    width: hScale(22.2),
    height: hScale(22.2)
  },
  modalStyle: {
    backgroundColor: "rgba(0,0,0, 0.20)",
    height: null,
    width: null,
    borderRadius: 0
  },
  IndicatorStyle: { width: hScale(13.9), height: hScale(13.9) }
});

const data = [
  {
    screen: "NewTasks",
    name: () => strings.clients,
    icon: icons.clientdrawer,
    iconStyle: { width: hScale(13.9), height: vScale(15.7) }
  },
  {
    screen: "YourTasks",
    name: () => strings.tasks,
    icon: icons.service,
    iconStyle: { width: hScale(17.5), height: hScale(17.5) }
  },
  {
    screen: "Home",
    name: () => strings.Services,
    icon: icons.service,
    iconStyle: { width: hScale(17.5), height: hScale(17.5) }
  },
  {
    screen: "YourRequests",
    name: () => strings.requests,
    icon: icons.clientdrawer,
    iconStyle: { width: hScale(13.9), height: vScale(15.7) }
  },
  {
    screen: "Messages",
    name: () => strings.chat,
    icon: icons.chat,
    iconStyle: { width: hScale(18.1), height: vScale(14.5) }
  },
  {
    screen: "Notification",
    name: () => strings.notification,
    icon: icons.notify,
    iconStyle: { width: hScale(14.5), height: vScale(18.1) }
  },
  {
    screen: "History",
    name: () => strings.history,
    icon: icons.calendar,
    iconStyle: { width: hScale(16.9), height: vScale(18.7) }
  },
  {
    screen: "EditClientProfile",
    name: () => strings.myprofile,
    icon: icons.myprofile,
    iconStyle: { width: hScale(14.5), height: hScale(14.5) }
  },
  {
    screen: "EditEmployeeProfile",
    name: () => strings.myprofile,
    icon: icons.myprofile,
    iconStyle: { width: hScale(14.5), height: hScale(14.5) }
  }
];

const socialURL = {
  twitter: "https://twitter.com/HomeJobSA",
  whatsapp: "https://wa.me/966501755873"
}

export const SideMenu = connect(SideMenuDrawer);
