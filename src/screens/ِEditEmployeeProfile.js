import React, { Component } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  I18nManager
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { fScale, hScale, sWidth, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { BackButton, Button, Container, TextField } from "../components";
import { ModalButton } from "../components/ModalButton";
import { colors } from "../constants";
import { strings } from "../strings";
import { ImagePicker, actions, convertNumbers2English } from "../helpers";
import { connect } from "step-react-redux";
import { StepRequest } from "step-api-client";

class EditEmployeeProfileScreen extends Component {
  constructor(props) {
    super(props);
    const { user, cities, categories, banks } = this.props;
    console.warn("user", user);
    let selectedCity,
      selectedBank,
      selectedRange,
      selectedService = [];
    cities.forEach(city => {
      if (city.id == user.data.city_id) {
        selectedCity = { name: city.name, id: city.id };
        console.warn(selectedCity);
      }
    });
    range.forEach(range => {
      if (range.id == user.data.distance) {
        selectedRange = { name: range.name, id: range.id };
      }
    });
    const myCategoriesIDs = user.data.category.map(e => e.id);
    categories.forEach(category => {
      if (myCategoriesIDs.includes(category.id)) {
        selectedService.push(category);
      }
    });
    banks.forEach(bank => {
      if (bank.id == user.data.bank_id) {
        selectedBank = { name: bank.name, id: bank.id };
      }
    });

    this.state = {
      name: user.data.name,
      image: user.data.avatar,
      mobile: user.data.mobile,
      commercial: user.data.commercial ? user.data.commercial : "",
      bankAccount: user.data.bank_no,
      uploadImage: null,
      modalVisible: false,
      location: { longitude: user.data.emp_long, latitude: user.data.emp_lat },
      password: "",
      confirmPassword: "",
      error: "",
      selectedCity,
      selectedRange,
      selectedService,
      selectedBank,
      chooseCity: false,
      chooseRange: false,
      chooseService: false,
      chooseBank: false,
      cityModalVisible: false,
      rangeModalVisible: false,
      serviceModalVisible: false,
      bankModalVisible: false,
      submittedCity: { name: selectedCity.name },
      submittedRange: { name: selectedRange.name },
      submittedService: selectedService,
      submittedBank: { name: selectedBank.name },
      oldCategories: selectedService
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: <BackButton onPress={() => navigation.goBack()} />
  });

  validateSelection(
    bankError,
    isEmptyBank,
    commericalError,
    isEmptyCommerical,
    isEmptyName,
    NameError,
    isEmptyPhone,
    phoneError,
    isEmptyPassword,
    isEmptyConfirmPassword,
    passwordError,
    confirmPasswordError
  ) {
    const {
      submittedCity,
      submittedRange,
      submittedService,
      submittedBank
    } = this.state;
    if (submittedCity == "") {
      this.setState({ chooseCity: true });
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
        isEmptyName,
        NameError,
        isEmptyPhone,
        phoneError,
        isEmptyPassword,
        isEmptyConfirmPassword,
        passwordError,
        confirmPasswordError
      );
    }
  }
  validateInputs(
    bankError,
    isEmptyBank,
    commericalError,
    isEmptyCommerical,
    isEmptyName,
    NameError,
    isEmptyPhone,
    phoneError,
    isEmptyPassword,
    isEmptyConfirmPassword,
    passwordError,
    confirmPasswordError
  ) {
    let error = "";
    if ((isEmptyBank, bankError)) {
      error = "bank";
    } else if ((isEmptyPhone, phoneError)) {
      error = "phone";
    } else if ((isEmptyName, NameError)) {
      error = "name";
    } else if ((isEmptyPassword, passwordError)) {
      error = "password";
    } else if ((isEmptyConfirmPassword, confirmPasswordError)) {
      error = "confirmPassword";
    }
    if (error == "") {
      this.editAccount();
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
      image: imageSource.uri,
      uploadImage: imageObject
    });
  }

  editAccount() {
    const { user } = this.props;
    let {
      name,
      password,
      confirmPassword,
      uploadImage,
      image,
      selectedService,
      selectedBank,
      selectedRange,
      selectedCity,
      mobile,
      bankAccount,
      commercial,
      location,
      oldCategories
    } = this.state;
    if (commercial == "") {
      commercial = null;
    }
    const mainData = user.data;
    const updatedData = {};
    const newUploadedImage = image != mainData.avatar;
    const newCity = selectedCity.id != mainData.city_id;
    const newRange = selectedRange.id != mainData.distance;
    const newCategory = selectedService != oldCategories;
    const newBank = selectedBank.id != mainData.bank_id;
    const newBankAccount = bankAccount != mainData.bank_no;
    const newCommercial = commercial != mainData.commercial;
    const newName = name != mainData.name;
    const newMobile = mobile != mainData.mobile;
    const newPassword = password.length != 0 && password === confirmPassword;
    const newLocationLongitude = location.longitude != mainData.emp_long;
    const newLocationLatitude = location.latitude != mainData.emp_lat;
    const newLocation = newLocationLongitude || newLocationLatitude;
    if (newUploadedImage) {
      updatedData.avatar = uploadImage;
    }
    if (newCity) {
      updatedData.city_id = selectedCity.id;
    }
    if (newLocation) {
      updatedData.emp_long = location.longitude;
      updatedData.emp_lat = location.latitude;
    }

    if (newRange) {
      updatedData.distance = selectedRange.id;
    }
    if (newCategory) {
      updatedData.category_id = selectedService.map(e => e.id);
    }
    if (newBank) {
      updatedData.bank_id = selectedBank.id;
    }
    if (newBankAccount) {
      updatedData.bank_no = bankAccount;
    }
    if (newCommercial) {
      updatedData.commercial = commercial;
    }
    if (newName) {
      updatedData.name = name;
    }
    if (newMobile) {
      updatedData.mobile = mobile;
    }
    if (newPassword) {
      updatedData.password = password;
    }
    const notChangedData =
      !newUploadedImage &&
      !newCity &&
      !newLocationLongitude &&
      !newLocationLatitude &&
      !newCategory &&
      !newBank &&
      !newRange &&
      !newBankAccount &&
      !newCommercial &&
      !newName &&
      !newMobile &&
      !newPassword;
    if (!notChangedData) {
      this.editEmployeeAccount(updatedData);
    } else {
      this.props.navigation.goBack();
    }
  }
  async editEmployeeAccount(updatedData) {
    console.warn("updatedData", updatedData);
    this.setState({ loading: true });
    try {
      const data = await actions.updateUser(updatedData);
      console.warn("data", data);
      const profile = await StepRequest("profile");
      actions.setUserData({ data: profile });
      console.warn("profile", profile);
      Alert.alert(data);
      this.props.navigation.navigate("NewTasks");
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert(error.message);
    }
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
      customBorder,
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
      avatarStyle
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
      uploadImage,
      name,
      image
    } = this.state;
    console.warn(submittedCity);
    const notSelectedCity = submittedCity == "";
    const notSelectedRange = submittedRange == "";
    const notSelectedService = submittedService.length == 0;
    const notSelectedBank = submittedBank == "";
    const isNameError = error === "name";
    const isPhoneError = error === "phone";
    const isPasswordError = error === "password";
    const isConfirmPasswordError = error === "confirmPassword";
    const isBankAccountError = error === "bank";
    const isCommericalRegisterError = error === "commerical";
    const isEmptyBank = bankAccount.length == 0;
    const isEmptyCommerical = commercial.length == 0;
    const isEmptyPhone = mobile.length == 0;
    const isEmptyPassword = password.length == 0;
    const isEmptyConfirmPassword = confirmPassword.length == 0;
    const bankError = bankAccount.length != 24 || !bankAccount.startsWith("SA");
    const showBankError = bankAccount.length > 0 || isBankAccountError;
    const commericalError = isNaN(commercial) || commercial.length < 4;
    const showcommercialError =
      commercial.length > 0 || isCommericalRegisterError;
    const isEmptyName = name.length == 0;
    const NameError = name.length < 3;
    const phoneError =
      isNaN(mobile) || mobile.length != 10 || !mobile.startsWith(0);
    const showNameErrorStatus = name.length > 0 || isNameError;
    const showPhoneError = mobile.length > 0 || isPhoneError;
    const passwordError = password.length < 6 && password.lenght > 0;
    const showPasswordErrorStatus = password.length > 0 || isPasswordError;
    const confirmPasswordError = confirmPassword != password;
    const showConfirmPasswordErrorStatus =
      confirmPassword.length > 0 || isConfirmPasswordError;

    const { cities, banks, categories } = this.props;
    const { isRTL } = I18nManager;

    return (
      <Container transparentImage style={container}>
        <Modal animationType="fade" transparent={false} visible={modalVisible}>
          <MapView
            ref={ref => (this.myMapView = ref)}
            showsUserLocation
            showsMyLocationButton
            style={{ flex: 1, width: sWidth }}
            initialRegion={{
              longitude: location.longitude,
              latitude: location.latitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
            // onMapReady={() => {
            //   getUserLocation(
            //     position => {
            //       const { latitude, longitude } = position.coords;
            //       this.myMapView.animateToRegion({
            //         latitude,
            //         longitude,
            //         latitudeDelta: 0.01,
            //         longitudeDelta: 0.01
            //       });
            //       this.setState({ location: { latitude, longitude } });
            //     },
            //     error => {}
            //   );
            // }}
            onRegionChangeComplete={region => {
              const { latitude, longitude } = region;
              this.setState({ location: { latitude, longitude } });
            }}
          >
            <Marker
              pinColor={colors.second}
              coordinate={location || { longitude: 45, latitude: 25 }}
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
            onPress={() => this.setState({ modalVisible: false })}
          />
        </Modal>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "stretch" }}
        >
          <KeyboardAvoidingView
            behavior={"position"}
            keyboardVerticalOffset={-400}
          >
            <Text style={welcomeTextStyle}>{strings.editYourProfile}</Text>
            <Text style={enterInfoStyle}>{strings.enterInfo}</Text>
            <View style={uploadImageContainer}>
              <View style={imageContainer}>
                <Image
                  resizeMode={"contain"}
                  source={image ? { uri: image } : icons.placeholderImage}
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
            <ModalButton
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
            />
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
                  {strings.location}
                </Text>
                <Image
                  source={icons.loc}
                  resizeMode={"contain"}
                  style={locStyle}
                />
              </View>
              <View style={borderSeparator} />
            </TouchableOpacity>
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
              onChangeText={name => this.setState({ name })}
              value={name}
              authInputs
              label={strings.yourname}
              customMainContainer={customMainContainer}
              errorMessage={
                NameError && showNameErrorStatus && strings.invalidName
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
              title={strings.save}
              onPress={() =>
                this.validateSelection(
                  bankError,
                  isEmptyBank,
                  commericalError,
                  isEmptyCommerical,
                  isEmptyName,
                  NameError,
                  isEmptyPhone,
                  phoneError,
                  isEmptyPassword,
                  isEmptyConfirmPassword,
                  passwordError,
                  confirmPasswordError
                )
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
    paddingLeft: hScale(14.1),
    marginBottom: vScale(8.6),
    fontFamily: fonts.arial
  },
  enterInfoStyle: {
    fontSize: fScale(15),
    color: colors.signInToColor,
    marginTop: vScale(8.5),
    alignSelf: "flex-start",
    paddingLeft: hScale(14.1),
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
    width: hScale(22.2),
    height: hScale(22.2)
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
    fontFamily: fonts.arial,
    fontSize: fScale(9)
  },
  titleStyle: {
    textAlign: "center",
    fontSize: fScale(19),
    fontFamily: fonts.arial
  },
  avatarStyle: {
    width: hScale(60),
    height: vScale(50)
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

export const EditEmployeeProfile = connect(EditEmployeeProfileScreen);
