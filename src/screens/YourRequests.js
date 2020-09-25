import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View,Alert } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import {
  ChatIcon,
  Container,
  DrawerIcon,
  MainCard,
  EmptyScreen,
  HeaderLogo
} from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { icons, fonts } from "../assets";
import { StepRequest } from "step-api-client";

export class YourRequests extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      refreshRequests: () => this.refreshRequests()
    });
  }
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderLogo />,
    headerRight: (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ChatIcon onPress={() => navigation.navigate("Messages")} />
        <DrawerIcon onPress={() => navigation.openDrawer()} />
      </View>
    )
  });
  state = { screenLoading: true, data: [], listLoading: false, deletingItemWithID: null };
  async componentDidUpdate(prevProps) {
    const { navigation } = this.props;
    const oldRefresh = prevProps.navigation.getParam("refresh");
    const newRefresh = navigation.getParam("refresh");
    if (newRefresh && newRefresh != oldRefresh) {
      await navigation.setParams({
        refresh: false
      });
      this.refreshRequests();
    }
  }
  componentDidMount() {
    
    this.loadMyRequests();
  }

  async cancelRequest(id) {
    this.setState({ deletingItemWithID: id });

    try {
      const data = await StepRequest("client-requests/canceled", "POST", { service_request_id: id });
      Alert.alert(data);
      this.refreshRequests()
    } catch (error) {
      this.setState({ screenLoading: false, listLoading: false });
      Alert.alert(error.message);
    }
    this.setState({ deletingItemWithID: null });
  }

  async loadMyRequests() {
    try {
      const data = await StepRequest("client-requests");
      this.setState({
        data,
        screenLoading: false,
        listLoading: false
      });
      console.log("client request response:", JSON.stringify(data));
    } catch (error) {
      this.setState({ screenLoading: false, listLoading: false });
      Alert.alert(error.message);
    }
  }

  refreshRequests() {
    this.setState({ listLoading: true }, () => this.loadMyRequests());
  }

  render() {
    const { container, textStyle, secTitleStyle, emptyImageStyle } = styles;
    const { screenLoading, data, listLoading, deletingItemWithID } = this.state;
    const { navigation } = this.props;
    const noRequests = data.length == 0;
    return (
      <Container loading={screenLoading} gradientHeader style={container}>
        <Text style={textStyle}>{strings.yourRequests}</Text>
        <Text style={[textStyle, secTitleStyle]}>
          {strings.chooseServiceAndLetsStart}
        </Text>
        {noRequests ? (
          <EmptyScreen
            title={strings.noRequests}
            image={icons.emptyNoRequests}
            imageStyle={emptyImageStyle}
            onPress={() =>
              this.setState({ screenLoading: true }, () =>
                this.refreshRequests()
              )
            }
          />
        ) : (
          <FlatList
            onRefresh={() => this.refreshRequests()}
            refreshing={listLoading}
            data={data}
            extraData={this.state}
            contentContainerStyle={{ alignItems: "center", paddingVertical: vScale(10) }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <MainCard
                  showDeleteButton
                  onPressDelete={() => this.cancelRequest(item.id)}
                  isDeleting={deletingItemWithID == item.id}
                  disableTouch={item.OrderStatus === "UnderPayment"}
                  onPress={() => {
                    if (item.OrderStatus === "InProgress") {
                      if(item.offers.length == 0) {

                      } else {
                        if(item.assignedEmployee != null) {
                          navigation.navigate("Chat", {
                            receiver_id: item.assignedEmployee.id,
                            avatar: item.assignedEmployee.avatar,
                            task_id: item.id
                          });
                        }
                      } 
                    } else {
                      navigation.navigate("RequestDetails", { item })
                    }
                  }}
                  clientProfile
                  item={item}
                />
              );
            }}
          />
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: vScale(89.5),
    paddingBottom: vScale(64),
    alignItems: "stretch"
  },
  textStyle: {
    color: colors.white,
    fontSize: fScale(23),
    alignSelf: "flex-start",
    paddingHorizontal: hScale(22.4),
    marginBottom: vScale(7.1),
    fontFamily: fonts.arial
  },
  secTitleStyle: {
    fontSize: fScale(17),
    marginBottom: vScale(31.4),
    fontFamily: fonts.arial
  },
  emptyImageStyle: {
    width: hScale(42.3),
    height: vScale(46.1)
  }
});
