import React, { Component } from "react";
import { StyleSheet, Image, FlatList, View, Text } from "react-native";
import { WalletCard, Container, BackButton } from "../components";
import { StepRequest } from "step-api-client";
import { whiteHeaderOptions } from "../navigation/options";
import { icons, fonts } from "../assets";
import { strings } from "../strings";
import { hScale, vScale, fScale } from "step-scale";
import { connect } from "step-react-redux";
import { actions } from "../helpers";
import { colors } from "../constants";

export class TransactionsScreen extends Component {
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
          title={strings.transactions}
        />
      )
    };
  };
  componentDidMount() {
    this.getTransactions();
  }
  async getTransactions() {
    try {
      const data = await StepRequest("transactions");
      await actions.refreshWalletBalance();
      this.setState({ data, screenLoading: false, listLoading: false });
      console.warn("data", data);
    } catch (error) {
      Alert.alert(error.message);
      this.props.navigation.goBack();
    }
  }
  refreshTransactions() {
    this.setState({ listLoading: true }, () => this.getTransactions());
  }
  render() {
    const {
      contentContainerStyle,
      tranasctionsContainer,
      textStyle,
      walletTextStyle
    } = styles;
    const { screenLoading, data, listLoading } = this.state;
    const { userWallet } = this.props;
    const isPositive = userWallet < 0;
    return (
      <Container loading={screenLoading} style={{ alignItems: "stretch" }}>
        <FlatList
          onRefresh={() => this.refreshTransactions()}
          refreshing={listLoading}
          data={data}
          extraData={this.state}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return <WalletCard item={item} />;
          }}
          ListHeaderComponent={() => (
            <View
              style={[
                tranasctionsContainer,
                isPositive && { backgroundColor: colors.red }
              ]}
            >
              <Text style={textStyle}>
                {strings.totalBalance}
                {": "}
              </Text>
              <Text style={walletTextStyle}>{userWallet}</Text>
            </View>
          )}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  avatarStyle: {
    width: hScale(24.3),
    height: hScale(24.3),
    borderRadius: hScale(12.15),
    marginEnd: hScale(40.7)
  },
  contentContainerStyle: {
    marginVertical: vScale(10),
    alignItems: "center"
  },
  tranasctionsContainer: {
    width: hScale(350.6),
    height: vScale(76.7),
    borderRadius: hScale(5),
    flexDirection: "row",
    paddingHorizontal: hScale(10),
    alignItems: "center",
    backgroundColor: colors.second,
    shadowColor: "rgba(0, 0, 0, 0.23)",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: hScale(7),
    shadowOpacity: 1,
    marginBottom: vScale(10),
    elevation: 10
  },
  textStyle: {
    fontSize: fScale(17),
    color: colors.white,
    fontFamily: fonts.arial
  },
  walletTextStyle: {
    fontSize: fScale(17),
    color: colors.white,
    fontFamily: fonts.arial,
    flex: 1,
    textAlign: "center"
  }
});

export const Transactions = connect(TransactionsScreen);
