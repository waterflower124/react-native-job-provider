import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View, Alert } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import {
  Container,
  MainCard,
  EmptyScreen,
  CreditBalance,
  DrawerIcon,
  HeaderLogo
} from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { fonts, icons } from "../assets";
import { StepRequest } from "step-api-client";

export class NewTasks extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      refreshTasks: () => this.refreshTasks()
    });
  }
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderLogo />,
    headerRight: (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CreditBalance onPress={() => navigation.navigate("Transactions")} />
        <DrawerIcon onPress={() => navigation.openDrawer()} />
      </View>
    )
  });
  state = { screenLoading: true, data: [], listLoading: false };
  async componentDidUpdate(prevProps) {
    const { navigation } = this.props;
    const oldRefresh = prevProps.navigation.getParam("refresh");
    const newRefresh = navigation.getParam("refresh");
    if (newRefresh && newRefresh != oldRefresh) {
      await navigation.setParams({
        refresh: false
      });
      this.refreshTasks();
    }
  }
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    try {
      const data = await StepRequest("new-tasks");
      this.setState({ data, screenLoading: false, listLoading: false });
      console.warn("tasks", data);
    } catch (error) {
      this.setState({ screenLoading: false, listLoading: false });
      Alert.alert(error.message);
    }
  }

  refreshTasks() {
    this.setState({ listLoading: true }, () => this.loadData());
  }

  render() {
    const { container, textStyle, secTitleStyle, noTasksImageStyle } = styles;
    const { screenLoading, data, listLoading } = this.state;
    const { navigation } = this.props;
    const noTasks = data.length == 0;
    return (
      <Container loading={screenLoading} gradientHeader style={container}>
        <Text style={textStyle}>{strings.newTasks}</Text>
        <Text style={[textStyle, secTitleStyle]}>
          {strings.chooseServiceAndLetsStart}
        </Text>
        {noTasks ? (
          <EmptyScreen
            title={strings.noTasks}
            image={icons.emptyNoTasks}
            imageStyle={noTasksImageStyle}
            onPress={() =>
              this.setState({ screenLoading: true }, () => this.refreshTasks())
            }
          />
        ) : (
          <FlatList
            onRefresh={() => this.refreshTasks()}
            refreshing={listLoading}
            data={data}
            extraData={this.state}
            contentContainerStyle={{ alignItems: "center" }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const { id } = item;
              return (
                <MainCard
                  onPress={() => navigation.navigate("AddOffer", { item, id })}
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
    paddingTop: vScale(97.5),
    paddingBottom: vScale(68),
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
  noTasksImageStyle: {
    width: hScale(38.4),
    height: hScale(38.4)
  }
});
