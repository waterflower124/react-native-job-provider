import React, { Component } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  I18nManager
} from "react-native";
import StarRating from "react-native-star-rating";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StepRequest } from "step-api-client";
import { connect } from "step-react-redux";
import { fScale, hScale, vScale, sWidth } from "step-scale";
import { fonts, icons } from "../assets";
import {
  BackButton,
  Button,
  Container,
  MainCard,
  PriceCalculator,
  TextField
} from "../components";
import { colors } from "../constants";
import { whiteHeaderOptions } from "../navigation/options";
import { strings } from "../strings";
import { convertNumbers2English } from "../helpers";
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import global from '../global/global';
import { Colors } from "react-native/Libraries/NewAppScreen";

class AddOfferScreen extends Component {

  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      ...whiteHeaderOptions,
      headerLeft: () =>
        <BackButton
          backWithTitle
          onPress={() => this.props.navigation.goBack()}
          title={strings.addOffer}
        />
    })
  }


  state = {
    data: [],
    item: null,
    location: null,
    ratio: "",
    earn: "",
    appEarning: "",
    appRatio: "",
    price: "",
    details: "",
    error: "",
    screenLoading: false,
    loading: false,
    showImage: false,
    showImageUrl: "",
    guest_login: true,
  };

  async UNSAFE_componentWillMount() {
    const userToken = await AsyncStorage.getItem("userToken");
    if(userToken == null || userToken == "") {
      this.setState({
        guest_login: true,
      })
    } else {
      this.setState({
        guest_login: false,
      })
      const request_id = this.props.route.params.id;
      this.setState({ screenLoading: true });
      try {
        const data = await StepRequest(`new-task/${request_id}`);
        this.setState({item: data});
      } catch (error) {
        Alert.alert(error.message);
      }
      this.setState({ screenLoading: false });
    }
  }

  componentDidMount() {
    this.getAppRatio();
    this.notiRequestCreateOpenlistener = EventRegister.addEventListener(global.NOTI_REQUEST_CREATED_OPEN, (id) => {
      if(id != this.state.request_id) {
        this.setState({
          request_id: id
        }, async() => {
          const data = await StepRequest(`new-task/${this.state.request_id}`);
          this.setState({item: data});
          this.getAppRatio();
        })
      }
    })
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.notiRequestCreateOpenlistener);
  }

  async getAppRatio() {
    try {
      const data = await StepRequest("settings/commission");
      this.setState({ ratio: data.value });
    } catch (error) {
      Alert.alert(error.message);
    }
  }
  calcRatio() {
    const { price, ratio } = this.state;
    if (isNaN(price)) {
      this.setState({ error: "price" });
    } else {
      const earn = (price * (100 - Number(ratio))) / 100;
      const appEarning = (price * Number(ratio)) / 100;
      this.setState({ earn, appEarning, error: "" });
      if (price == "") {
        this.setState({ earn: "" });
      }
    }
  }
  validateInputs(isEmptyDetails, detailsError, isEmptyPrice, priceError) {
    if(this.state.guest_login) {
      Alert.alert(strings.signinRequest, "");
      return;
    }

    let error = "";
    if ((isEmptyPrice, priceError)) {
      error = "price";
    } else if ((isEmptyDetails, detailsError)) {
      error = "details";
    }
    if (error == "") {
      this.addOffer();
    } else {
      this.setState({ error });
    }
  }

  async addOffer() {
    this.setState({ loading: true });
    const request_id = this.props.route.params.id;
    const { price, details } = this.state;
    const offerData = {
      price,
      note: details,
      request_id
    };
    console.warn("offerData", offerData);
    try {
      const data = await StepRequest("employee-offers", "POST", offerData);
      console.warn("data in offer", data);
      await this.setState({ loading: false });
      await this.props.navigation.navigate("NewTasks", { refresh: true });
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert(error.message);
    }
  }

  render() {
    const {
      container,
      mainImageStyle,
      mapContainer,
      textStyle,
      nameImageContainer,
      imageStyle,
      buttonStyle,
      linearStyle,
      buttonTitleStyle,
      inputRatioStyle,
      multilineInputStyle,
      inputStyle,
      contentContainerStyle,
      chatButtonStyle,
      chatContainer,
      chatImageContainer,
      chatImageStyle
    } = styles;

    // const item = this.props.route.params.item;

    const {
      price,
      earn,
      details,
      error,
      screenLoading,
      loading,
      appEarning,
      ratio,
      item
    } = this.state;

    const isEmptyDetails = details.length == 0;
    const isEmptyPrice = price.length == 0;
    const isDetailsError = error == "details";
    const isPriceError = error == "price";
    const detailsError = details.length < 1;
    const showDetailsError = details.length > 0 || isDetailsError;
    const priceError = isNaN(price) || price.length < 1;
    const showPriceError = price.length > 0 || isPriceError;
    const { navigation } = this.props;
    return (
      <Container style={container} loading={screenLoading}>
      {
        this.state.showImage && this.state.showImageUrl != null && this.state.showImageUrl != "" &&
        <View style = {{flex: 1, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10, justifyContent: 'center', alignItems: 'center'}}
          onStartShouldSetResponder = {() => {this.setState({showImage: false, showImageUrl: ""})}}>
          <View style = {{width: '100%', height: '100%', backgroundColor: '#000000', opacity: 0.8, position: 'absolute', top: 0, left: 0}}></View>
          <TouchableOpacity style = {{position: 'absolute', right: 20, top: 20, width: hScale(18), height: hScale(18), padding: hScale(3), borderRadius: hScale(12), backgroundColor: '#ffffff', zIndex: 10}}
            onPress = {() => {this.setState({showImage: false, showImageUrl: ""})}}>
            <Image source={icons.xClose} style={[{width: '100%', height: '100%', tintColor: colors.black }]} resizeMode="contain" />
          </TouchableOpacity>
          <Image style = {{width: '90%', height: '90%', resizeMode: 'contain'}} source = {{uri: this.state.showImageUrl}}/>
        </View>
      }
      {
        !screenLoading && item != null &&
        <ScrollView
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView
            behavior={"position"}
            keyboardVerticalOffset={-100}
          >
            <MainCard item={item} containerStyle={{ alignSelf: "center" }} disableTouch />
          {
            item.requirements_detail != null && item.requirements_detail != "" && 
            <Text style = {{width: hScale(350.7), padding: fScale(10), borderRadius: hScale(5), borderWidth: 1, borderColor: '#a0a0a0', marginBottom: 10, textAlign: I18nManager.isRTL ? 'right' : 'left'}} multiline = {true}>{item.requirements_detail}</Text>
          }
          {
            item.image != null && item.image != "" &&
            <TouchableOpacity onPress = {() => {this.setState({showImage: true, showImageUrl: item.image})}}>
              <Image
                source={{ uri: item.image }}
                style={mainImageStyle}
                resizeMode={"cover"}
              />
            </TouchableOpacity>
          }
            <MapView
              provider = {PROVIDER_GOOGLE}
              ref={ref => (this.myMapView = ref)}
              style={mapContainer}
              initialRegion={{
                longitude: item.lng,
                latitude: item.lat,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05
              }}
            >
              <Marker
                pinColor={colors.second}
                coordinate={{ longitude: item.lng, latitude: item.lat }}
              />
            </MapView>
            <View style={chatContainer}>
              <Text style={textStyle}>{strings.addYourOffer}</Text>
              <View style={nameImageContainer}>
              <Image
                source={
                  item.client.avatar ? { uri: item.client.avatar } : icons.userPlaceholder
                }
                resizeMode={"cover"}
                style={imageStyle}
              />
              <Text
                numberOfLines={1}
                style={[textStyle, I18nManager.isRTL && { textAlign: "left" }]}
              >
                {item.client.name}
              </Text>
              <StarRating
                containerStyle={{ width: hScale(40), alignSelf: "center"}}
                disabled
                emptyStar={icons.inActiveStar}
                fullStar={icons.activeStar}
                maxStars={5}
                rating={item.client.review}
                halfStar={icons.halfStar}
                starStyle={{ width: hScale(8), height: hScale(8) }}
              />
            </View>
              <TouchableOpacity
                style={chatButtonStyle}
                onPress={() => {
                  if(this.state.guest_login) {
                    Alert.alert(strings.signinRequest, "");
                    return;
                  }
                  console.log(JSON.stringify(item))
                  navigation.navigate("Chat", { receiver_id: item.client.id, task_id: item.id, avatar: item.client.avatar ? item.client.avatar : null })
                }}
              >
                <Image
                  source={icons.chatImage}
                  style={chatImageStyle}
                  resizeMode={"contain"}
                />
                <Text style={[textStyle, { color: colors.white }]}>
                  {strings.communicate}
                </Text>
              </TouchableOpacity>
            </View>

            <PriceCalculator
              maxLength={6}
              onChangeText={price =>
                this.setState(
                  { price: convertNumbers2English(price) },
                  this.calcRatio
                )
              }
              value={price}
              errorMessage={
                priceError && showPriceError && strings.invalidPrice
              }
              earn={earn}
              appRatio={appEarning}
            />
            <TextField
              onChangeText={details => this.setState({ details })}
              value={details}
              maxLength={190}
              containerStyle={multilineInputStyle}
              placeholder={strings.offer}
              inputStyle={[inputStyle, { alignSelf: "stretch" }]}
              multiline
              errorMessage={
                detailsError && showDetailsError && strings.invalidOfferDetails
              }
            />
            <Button
              loading={loading}
              title={strings.send}
              style={buttonStyle}
              linearCustomStyle={linearStyle}
              titleStyle={buttonTitleStyle}
              onPress={() =>
                this.validateInputs(
                  isEmptyDetails,
                  detailsError,
                  isEmptyPrice,
                  priceError
                )
              }
            />
          </KeyboardAvoidingView>
        </ScrollView>
        }
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(14.7),
    alignItems: "stretch"
  },
  mainImageStyle: {
    width: hScale(350.7),
    height: vScale(107.3),
    borderRadius: hScale(5),
    marginBottom: vScale(11.6),
    backgroundColor: '#999999'
  },
  mapContainer: {
    width: hScale(350.7),
    height: vScale(252.9),
    borderRadius: hScale(5)
  },
  textStyle: {
    color: colors.mainText,
    fontSize: fScale(15),
    // marginVertical: vScale(15),
    // paddingStart: hScale(12.5),
    // alignSelf: "flex-start",
    fontFamily: fonts.arial
  },
  nameImageContainer: {
    width: hScale(50),
    justifyContent: "center",
    alignItems: "center",
    marginEnd: hScale(8.9)
  },
  imageStyle: {
    width: hScale(28),
    height: hScale(28),
    borderRadius: hScale(14)
  },
  buttonStyle: {
    width: hScale(350.7),
    height: vScale(35.4),
    borderRadius: hScale(5),
    marginBottom: vScale(20),
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10
  },
  linearStyle: {
    borderRadius: hScale(5)
  },
  buttonTitleStyle: {
    textAlign: "center"
  },
  inputRatioStyle: {
    width: hScale(350.7),
    height: vScale(36.5),
    marginBottom: vScale(8.5)
  },
  multilineInputStyle: {
    width: hScale(350.7),
    height: vScale(82.5),
    marginBottom: vScale(11.1)
  },
  inputStyle: {
    fontSize: fScale(14),
    marginTop: vScale(5),
    marginStart: 0
  },
  contentContainerStyle: {
    alignItems: "center",
    marginTop: vScale(8)
  },
  chatContainer: {
    width: hScale(350.7),
    marginVertical: vScale(15),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  chatImageStyle: {
    width: hScale(12.3),
    height: hScale(12.3),
    marginEnd: hScale(5)
  },
  chatButtonStyle: {
    width: hScale(100),
    height: vScale(30),
    borderRadius: hScale(10),
    backgroundColor: colors.chatButtonBackground,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.chatAddofferShadow,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10
  }
});

export const AddOffer = connect(AddOfferScreen);
