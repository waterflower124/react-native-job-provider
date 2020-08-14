import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView
} from "react-native";
import { isEmpty, isEmail } from "step-validators";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { BackButton, Button, Container, TextField } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { ScrollView } from "react-native-gesture-handler";
import { ImagePicker, convertNumbers2English } from "../helpers";

export class SignUp extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });
  state = {
    validateLoading: false,
    error: "",
    mobile: "",
    name: "",
    email: "",
    image: null,
    avatar: null
  };
  validateInputs(
    isEmptyPhone,
    isEmptyName,
    isEmptyMail,
    NameError,
    phoneError,
    MailError
  ) {
    const { avatar, name, email, mobile } = this.state;
    let error = "";
    if ((isEmptyPhone, phoneError)) {
      error = "phone";
    } else if ((isEmptyName, NameError)) {
      error = "name";
    } else if ((isEmptyMail, MailError)) {
      error = "email";
    }
    if (error == "") {
      this.props.navigation.navigate("VerifyPhone", {
        userData: {
          avatar,
          name,
          email,
          mobile
        }
      });
    } else {
      this.setState({ error });
    }
  }
  async uploadPhotoPress() {
    const { imageObject, imageSource } = await ImagePicker({
      width: 100,
      height: 100,
      multiple: false,
      compressImageQuality: 0.2
    });
    this.setState({
      image: imageSource,
      avatar: imageObject
    });
  }

  render() {
    const {
      container,
      containerStyle,
      signUpButtonStyle,
      welcomeBackStyle,
      signinToStyle,
      inputStyle,
      buttonContainer,
      youHaveAnAccountContainer,
      youHaveAccountStyle,
      phoneIconStyle,
      passwordIconStyle,
      uploadButtonStyle,
      uploadStyle,
      uploadImageContainer,
      uploadTextStyle,
      imageContainer,
      placeholderImageStyle,
      avatarStyle,
      buttonStyle,
      errorContainer,
      errorMessageStyle
    } = styles;
    const { navigation } = this.props;
    const { validateLoading, error, mobile, name, email, image } = this.state;
    const isEmptyPhone = mobile.length == 0;
    const isEmptyName = name.length == 0;
    const isEmptyMail = isEmpty(email);
    const isPhoneError = error === "phone";
    const isNameError = error === "name";
    const isMailError = error === "email";
    const isAvatarError = error == "avatar";
    const phoneError =
      isNaN(mobile) || mobile.length != 10 || !mobile.startsWith(0);
    const showPhoneError = mobile.length > 0 || isPhoneError;
    const NameError = name.length < 3;
    const MailError = !isEmail(email);
    const showNameErrorStatus = name.length > 0 || isNameError;
    const showMailErrorStatus = email.length > 0 || isMailError;
    return (
      <Container transparentImage style={container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView behavior={"position"}>
            <Text style={welcomeBackStyle}>{strings.welcome}</Text>
            <Text style={signinToStyle}>{strings.signUpToContinue}</Text>
            <View style={uploadImageContainer}>
              <View style={imageContainer}>
                <Image
                  resizeMode={"contain"}
                  source={image || icons.placeholderImage}
                  style={image ? avatarStyle : placeholderImageStyle}
                />
              </View>
              <TouchableOpacity
                style={uploadButtonStyle}
                onPress={() => this.uploadPhotoPress()}
              >
                <Image
                  source={icons.upload}
                  resizeMode={"contain"}
                  style={uploadStyle}
                />
                <Text style={uploadTextStyle}>{strings.upload}</Text>
              </TouchableOpacity>
            </View>
            <View style={errorContainer}>
              <Text style={errorMessageStyle}>
                {isAvatarError ? strings.choosePhoto : ""}
              </Text>
            </View>

            <TextField
              onChangeText={mobile =>
                this.setState({ mobile: convertNumbers2English(mobile) })
              }
              value={mobile}
              errorMessage={
                phoneError && showPhoneError && strings.invalidPhone
              }
              label={strings.yourPhone}
              authInputs
              showCountryCode
              rightIcon={icons.smartphone}
              rightIconstyle={phoneIconStyle}
              customMainContainer={containerStyle}
              inputStyle={inputStyle}
              customTextStyle={{ color: colors.mainText }}
            />
            <TextField
              onChangeText={name => this.setState({ name })}
              value={name}
              label={strings.yourname}
              authInputs
              rightIcon={icons.userIcon}
              rightIconStyle={passwordIconStyle}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
              errorMessage={
                NameError && showNameErrorStatus && strings.invalidName
              }
            />
            <TextField
              onChangeText={email => this.setState({ email })}
              value={email}
              label={strings.yourmail}
              authInputs
              rightIcon={icons.chatHead}
              rightIconStyle={passwordIconStyle}
              customMainContainer={containerStyle}
              inputStyle={[inputStyle, { marginStart: 0 }]}
              errorMessage={
                MailError && showMailErrorStatus && strings.invalidMail
              }
            />
            <Button
              loading={validateLoading}
              style={buttonStyle}
              title={strings.signUp}
              icon
              onPress={() =>
                this.validateInputs(
                  isEmptyPhone,
                  isEmptyName,
                  isEmptyMail,
                  phoneError,
                  NameError,
                  MailError
                )
              }
            />

            <View style={youHaveAnAccountContainer}>
              <Text style={youHaveAccountStyle}>
                {strings.youHaveAnAccount}
              </Text>
              <TouchableOpacity
                style={signUpButtonStyle}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={[youHaveAccountStyle, { color: colors.first }]}>
                  {strings.login}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(112.3)
  },
  containerStyle: {
    marginStart: hScale(15.1),
    paddingHorizontal: 0
  },
  signUpButtonStyle: {
    width: hScale(80),
    justifyContent: "center"
  },
  welcomeBackStyle: {
    fontSize: fScale(19),
    color: colors.welcomeTextColor,
    alignSelf: "flex-start",
    paddingStart: hScale(15.1),
    marginBottom: vScale(8.6),
    fontFamily: fonts.arial
  },
  signinToStyle: {
    fontSize: fScale(14),
    color: colors.signInTo,
    marginTop: vScale(8.5),
    alignSelf: "flex-start",
    paddingStart: hScale(15.1),
    marginBottom: vScale(30),
    fontFamily: fonts.arial
  },
  inputStyle: {
    fontSize: fScale(14)
  },
  buttonStyle: {
    marginStart: hScale(15.1),
    marginTop: vScale(33.8)
  },
  youHaveAnAccountContainer: {
    flexDirection: "row",
    marginTop: vScale(20.9),
    marginBottom: vScale(40),
    alignSelf: "center"
  },
  youHaveAccountStyle: {
    fontSize: fScale(14),
    color: colors.signInTo,
    fontFamily: fonts.arial
  },
  phoneIconStyle: {
    width: hScale(13),
    height: vScale(17.3),
    marginStart: hScale(5)
  },
  passwordIconStyle: {
    width: hScale(14.5),
    height: vScale(16.6),
    tintColor: colors.inputInActive,
    marginStart: hScale(5)
  },
  uploadImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginStart: hScale(15),
    marginBottom: vScale(21.1),
    marginTop: vScale(16)
  },
  imageContainer: {
    width: hScale(65.6),
    height: vScale(58.1),
    borderRadius: hScale(5),
    marginEnd: hScale(15.6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.21)",
    shadowOffset: {
      width: 0,
      height: vScale(1)
    },
    shadowRadius: hScale(4),
    shadowOpacity: 1,
    elevation: 10
  },
  placeholderImageStyle: {
    width: hScale(22.5),
    height: hScale(22.5)
  },
  uploadButtonStyle: {
    width: hScale(60.5),
    height: vScale(24.3),
    borderRadius: hScale(5),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.21)",
    shadowOffset: {
      width: 0,
      height: vScale(1)
    },
    shadowRadius: hScale(4),
    shadowOpacity: 1,
    elevation: 10
  },
  uploadStyle: {
    width: hScale(12.1),
    height: hScale(12.1),
    marginEnd: hScale(4.2)
  },
  uploadTextStyle: {
    color: colors.mainText,
    fontSize: fScale(9),
    fontFamily: fonts.arial
  },
  avatarStyle: {
    width: hScale(60),
    height: vScale(50)
  },
  errorMessageStyle: {
    alignSelf: "stretch",
    textAlign: "center",
    fontSize: fScale(10),
    color: "red",
    fontFamily: fonts.arial
  },
  errorContainer: {
    height: vScale(15),
    marginTop: vScale(5)
  }
});
