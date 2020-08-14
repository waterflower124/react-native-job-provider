import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { fScale, hScale, vScale, sWidth } from "step-scale";
import { images, fonts } from "../assets";
import { BackButton, Button } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";

export class SignUpSelection extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });
  render() {
    const {
      introTextStyle,
      loginImageStyle,
      buttonStyle,
      titleStyle,
      registerContainer,
      registerTextStyle,
      fullImageStyle
    } = styles;
    const { navigation } = this.props;
    return (
      <ImageBackground
        resizeMode={"cover"}
        source={images.mainImage}
        style={fullImageStyle}
      >
        <Image
          source={images.loginImage}
          resizeMode={"contain"}
          style={loginImageStyle}
        />
        <Text style={introTextStyle}>{strings.introText}</Text>
        <Button
          title={strings.iamClient}
          style={buttonStyle}
          titleStyle={titleStyle}
          onPress={() => navigation.navigate("SignUp")}
          hideIcon
        />
        <TouchableOpacity
          style={registerContainer}
          onPress={() => navigation.navigate("EmployeeSignUp")}
        >
          <Text style={registerTextStyle}>{strings.iamEmployee}</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  loginImageStyle: {
    width: hScale(116),
    height: vScale(119),
    marginTop: vScale(150),
    marginBottom: vScale(48)
  },
  introTextStyle: {
    width: hScale(262),
    fontSize: fScale(22),
    fontFamily: fonts.arial,
    lineHeight: vScale(29),
    marginBottom: vScale(100),
    textAlign: "center",
    color: colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.13)",
    textShadowOffset: {
      width: 0,
      height: vScale(3)
    },
    textShadowRadius: 0
  },
  buttonsContainer: {
    marginTop: vScale(80),
    alignItems: "center"
  },
  buttonStyle: {
    width: hScale(297.5),
    height: vScale(43.2),
    marginBottom: vScale(28.2)
  },
  registerContainer: {
    width: hScale(297.5),
    height: vScale(43.2),
    alignItems: "center",
    justifyContent: "center"
  },
  titleStyle: {
    textAlign: "center",
    fontSize: fScale(17),
    fontFamily: fonts.arial
  },
  registerTextStyle: {
    fontSize: fScale(17),
    color: colors.white,
    fontFamily: fonts.arial
  },
  fullImageStyle: {
    flex: 1,
    width: sWidth,
    alignItems: "center"
  }
});
