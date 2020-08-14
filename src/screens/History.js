import React, { Component } from "react";
import { FlatList, Image, StyleSheet, Alert } from "react-native";
import { hScale, vScale } from "step-scale";
import { BackButton, Container, MainCard, EmptyScreen } from "../components";
import { strings } from "../strings";
import { icons } from "../assets";
import { connect } from "step-react-redux";
import { whiteHeaderOptions } from "../navigation/options";
import { StepRequest } from "step-api-client";

class HistoryScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation, user } = this.props;
    navigation.setParams({
      avatar: user.data.avatar
    });
  }

  state = { screenLoading: true, data: [], listLoading: false };
  static navigationOptions = ({ navigation }) => {
    const avatar = navigation.getParam("avatar", null);
    return {
      ...whiteHeaderOptions,
      headerRight: (
        <Image
          source={avatar ? { uri: avatar } : icons.userPlaceholder}
          resizeMode={"cover"}
          style={styles.avatarStyle}
        />
      ),
      headerLeft: (
        <BackButton
          backWithTitle
          onPress={() => navigation.goBack()}
          title={strings.history}
        />
      )
    };
  };

  componentDidMount() {
    this.loadMyHistory();
  }

  async loadMyHistory() {
    const { navigation } = this.props;
    try {
      const data = await StepRequest("order-history");
      this.setState({ data, screenLoading: false, listLoading: false });
      console.warn("data", data);
    } catch (error) {
      this.setState({ screenLoading: false, listLoading: false });
      navigation.goBack();
      Alert.alert(error.message);
    }
  }

  refreshHistory() {
    this.setState({ listLoading: true }, () => this.loadMyHistory());
  }

  render() {
    const { container, contentContainer, noHistoryImageStyle } = styles;
    const { screenLoading, data, listLoading } = this.state;
    const noHistory = data.length == 0;
    const { user } = this.props;
    return (
      <Container loading={screenLoading} style={container}>
        {noHistory ? (
          <EmptyScreen
            title={strings.noHistory}
            image={icons.emptyNoRequestsHistory}
            imageStyle={noHistoryImageStyle}
            onPress={() =>
              this.setState({ screenLoading: true }, () =>
                this.refreshHistory()
              )
            }
          />
        ) : (
          <FlatList
            onRefresh={() => this.refreshHistory()}
            refreshing={listLoading}
            data={data}
            extraData={this.state}
            contentContainerStyle={contentContainer}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <MainCard
                  currentUserType={user.data.type}
                  isHistory
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
    paddingTop: vScale(10),
    alignItems: "stretch"
  },
  contentContainer: {
    alignItems: "center",
    marginTop: vScale(10),
    paddingBottom: vScale(10)
  },
  avatarStyle: {
    width: hScale(24.3),
    height: hScale(24.3),
    borderRadius: hScale(12.15),
    marginEnd: hScale(40.7)
  },
  noHistoryImageStyle: {
    width: hScale(64),
    height: vScale(60.8)
  }
});

//

export const History = connect(HistoryScreen);
