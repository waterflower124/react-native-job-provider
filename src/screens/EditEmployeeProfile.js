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
  I18nManager,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { fScale, hScale, sWidth, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import { BackButton, Button, Container, TextField } from "../components";
import { ModalButton } from "../components/ModalButton";
import { colors } from "../constants";
import { strings } from "../strings";
import { ImagePicker, actions, convertNumbers2English, GoogleMapiAPIKey, getUserLocation} from "../helpers";
import { connect } from "step-react-redux";
import { StepRequest } from "step-api-client";
import AsyncStorage from '@react-native-community/async-storage'

class EditEmployeeProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      headerLeft: () => <BackButton onPress={() => this.props.navigation.goBack()} />
    })

    this.state = {
      first_name: "",
      last_name: "",
      image: "",
      mobile: "",
      national_iqama_commercial: "",
      bankAccount: "",
      uploadImage: null,
      modalVisible: false,
      location: "",
      lat: 0,
      lng: 0,
      password: "",
      confirmPassword: "",
      error: "",
      selectedCity: "",
      selectedRange: {name: '', id: -1},
      selectedService: [],
      selectedBank: {name: '', id: -1},
      chooseRange: false,
      chooseService: false,
      chooseBank: false,
      cityModalVisible: false,
      rangeModalVisible: false,
      serviceModalVisible: false,
      bankModalVisible: false,
      // submittedCity: { name: selectedCity.name },
      submittedRange: { name: '', id: -1 },
      submittedService: [],
      submittedBank: { name: '', id: -1 },
      oldCategories: [],
    
      guest_login: true
    };

    // const userToken = await AsyncStorage.getItem("userToken");
    // if(userToken == null || userToken == "") {
    //   this.setState({
    //     guest_login: true,
    //   })
    // } else {
    //   this.setState({
    //     guest_login: false,
    //   })
    // }

    // const { user, cities, categories, banks } = this.props;
    
    // let selectedCity,
    //   selectedBank,
    //   selectedRange,
    //   selectedService = [];
    // // cities.forEach(city => {
    // //   if (city.id == user.data.city_id) {
    // //     selectedCity = { name: city.name, id: city.id };
    // //     console.warn(selectedCity);
    // //   }
    // // });
    // selectedCity = user.data.city;
    // range.forEach(range => {
    //   if (range.id == user.data.distance) {
    //     selectedRange = { name: range.name, id: range.id };
    //   }
    // });
    // const myCategoriesIDs = user.data.category.map(e => e.id);
    
    // categories.forEach(category => {
    //   if (myCategoriesIDs.includes(category.id)) {
    //     selectedService.push(category);
    //   }
    // });
    
    // banks.forEach(bank => {
    //   if (bank.id == user.data.bank_id) {
    //     selectedBank = { name: bank.name, id: bank.id };
    //   }
    // });

    // this.state = {
    //   first_name: user.data.first_name,
    //   last_name: user.data.last_name,
    //   image: user.data.avatar,
    //   mobile: user.data.mobile,
    //   commercial: user.data.commercial ? user.data.commercial : "",
    //   bankAccount: user.data.bank_no,
    //   uploadImage: null,
    //   modalVisible: false,
    //   location: user.data.address,
    //   lat: user.data.lat,
    //   lng: user.data.lng,
    //   password: "",
    //   confirmPassword: "",
    //   error: "",
    //   selectedCity,
    //   selectedRange,
    //   selectedService,
    //   selectedBank,
    //   chooseRange: false,
    //   chooseService: false,
    //   chooseBank: false,
    //   cityModalVisible: false,
    //   rangeModalVisible: false,
    //   serviceModalVisible: false,
    //   bankModalVisible: false,
    //   // submittedCity: { name: selectedCity.name },
    //   submittedRange: { name: selectedRange.name },
    //   submittedService: selectedService,
    //   submittedBank: { name: selectedBank.name },
    //   oldCategories: selectedService
    // };
  }

  async componentDidMount() {
    this.props.navigation.addListener("focus", this.init_data);
  }

  async init_data() {
    
  }

  async UNSAFE_componentWillMount() {
    
    const userToken = await AsyncStorage.getItem("userToken");
    
    var guest_login = true
    if(userToken == null || userToken == "") {
      guest_login = true;
    } else {
      guest_login = false;
    }

    const { user, cities, categories, banks } = this.props;
    
    let selectedCity,
      selectedBank,
      selectedRange,
      selectedService = [];
    // cities.forEach(city => {
    //   if (city.id == user.data.city_id) {
    //     selectedCity = { name: city.name, id: city.id };
    //     console.warn(selectedCity);
    //   }
    // });
    if(guest_login) {
      selectedCity = "";
      selectedRange = {name: '', id: -1};
      selectedService = []
      selectedBank = { name: '', id: -1 };
    } else {
      selectedCity = user.data.city;
      console.log("range: ", range);
      console.log("user data:", user.data);
      for(i = 0; i < range.length; i ++) {
        if (range[i].id == user.data.distance) {
          selectedRange = { name: range[i].name, id: range[i].id };
          break;
        }
      };
      if(!selectedRange) {
        selectedRange = { name: "1000KM", id: 1000 }
      }
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
    }
    
    

    this.setState({
      first_name: user.data.first_name,
      last_name: user.data.last_name,
      image: user.data.avatar,
      mobile: user.data.mobile ? user.data.mobile : "",
      national_iqama_commercial: user.data.national_iqama_commercial ? user.data.national_iqama_commercial : "",
      bankAccount: user.data.bank_no ? user.data.bank_no : "",
      uploadImage: null,
      modalVisible: false,
      location: user.data.address ? user.data.address : "",
      lat: user.data.lat,
      lng: user.data.lng,
      password: "",
      confirmPassword: "",
      error: "",
      selectedCity,
      selectedRange,
      selectedService,
      selectedBank,
      chooseRange: false,
      chooseService: false,
      chooseBank: false,
      cityModalVisible: false,
      rangeModalVisible: false,
      serviceModalVisible: false,
      bankModalVisible: false,
      // submittedCity: { name: selectedCity.name },
      submittedRange: { name: selectedRange.name },
      submittedService: selectedService,
      submittedBank: { name: selectedBank.name },
      oldCategories: selectedService,
    
      guest_login: guest_login
    });
  }

  validateSelection(
    bankError,
    isEmptyBank,
    isEmptyNational_iqamaError,
    isEmptyFirstName,
    isEmptyLastName,
    firstNameError,
    lastNameError,
    isEmptyPhone,
    phoneError,
    isEmptyPassword,
    isEmptyConfirmPassword,
    passwordError,
    confirmPasswordError
  ) {
    if(this.state.guest_login) {
      Alert.alert(strings.signinRequest, "");
      return;
    }
    const {
      selectedCity,
      submittedRange,
      submittedService,
      submittedBank
    } = this.state;
    if (submittedRange == "") {
      this.setState({ chooseRange: true });
    } else if (submittedService.length == 0) {
      this.setState({ chooseService: true });
    } else if (submittedBank == "") {
      this.setState({ chooseBank: true });
    } else {
      this.validateInputs(
        bankError,
        isEmptyBank,
        isEmptyNational_iqamaError,
        isEmptyFirstName,
        isEmptyLastName,
        firstNameError,
        lastNameError,
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
    isEmptyNational_iqamaError,
    isEmptyFirstName,
    isEmptyLastName,
    firstNameError,
    lastNameError,
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
    } else if ((isEmptyFirstName, firstNameError)) {
      error = "name";
    } else if ((isEmptyLastName, lastNameError)) {
      error = "name";
    } else if ((isEmptyPassword, passwordError)) {
      error = "password";
    } else if ((isEmptyConfirmPassword, confirmPasswordError)) {
      error = "confirmPassword";
    } else if (isEmptyNational_iqamaError) {
      error = "commercial_id";
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
      first_name,
      last_name,
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
      national_iqama_commercial,
      location,
      lat,
      lng,
      oldCategories
    } = this.state;

    const mainData = user.data;
    const updatedData = {};
    const newUploadedImage = image != mainData.avatar;
    const newRange = selectedRange.id != mainData.distance;
    const newCategory = selectedService != oldCategories;
    const newBank = selectedBank.id != mainData.bank_id;
    const newBankAccount = bankAccount != mainData.bank_no;
    const newNational_iqama_commercial = national_iqama_commercial != mainData.national_iqama_commercial;
    const newFirstName = first_name != mainData.first_name;
    const newLastName = last_name != mainData.last_name;
    const newMobile = mobile != mainData.mobile;
    const newPassword = password.length != 0 && password === confirmPassword;
    
    const newLocation = location != user.data.address;
    if (newUploadedImage) {
      updatedData.avatar = uploadImage;
    }
    
    if (newLocation) {
      updatedData.lat = lat;
      updatedData.lng = lng;
      updatedData.city = selectedCity;
      updatedData.address = location;
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
    if (newNational_iqama_commercial) {
      updatedData.national_iqama_commercial = national_iqama_commercial;
    }
    if (newFirstName) {
      updatedData.first_name = first_name;
    }
    if (newLastName) {
      updatedData.last_name = last_name;
    }
    if (newMobile) {
      updatedData.mobile = mobile;
    }
    if (newPassword) {
      updatedData.password = password;
    }
    const notChangedData =
      !newUploadedImage &&
      !newLocation &&
      !newCategory &&
      !newBank &&
      !newRange &&
      !newBankAccount &&
      !newNational_iqama_commercial &&
      !newFirstName &&
      !newLastName &&
      !newMobile &&
      !newPassword;
    if (!notChangedData) {
      this.editEmployeeAccount(updatedData);
    } else {
      this.props.navigation.goBack();
    }
  }


  async editEmployeeAccount(updatedData) {
    console.log("updatedData", JSON.stringify(updatedData));
    this.setState({ loading: true });
    try {
      const data = await actions.updateUser(updatedData);
      
      const profile = await StepRequest("profile");
      
      actions.setUserData({ data: profile });
      this.props.navigation.goBack();
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert(error.message);
    }
  }

  getCurrentAddress = async() => {
    this.setState({
        screenLoading: true
    })
    var parameter = "";
    let languageCode = await AsyncStorage.getItem('languageCode')
    if (languageCode == "en") {
      parameter = "latlng=" + this.state.lat + "," + this.state.lng + "&key=" + GoogleMapiAPIKey;
    } else {
      parameter = "latlng=" + this.state.lat + "," + this.state.lng + "&language=ar&key=" + GoogleMapiAPIKey;
    }
    var city_exist = false;
    await fetch("https://maps.googleapis.com/maps/api/geocode/json?" + parameter, {
        method: "GET",
    })
    .then(response => {
        return response.json();
    })
    .then(responseData => {
        console.log(JSON.stringify(responseData))
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
                              selectedCity: responseData.results[0].address_components[i].long_name
                            })
                            city_exist = true;
                            break;
                        }
                    }
                    if(city_exist) {
                      break;
                    } 
                }
                if(!city_exist) {
                    for(i = 0; i < responseData.results[0].address_components.length; i ++) {
                        for(j = 0; j < responseData.results[0].address_components[i].types.length; j ++) {
                            if(responseData.results[0].address_components[i].types[j] == "administrative_area_level_1") {
                                this.setState({
                                    selectedCity: responseData.results[0].address_components[i].long_name
                                })
                                city_exist = true;
                                break;
                            }
                        }
                        if(city_exist) {
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
      lat,
      lng,
      mobile,
      national_iqama_commercial,
      bankAccount,
      password,
      confirmPassword,
      error,
      selectedCity,
      selectedRange,
      selectedService,
      selectedBank,
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
      first_name,
      last_name,
      image,
      screenLoading,
      loading
    } = this.state;

    
    const notSelectedRange = submittedRange == "";
    const notSelectedService = submittedService.length == 0;
    const notSelectedBank = submittedBank == "";
    const isNameError = error === "name";
    const isPhoneError = error === "phone";
    const isPasswordError = error === "password";
    const isConfirmPasswordError = error === "confirmPassword";
    const isBankAccountError = error === "bank";
    const isCommericalRegisterError = error === "commercial_id";
    const isEmptyBank = bankAccount.length == 0;
    const isEmptyNational_iqamaError = national_iqama_commercial.length == 0;
    const isEmptyPhone = mobile.length == 0;
    const isEmptyPassword = password.length == 0;
    const isEmptyConfirmPassword = confirmPassword.length == 0;
    const bankError = bankAccount.length != 24 || !bankAccount.startsWith("SA");
    const showBankError = bankAccount.length > 0 || isBankAccountError;
    const commericalError = national_iqama_commercial.length == 0;
    const showNational_iqama_commercialError = isCommericalRegisterError;
    const isEmptyFirstName = first_name.length == 0;
    const isEmptyLastName = last_name.length == 0;
    const firstNameError = first_name.length < 3;
    const lastNameError = last_name.length < 3;
    const phoneError =
      isNaN(mobile) || mobile.length != 10 || !mobile.startsWith(0);
    const showFirstNameErrorStatus = first_name.length > 0 || isNameError;
    const showLastNameErrorStatus = last_name.length > 0 || isNameError;
    const showPhoneError = mobile.length > 0 || isPhoneError;
    const passwordError = password.length < 6 && password.lenght > 0;
    const showPasswordErrorStatus = password.length > 0 || isPasswordError;
    const confirmPasswordError = confirmPassword != password;
    const showConfirmPasswordErrorStatus =
      confirmPassword.length > 0 || isConfirmPasswordError;

    const { banks, categories } = this.props;
    const { isRTL } = I18nManager;

    return (
      <Container loading={screenLoading} transparentImage style={container}>
        <Modal animationType="fade" transparent={false} visible={modalVisible}>
          <MapView
            ref={ref => (this.myMapView = ref)}
            provider = {PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton
            style={{ flex: 1, width: sWidth }}
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
            }}
            onMapReady={() => {
              getUserLocation(
                position => {
                  const { latitude, longitude } = position.coords;
                  this.myMapView.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                  });
                  // this.setState({ location: { latitude, longitude } });
                },
                error => {}
              );
            }}
            onRegionChangeComplete={region => {
              const { latitude, longitude } = region;
              this.setState({ 
                lat: latitude,
                lng: longitude
               });
            }}
          >
            <Marker
              pinColor={colors.second}
              coordinate={{latitude: lat, longitude: lng} || { longitude: 45, latitude: 25 }}
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
            </TouchableOpacity>
            <TextField
              value={selectedCity}
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
              onChangeText={national_iqama_commercial => this.setState({ national_iqama_commercial })}
              value={national_iqama_commercial}
              errorMessage={
                commericalError &&
                showNational_iqama_commercialError &&
                strings.invalidCommerical
              }
              authInputs
              label={strings.national_iqama_commercial}
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
              loading={loading}
              onPress={() =>
                this.validateSelection(
                  bankError,
                  isEmptyBank,
                  isEmptyNational_iqamaError,
                  isEmptyFirstName,
                  isEmptyLastName,
                  firstNameError,
                  lastNameError,
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
