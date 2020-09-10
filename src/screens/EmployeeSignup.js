import React, { Component } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  I18nManager,
  AsyncStorage,
  Alert,
  Platform
} from "react-native";
import { isEmpty, isEmail } from "step-validators";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { fScale, hScale, sWidth, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { BackButton, Button, Container, TextField } from "../components";
import { ModalButton } from "../components/ModalButton";
import { colors } from "../constants";
import { strings } from "../strings";
import {
  ImagePicker,
  getUserLocation,
  convertNumbers2English,
  GoogleMapiAPIKey
} from "../helpers";
import { connect } from "step-react-redux";

class EmployeeSignUpScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });
  state = {
    first_name: "",
    last_name: "",
    email: "",
    image: null,
    avatar: null,
    modalVisible: false,
    // location: null,
    mobile: "",
    commercial: "",
    bankAccount: "",
    password: "",
    confirmPassword: "",
    error: "",
    selectedCity: {},
    selectedRange: {},
    selectedService: [],
    selectedBank: {},
    chooseCity: false,
    chooseRange: false,
    chooseService: false,
    chooseBank: false,
    cityModalVisible: false,
    rangeModalVisible: false,
    serviceModalVisible: false,
    bankModalVisible: false,
    submittedCity: "",
    submittedRange: "",
    submittedService: [],
    submittedBank: "",

    selected_city: "",
    location: "",
    temp_latitude: 0.0,
    temp_longitude: 0.0,
  };
  async uploadPhotoPress() {
    const { imageObject, imageSource } = await ImagePicker({
      width: 100,
      height: 100,
      multiple: false,
      compressImageQuality: 0.2
    });
    this.setState({
      image: imageSource,
      avatar: imageObject,
      error: ""
    });
  }

  validateSelection(
    bankError,
    isEmptyBank,
    commericalError,
    isEmptyCommerical,
    isEmptyFirstName,
    isEmptyLastName,
    isEmptyPhone,
    isEmptyMail,
    firstNameError,
    lastNameError,
    phoneError,
    MailError,
    isEmptyPassword,
    isEmptyConfirmPassword,
    passwordError,
    confirmPasswordError
  ) {
    const {
      submittedCity,
      selected_city,
      submittedRange,
      submittedService,
      submittedBank,
      location
    } = this.state;
    if (selected_city == "") {
      this.setState({ chooseCity: true });
    } else if (location == "") {
      this.setState({ error: "location" });
    } else if (submittedRange == "") {
      this.setState({ chooseRange: true });
    } else if (submittedService.length == 0) {
      this.setState({ chooseService: true });
    } else if (submittedBank == "") {
      this.setState({ chooseBank: true });
    } else {
      this.validateInputs(
        bankError,
        isEmptyBank,
        commericalError,
        isEmptyCommerical,
        isEmptyFirstName,
        isEmptyLastName,
        isEmptyPhone,
        isEmptyMail,
        firstNameError,
        lastNameError,
        phoneError,
        MailError,
        isEmptyPassword,
        isEmptyConfirmPassword,
        passwordError,
        confirmPasswordError
      );
    }
  }

  validateInputs({
    bankError,
    isEmptyBank,
    commericalError,
    isEmptyCommerical,
    isEmptyFirstName,
    isEmptyLastName,
    isEmptyPhone,
    isEmptyMail,
    firstNameError,
    lastNameError,
    phoneError,
    MailError,
    isEmptyPassword,
    isEmptyConfirmPassword,
    passwordError,
    confirmPasswordError
  }) {
    let error = "";
    const {
      selectedCity,
      selectedBank,
      selectedRange,
      selectedService,
      bankAccount,
      commercial,
      password,
      mobile,
      first_name,
      last_name,
      email,
      location,
      avatar,
      selected_city,
      temp_latitude,
      temp_longitude,
    } = this.state;
    if ((isEmptyBank, bankError)) {
      error = "bank";
    } else if ((isEmptyFirstName, firstNameError)) {
      error = "name";
    } else if ((isEmptyLastName, lastNameError)) {
      error = "name";
    } else if ((isEmptyPhone, phoneError)) {
      error = "phone";
    } else if ((isEmptyMail, MailError)) {
      error = "email";
    } else if ((isEmptyPassword, passwordError)) {
      error = "password";
    } else if ((isEmptyConfirmPassword, confirmPasswordError)) {
      error = "confirmPassword";
    }

    if (error == "") {
      const userData = {
        isEmployee: true,
        location,
        range_id: selectedRange.id,
        category_id: selectedService.map(e => e.id),
        bank_id: selectedBank.id,
        bank_no: bankAccount,
        commercial,
        mobile,
        email,
        password,
        first_name,
        last_name,
        selected_city,
        temp_latitude,
        temp_longitude,
      };
      if (avatar != null) {
        userData.avatar == avatar;
      }
      this.props.navigation.navigate("VerifyPhone", {
        userData
      });
      console.warn("userData", userData);
    } else {
      this.setState({ error });
    }
  }

  
  getCurrentAddress = async() => {
    this.setState({
        screenLoading: true
    })
    var parameter = "";
    let languageCode = await AsyncStorage.getItem('languageCode')
    if (languageCode == "en") {
      parameter = "latlng=" + this.state.temp_latitude + "," + this.state.temp_longitude + "&key=" + GoogleMapiAPIKey;
    } else {
      parameter = "latlng=" + this.state.temp_latitude + "," + this.state.temp_longitude + "&language=ar&key=" + GoogleMapiAPIKey;
    }
    
    await fetch("https://maps.googleapis.com/maps/api/geocode/json?" + parameter, {
        method: "GET",
    })
    .then(response => {
        return response.json();
    })
    .then(responseData => {
        console.log(JSON.stringify(responseData));
        if(responseData.status != "OK") {
            Alert.alert("Warning!", "Error occurred in getting address. Please try again.")
        } else {
            if(responseData.results.length > 0) {
                this.setState({
                    location: responseData.results[0].formatted_address,
                })
                for(i = 0; i < responseData.results[0].address_components.length; i ++) {
                    for(j = 0; j < responseData.results[0].address_components[i].types.length; j ++) {
                        if(responseData.results[0].address_components[i].types[j] == "locality") {
                            this.setState({
                                selected_city: responseData.results[0].address_components[i].short_name
                            })
                            break;
                        }
                    }
                }
            }
        }
        this.setState({ modalVisible: false })
    })
    .catch(error => {
        console.log(error)
    });

    this.setState({
        screenLoading: false
    })
  }


  render() {
    const {
      container,
      welcomeTextStyle,
      enterInfoStyle,
      borderSeparator,
      locationButton,
      textStyle,
      mapButtonStyle,
      linearStyle,
      errorContainerCustom,
      backButtonCustom,
      customMainContainer,
      locStyle,
      locationContainer,
      uploadButtonStyle,
      uploadStyle,
      uploadImageContainer,
      uploadTextStyle,
      imageContainer,
      placeholderImageStyle,
      titleStyle,
      avatarStyle,
      errorContainer,
      errorMessageStyle
    } = styles;
    
    const {
      modalVisible,
      location,
      mobile,
      commercial,
      bankAccount,
      password,
      confirmPassword,
      error,
      selectedCity,
      selectedRange,
      selectedService,
      selectedBank,
      chooseCity,
      chooseRange,
      chooseService,
      chooseBank,
      cityModalVisible,
      rangeModalVisible,
      serviceModalVisible,
      bankModalVisible,
      submittedCity,
      submittedRange,
      submittedService,
      submittedBank,
      image,
      email,
      first_name,
      last_name,
      selected_city
    } = this.state;

    const { categories, cities, banks } = this.props;
    const isLocationError = error == "location";
    const notSelectedCity = submittedCity == "";
    const notSelectedRange = submittedRange == "";
    const notSelectedService = submittedService.length == 0;
    const notSelectedBank = submittedBank == "";
    const isFirstNameError = error === "name";
    const isLastNameError = error === "name";
    const isMailError = error === "email";
    const isPasswordError = error === "password";
    const isConfirmPasswordError = error === "confirmPassword";
    const isBankAccountError = error === "bank";
    const isCommericalRegisterError = error === "commerical";
    const isAvatarError = error == "avatar";
    const isPhoneError = error === "phone";
    const isEmptyBank = bankAccount.length == 0;
    const isEmptyMail = isEmpty(email);
    const isEmptyCommerical = commercial.length == 0;
    const isEmptyPhone = mobile.length == 0;
    const isEmptyPassword = password.length == 0;
    const isEmptyConfirmPassword = confirmPassword.length == 0;
    const bankError =  bankAccount.length != 24 || !bankAccount.startsWith("SA");
    const showBankError = bankAccount.length > 0 || isBankAccountError;
    const commericalError = isNaN(commercial) || commercial.length < 4;
    const showcommercialError =
      commercial.length > 0 || isCommericalRegisterError;
    const isEmptyFirstName = first_name.length == 0;
    const isEmptyLastName = last_name.length == 0;
    const firstNameError = first_name.length < 3;
    const lastNameError = last_name.length < 3;
    const MailError = !isEmail(email);
    const showFirstNameErrorStatus = first_name.length > 0 || isFirstNameError;
    const showLastNameErrorStatus = last_name.length > 0 || isLastNameError;
    const showMailErrorStatus = email.length > 0 || isMailError;
    const passwordError = password.length < 6;
    const showPasswordErrorStatus = password.length > 0 || isPasswordError;
    const confirmPasswordError =
      confirmPassword.length < 6 || confirmPassword != password;
    const showConfirmPasswordErrorStatus =
      confirmPassword.length > 0 || isConfirmPasswordError;
    const phoneError =
      isNaN(mobile) || mobile.length != 10 || !mobile.startsWith(0);
    const showPhoneError = mobile.length > 0 || isPhoneError;
    const { isRTL } = I18nManager;
    return (
      <Container transparentImage style={container}>
        <Modal animationType="fade" transparent={false} visible={modalVisible}>
          <MapView
            provider = {PROVIDER_GOOGLE}
            ref={ref => (this.myMapView = ref)}
            showsUserLocation
            showsMyLocationButton
            style={{ flex: 1, width: sWidth }}
            initialRegion={{
              longitude: 45,
              latitude: 25,
              latitudeDelta: 20,
              longitudeDelta: 20
            }}
            onMapReady={() => {
              getUserLocation(
                position => {
                  const { latitude, longitude } = position.coords;
                  this.myMapView.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                  });
                  // todo: GeoCoding coords
                  this.setState({
                    // location: { latitude, longitude },
                    error: ""
                  });
                },
                error => { }
              );
            }}
            onRegionChangeComplete={region => {
              const { latitude, longitude } = region;
              // this.setState({ location: { latitude, longitude } });
              this.setState({
                temp_latitude: latitude,
                temp_longitude: longitude
              })
            }}
          >
            <Marker
              pinColor={colors.second}
              coordinate={{latitude: this.state.temp_latitude, longitude: this.state.temp_longitude} || { longitude: 45, latitude: 25 }}
            />
          </MapView>
          <BackButton
            onPress={() => this.setState({ modalVisible: false })}
            customContainer={backButtonCustom}
          />
          <Button
            title={strings.continue}
            style={mapButtonStyle}
            linearCustomStyle={linearStyle}
            errorContainerCustom={errorContainerCustom}
            titleStyle={titleStyle}
            onPress={() => this.getCurrentAddress()}
          />
        </Modal>
        <ScrollView style = {{flex: 1}} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            style = {{flex: 1}}
            behavior={(Platform.OS === 'ios') ? "padding" : null}
            keyboardVerticalOffset={100}
            // enabled
          >
            <Text style={welcomeTextStyle}>{strings.welcome}</Text>
            <Text style={enterInfoStyle}>{strings.enterInfo}</Text>
            <View style={uploadImageContainer}>
              <View style={imageContainer}>
                <Image
                  resizeMode={"contain"}
                  source={image ? image : icons.placeholderImage}
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
            {/* <ModalButton
              title={strings.city}
              data={cities}
              errorMessage={notSelectedCity && chooseCity && strings.chooseCity}
              onSelect={item => this.setState({ selectedCity: item })}
              onCloseModal={() => this.setState({ cityModalVisible: false })}
              onPressSave={() =>
                this.setState({
                  cityModalVisible: false,
                  submittedCity: selectedCity
                })
              }
              onPress={() => this.setState({ cityModalVisible: true })}
              modalVisible={cityModalVisible}
              selectedItem={selectedCity}
              submittedItem={submittedCity}
            /> */}
            <TouchableOpacity
              style={locationButton}
              onPress={() => this.setState({ modalVisible: true })}
            >
              <Text
                style={[
                  textStyle,
                  { marginBottom: vScale(4.1) },
                  isRTL && { textAlign: "left" }
                ]}
              >
                {strings.location}
              </Text>
              <View style={locationContainer}>
                <Text style={[textStyle, { marginBottom: vScale(10.6) }]}>
                  {location}
                </Text>
                <Image
                  source={icons.loc}
                  resizeMode={"contain"}
                  style={locStyle}
                />
              </View>
              <View style={borderSeparator} />
              <View style={errorContainer}>
                <Text style={errorMessageStyle}>
                  {isLocationError ? strings.chooseYourLocation : ""}
                </Text>
              </View>
            </TouchableOpacity>

            <TextField
              value={selected_city}
              authInputs
              disableInput = {true}
              label={strings.city}
              customMainContainer={customMainContainer}
              containerStyle={{ paddingStart: hScale(2) }}
              labelStyle={{ marginBottom: 0 }}
              inputStyle={{ marginStart: 0 }}
            />
            <ModalButton
              title={strings.theRangeYouWillBeWorkingOn}
              data={range}
              errorMessage={
                notSelectedRange && chooseRange && strings.chooseRange
              }
              onSelect={item => this.setState({ selectedRange: item })}
              onCloseModal={() => this.setState({ rangeModalVisible: false })}
              onPressSave={() =>
                this.setState({
                  rangeModalVisible: false,
                  submittedRange: selectedRange
                })
              }
              onPress={() => this.setState({ rangeModalVisible: true })}
              modalVisible={rangeModalVisible}
              selectedItem={selectedRange}
              submittedItem={submittedRange}
            />
            <ModalButton
              title={strings.servicesType}
              data={categories}
              errorMessage={
                notSelectedService && chooseService && strings.chooseService
              }
              onSelect={(item, isSelected) => {
                const newArr = isSelected
                  ? selectedService.filter(e => e != item)
                  : [...selectedService, item];
                this.setState({ selectedService: newArr });
              }}
              onCloseModal={() => this.setState({ serviceModalVisible: false })}
              onPressSave={() =>
                this.setState({
                  serviceModalVisible: false,
                  submittedService: selectedService
                })
              }
              onPress={() => this.setState({ serviceModalVisible: true })}
              modalVisible={serviceModalVisible}
              selectedItem={selectedService}
              submittedItem={submittedService}
              isCategory
            />
            <ModalButton
              title={strings.chooseBank}
              data={banks}
              errorMessage={notSelectedBank && chooseBank && strings.chooseBank}
              onSelect={item => this.setState({ selectedBank: item })}
              onCloseModal={() => this.setState({ bankModalVisible: false })}
              onPressSave={() =>
                this.setState({
                  bankModalVisible: false,
                  submittedBank: selectedBank
                })
              }
              onPress={() => this.setState({ bankModalVisible: true })}
              modalVisible={bankModalVisible}
              selectedItem={selectedBank}
              submittedItem={submittedBank}
            />
            <TextField
              onChangeText={bankAccount => this.setState({ bankAccount })}
              value={bankAccount}
              errorMessage={
                bankError && showBankError && strings.invalidBankAccount
              }
              authInputs
              label={strings.bankAccount}
              customMainContainer={customMainContainer}
              containerStyle={{ paddingStart: hScale(2) }}
              labelStyle={{ marginBottom: 0 }}
              inputStyle={{ marginStart: 0 }}
            />
            <TextField
              onChangeText={commercial => this.setState({ commercial })}
              value={commercial}
              errorMessage={
                commericalError &&
                showcommercialError &&
                strings.invalidCommerical
              }
              authInputs
              label={strings.commercialRegister}
              customMainContainer={customMainContainer}
              containerStyle={{ paddingStart: hScale(2) }}
              labelStyle={{ marginBottom: 0 }}
              inputStyle={{ marginStart: 0 }}
            />
            <TextField
              onChangeText={first_name => this.setState({ first_name })}
              value={first_name}
              authInputs
              label={strings.firstname}
              customMainContainer={customMainContainer}
              errorMessage={
                firstNameError && showFirstNameErrorStatus && strings.invalidName
              }
              containerStyle={{ paddingStart: hScale(2) }}
              labelStyle={{ marginBottom: 0 }}
              inputStyle={{ marginStart: 0 }}
            />
            <TextField
              onChangeText={last_name => this.setState({ last_name })}
              value={last_name}
              authInputs
              label={strings.lastname}
              customMainContainer={customMainContainer}
              errorMessage={
                lastNameError && showLastNameErrorStatus && strings.invalidName
              }
              containerStyle={{ paddingStart: hScale(2) }}
              labelStyle={{ marginBottom: 0 }}
              inputStyle={{ marginStart: 0 }}
            />

            <TextField
              onChangeText={mobile =>
                this.setState({ mobile: convertNumbers2English(mobile) })
              }
              value={mobile}
              authInputs
              label={strings.phoneNum}
              customMainContainer={customMainContainer}
              errorMessage={
                phoneError && showPhoneError && strings.invalidPhone
              }
              containerStyle={{ paddingStart: hScale(2) }}
              labelStyle={{ marginBottom: 0 }}
              inputStyle={{ marginStart: 0 }}
            />

            <TextField
              onChangeText={email => this.setState({ email })}
              value={email}
              authInputs
              label={strings.yourmail}
              customMainContainer={customMainContainer}
              errorMessage={
                MailError && showMailErrorStatus && strings.invalidMail
              }
              containerStyle={{ paddingStart: hScale(2) }}
              labelStyle={{ marginBottom: 0 }}
              inputStyle={{ marginStart: 0 }}
            />

            <TextField
              onChangeText={password => this.setState({ password })}
              value={password}
              errorMessage={
                passwordError &&
                showPasswordErrorStatus &&
                strings.invalidPassword
              }
              authInputs
              secureTextEntry
              label={strings.password}
              customMainContainer={customMainContainer}
              containerStyle={{ paddingStart: hScale(2) }}
              labelStyle={{ marginBottom: 0 }}
              inputStyle={{ marginStart: 0 }}
            />
            <TextField
              onChangeText={confirmPassword =>
                this.setState({ confirmPassword })
              }
              value={confirmPassword}
              errorMessage={
                confirmPasswordError &&
                showConfirmPasswordErrorStatus &&
                strings.passwordNotMatch
              }
              authInputs
              secureTextEntry
              label={strings.confirmPassword}
              customMainContainer={customMainContainer}
              containerStyle={{ paddingStart: hScale(2) }}
              labelStyle={{ marginBottom: 0 }}
              inputStyle={{ marginStart: 0 }}
            />
            <Button
              title={strings.continue}
              onPress={() =>
                this.validateSelection({
                  bankError,
                  isEmptyBank,
                  commericalError,
                  isEmptyCommerical,
                  isEmptyFirstName,
                  isEmptyPhone,
                  isEmptyMail,
                  firstNameError,
                  lastNameError,
                  phoneError,
                  MailError,
                  isEmptyPassword,
                  isEmptyConfirmPassword,
                  passwordError,
                  confirmPasswordError
                })
              }
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(125.2)
  },
  welcomeTextStyle: {
    fontSize: fScale(21),
    color: colors.welcomeTextColor,
    alignSelf: "flex-start",
    // paddingLeft: hScale(15.1),
    marginBottom: vScale(8.6),
    fontFamily: fonts.arial
  },
  enterInfoStyle: {
    fontSize: fScale(15),
    color: colors.signInToColor,
    marginTop: vScale(8.5),
    alignSelf: "flex-start",
    // paddingLeft: hScale(15.1),
    fontFamily: fonts.arial
  },
  borderSeparator: {
    width: hScale(343.8),
    height: vScale(1.2),
    backgroundColor: colors.inputBorder
  },
  locationButton: {
    width: hScale(343.8),
    marginBottom: vScale(17.1)
  },
  textStyle: {
    color: colors.mainTextColor,
    fontSize: fScale(14),
    fontFamily: fonts.arial
  },
  mapButtonStyle: {
    width: sWidth,
    height: vScale(56.4),
    borderRadius: 0
  },
  linearStyle: {
    borderRadius: 0
  },
  errorContainerCustom: {
    height: 0,
    marginTop: 0
  },
  backButtonCustom: {
    position: "absolute",
    top: vScale(17),
    left: 0
  },
  customBorder: {
    width: hScale(343.8)
  },
  customMainContainer: {
    width: hScale(343.8)
  },
  locStyle: {
    width: hScale(17),
    height: hScale(17)
  },
  locationContainer: {
    width: hScale(343.8),
    justifyContent: "space-between",
    flexDirection: "row"
  },
  uploadImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginStart: hScale(2),
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
  titleStyle: {
    textAlign: "center",
    fontSize: fScale(19),
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

const range = [
  { name: "10KM", id: 10 },
  { name: "50KM", id: 50 },
  { name: "100KM", id: 100 },
  { name: "200KM", id: 200 },
  { name: "400KM", id: 400 },
  { name: "600KM", id: 600 },
  { name: "800KM", id: 800 },
  { name: "1000KM", id: 1000 }
];

export const EmployeeSignUp = connect(EmployeeSignUpScreen);
