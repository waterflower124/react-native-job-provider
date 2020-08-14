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
import MapView, { Marker } from "react-native-maps";
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

class AddOfferScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    ...whiteHeaderOptions,
    headerLeft: (
      <BackButton
        backWithTitle
        onPress={() => navigation.goBack()}
        title={strings.addOffer}
      />
    )
  });
  state = {
    data: [],
    location: null,
    ratio: "",
    earn: "",
    appEarning: "",
    appRatio: "",
    price: "",
    details: "",
    error: "",
    screenLoading: false,
    loading: false
  };

  componentDidMount() {
    this.getAppRatio();
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
    const request_id = this.props.navigation.getParam("id", null);
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
    const item = this.props.navigation.getParam("item", null);
    const {
      price,
      earn,
      details,
      error,
      screenLoading,
      loading,
      appEarning,
      ratio
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
        <ScrollView
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView
            behavior={"position"}
            keyboardVerticalOffset={-100}
          >
            <MainCard item={item} containerStyle={{ alignSelf: "center" }} disableTouch />
            <Image
              source={{ uri: item.image }}
              style={mainImageStyle}
              resizeMode={"cover"}
            />
            <MapView
              ref={ref => (this.myMapView = ref)}
              style={mapContainer}
              initialRegion={{
                longitude: item.long,
                latitude: item.lat,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
            >
              <Marker
                pinColor={colors.second}
                coordinate={{ longitude: item.long, latitude: item.lat }}
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
                onPress={() =>
                  navigation.navigate("Chat", { receiver_id: item.user_id })
                }
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
    marginBottom: vScale(11.6)
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
