import React, { Component } from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import { hScale, vScale } from "step-scale";
import { icons } from "../assets";
import { Container, EmptyScreen, MessageCard } from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { Step_API_Helpers, StepRequest } from "step-api-client";
import { connect } from "step-react-redux";

class MessagesScreen extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      refreshChatList: () => this.refreshChatList()
    });
  }
  state = {
    screenLoading: true,
    pageNo: 1,
    last_page: null,
    list: [],
    listLoading: false
  };

  componentDidMount() {
    this.loadMessages();
  }
  async loadMessages() {
    const { pageNo } = this.state;
    const params = Step_API_Helpers.convertObjToParams({
      page: pageNo
    });
    try {

      const list = await StepRequest(`messages?${params}`);
      console.log("list", JSON.stringify(list));
      this.setState({
        list: list.data,
        last_page: list.last_page,
        screenLoading: false,
        listLoading: false
      });
    } catch (error) {
      Alert.alert(error.message);
      this.setState({ screenLoading: false, listLoading: false });
    }
  }

  refreshChatList() {
    this.setState({ pageNo: 1, listLoading: true }, () => this.loadMessages());
  }
  render() {
    const { separatorStyle, container, emptyImageStyle } = styles;
    const { navigation } = this.props;
    const { screenLoading, pageNo, last_page, list, listLoading } = this.state;
    const noConverstaions = list.length == 0;
    const ReachedEnd = pageNo == last_page;

    return (
      <Container loading={screenLoading}>
        {noConverstaions ? (
          <EmptyScreen
            title={strings.noConversations}
            image={icons.emptyNoMsg}
            imageStyle={emptyImageStyle}
            onPress={() =>
              this.setState({ screenLoading: true }, () =>
                this.refreshChatList()
              )
            }
          />
        ) : (
          <View style={container}>
            <FlatList
              onRefresh={() => this.refreshChatList()}
              refreshing={listLoading}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                !ReachedEnd && this.setState({ pageNo: pageNo + 1 }),
                  () => this.loadMessages();
              }}
              data={list}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: vScale(70) }}
              ItemSeparatorComponent={() => <View style={separatorStyle} />}
              renderItem={({ item, index }) => {
                const { second } = item;
                return (
                  <MessageCard
                    onPress={() =>
                      navigation.navigate("Chat", {
                        receiver_id: second.id,
                        avatar: second.avatar,
                        task_id: item.request_id
                      })
                    }
                    item={item}
                  />
                );
              }}
            />
          </View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: hScale(354.2),
    borderRadius: hScale(5),
    marginTop: vScale(10.6),
    backgroundColor: colors.white,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    elevation: 10
  },
  separatorStyle: {
    width: hScale(339.3),
    height: vScale(0.5),
    backgroundColor: colors.mainConBack,
    alignSelf: "center"
  },
  emptyImageStyle: {
    width: hScale(56),
    height: vScale(44)
  }
});

export const Messages = connect(MessagesScreen);
