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
import AsyncStorage from '@react-native-community/async-storage';
import { EventRegister } from 'react-native-event-listeners';
import global from '../global/global';

export class YourTasks extends Component {
  constructor(props) {
    super(props);

    this.props.navigation.setOptions({
      headerLeft: () => <HeaderLogo />,
      headerRight: () =>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CreditBalance  onPress={()=> this.props.navigation.navigate('Transactions')} />
          <DrawerIcon onPress={() => this.props.navigation.openDrawer()} />
        </View>
    })

    this.props.navigation.setParams({
      refreshTasks: () => this.refreshTasks()
    });
  }
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderLogo />,
    headerRight: (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CreditBalance  onPress={()=>navigation.navigate('Transactions')} />
        <DrawerIcon onPress={() => navigation.openDrawer()} />
      </View>
    )
  });
  state = { data: [], screenLoading: true, listLoading: false };

  async componentDidUpdate(prevProps) {
    const { navigation } = this.props;
    // const oldRefresh = prevProps.navigation.getParam("refresh");
    // const newRefresh = navigation.getParam("refresh");
    const oldRefresh = prevProps.route.refresh;
    const newRefresh = this.props.route.params.refresh;
    if (newRefresh && newRefresh != oldRefresh) {
      await navigation.setParams({
        refresh: false
      });
      this.refreshTasks();
    }
  }

  componentDidMount() {
    // this.loadData();

    this.forcusListener = this.props.navigation.addListener('focus', () => {
      this.refreshTasks();
    });

    this.notiListener = EventRegister.addEventListener(global.NOTI_OFFER_ACCEPT, (data) => {
      this.refreshTasks();
    })
    this.notiRequestResetListener = EventRegister.addEventListener(global.NOTI_REQUEST_RESET, (data) => {
      this.refreshTasks();
    })
  }

  componentWillUnmount() {
    this.forcusListener();
    EventRegister.removeEventListener(this.notiListener);
    EventRegister.removeEventListener(this.notiRequestResetListener);
  }

  async loadData() {
    const userToken = await AsyncStorage.getItem("userToken");
    if(userToken == null || userToken == "") {
      this.setState({
        screenLoading: false,
        listLoading: false
      });
      return;
    }

    try {
      const data = await StepRequest("my-tasks");
      this.setState({ data, screenLoading: false, listLoading: false });
      console.warn("yourTasks", data);
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
    const { navigation } = this.props;
    const { data, screenLoading, listLoading } = this.state;
    const noTasks = data.length == 0;
    return (
      <Container loading={screenLoading} gradientHeader style={container}>
        <Text style={textStyle}>{strings.yourTasks}</Text>
        <Text style={[textStyle, secTitleStyle]}>{strings.chooseService}</Text>
        {noTasks ? (
          <EmptyScreen
            title={strings.dontHaveTasks}
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
              const { client, id } = item;
              return (
                <MainCard
                  onPress={() => navigation.navigate("TaskDetails", { id })}
                  onPressChat={() =>
                    navigation.navigate("Chat", {
                      receiver_id: client.id,
                      avatar: client.avatar,
                      task_id: id
                    })
                  }
                  isTask
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
