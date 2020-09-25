import React, { Component } from "react";
import { FlatList, Image, StyleSheet, Alert } from "react-native";
import { hScale, vScale } from "step-scale";
import {
  Container,
  MainCard,
  OfferCard,
  EmptyScreen,
  BackButton
} from "../components";
import { icons } from "../assets";
import { strings } from "../strings";
import { whiteHeaderOptions } from "../navigation/options";
import { StepRequest } from "step-api-client";

export class RequestDetails extends Component {
  constructor(props) {
    super(props);
    const item = this.props.navigation.getParam("item", null);
    this.state = {
      item,
      screenLoading: true,
      loading: false,
      rejectLoading: false,
      refreshLoading: false,
      bid_accepted: false,
    };
  }
  static navigationOptions = ({ navigation }) => ({
    ...whiteHeaderOptions,
    headerLeft: (
      <BackButton
        backWithTitle
        onPress={() => navigation.goBack()}
        title={strings.request}
      />
    )
  });

  componentDidMount(){
    const shouldGetData = this.props.navigation.getParam("getData", false);
    if (shouldGetData){
      this.refreshData()
    } else {
      this.setState({ screenLoading: false })
    }
  }

  async acceptOffer(id) {
    this.setState({ loading: true });
    const { item, selectedItem } = this.state;
    try {
      const acceptBody = { offer_id: id, request_id: item.id };
      const data = await StepRequest("client-offers", "POST", acceptBody);
      this.refreshData()
      await this.setState({ loading: false });
      console.warn("data", data);
      await this.props.navigation.navigate("Chat", {
        receiver_id: selectedItem.employee.id,
        avatar: selectedItem.employee.avatar,
        task_id: item.id
      });
      console.warn("acceptBody", acceptBody);
    } catch (error) {
      this.setState({ loading: false });
      Alert.alert(error.message);
    }
  }
  async rejectOffer(id) {
    this.setState({ rejectLoading: true });
    const { item } = this.state;
    try {
      const rejectBody = { offer_id: id, request_id: item.id };
      const data = await StepRequest(
        "client-offers/rejectOffer",
        "POST",
        rejectBody
      );
      await this.refreshData();
      await this.setState({ rejectLoading: false });
      console.warn("data", data);
      Alert.alert(data);
      console.warn("rejectBody", rejectBody);
    } catch (error) {
      this.setState({ rejectLoading: false });
      Alert.alert(error.message);
    }
  }
  async refreshData() {
    const { id } = this.state.item;
    try {
      const data = await StepRequest(`client-requests/${id}`);
      console.log("request data: ", data);
      var bid_accepted = false;
      if(data.offers != null && data.offers.length > 0) {
        for(i = 0; i < data.offers.length; i ++) {
          if(data.offers[i].status == 1) {
            bid_accepted = true;
            break;
          }
        }
      }
      this.setState({ item: data, refreshLoading: false, screenLoading: false, bid_accepted: bid_accepted });
    } catch (error) {
      Alert.alert(error.message);
      this.props.navigation.goBack()
    }
  }
  render() {
    const {
      container,
      mainImageStyle,
      contentContainerStyle,
      noOffersImageStyle
    } = styles;
    const {
      item,
      selectedItem,
      loading,
      rejectLoading,
      screenLoading,
      refreshLoading,
      bid_accepted
    } = this.state;
    const data = item.offers;
    const noOffers = data.length == 0;
    return (
      <Container style={container} loading={screenLoading}>
        <MainCard
          clientProfile
          item={item}
          containerStyle={{ alignSelf: "center" }}
          disableTouch
        />
        <Image
          source={{ uri: item.image }}
          style={mainImageStyle}
          resizeMode={"cover"}
        />
        {noOffers ? (
          <EmptyScreen
            title={strings.noOffers}
            image={icons.emptyNoOffers}
            imageStyle={noOffersImageStyle}
            hideButton
          />
        ) : (
          <FlatList
            data={data}
            extraData={this.state}
            onRefresh={() =>
              this.setState({ rejectLoading: true }, () => this.refreshData())
            }
            refreshing={refreshLoading}
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <OfferCard
                loading={selectedItem == item && loading}
                rejectLoading={selectedItem == item && rejectLoading}
                item={item}
                bid_accepted = {bid_accepted}
                onRejectPress={() => {
                  this.setState({ selectedItem: item }, () =>
                    this.rejectOffer(item.id)
                  );
                }}
                onPress={() => {
                  this.setState({ selectedItem: item }, () =>
                    this.acceptOffer(item.id)
                  );
                }}
              />
            )}
          />
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(8.4),
    alignItems: "stretch"
  },
  mainImageStyle: {
    width: hScale(350.7),
    height: vScale(107.3),
    borderRadius: hScale(5),
    alignSelf: "center"
  },
  contentContainerStyle: {
    alignItems: "center",
    marginTop: vScale(11.6)
  },
  noOffersImageStyle: {
    width: hScale(36.4),
    height: vScale(28.6)
  }
});
