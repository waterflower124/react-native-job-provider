import React, { Component } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fScale, hScale, vScale } from "step-scale";
import { icons, fonts } from "../assets";
import {
  ChatIcon,
  Container,
  DrawerIcon,
  ServiceCard,
  EmptyScreen,
  HeaderLogo
} from "../components";
import { colors } from "../constants";
import { strings } from "../strings";
import { connect } from "step-react-redux";

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderLogo />,
    headerRight: (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ChatIcon onPress={() => navigation.navigate("Messages")} />
        <DrawerIcon onPress={() => navigation.openDrawer()} />
      </View>
    )
  });
  componentDidMount() {}
  render() {
    const { textStyle, secTitleStyle, container, emptyImageStyle } = styles;
    const { navigation, categories } = this.props;
    const noCategories = categories.length == 0;
    return (
      <Container gradientHeader style={container}>
        <Text style={[textStyle, { marginTop: vScale(10.6) }]}>
          {strings.homeService}
        </Text>
        <Text style={[textStyle, secTitleStyle]}>
          {strings.chooseServiceAndLetsStart}
        </Text>
        {noCategories ? (
          <EmptyScreen
            title={strings.noCategory}
            image={icons.emptyNoCat}
            imageStyle={emptyImageStyle}
          />
        ) : (
          <FlatList
            data={categories}
            numColumns={3}
            columnWrapperStyle={{
              alignItems: "center",
              justifyContent: "space-around"
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ServiceCard
                onPress={() =>
                  navigation.navigate("NewRequest", { category_id: item.id })
                }
                item={item}
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
    paddingTop: vScale(79.5),
    paddingBottom: vScale(64)
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
    // marginBottom: vScale(87.3),
    fontFamily: fonts.arial,
    textShadowColor: "rgba(0, 0, 0, 0.06)",
    textShadowOffset: {
      width: 0,
      height: vScale(1)
    },
    textShadowRadius: 0
  },
  emptyImageStyle: {
    width: hScale(47.5),
    height: vScale(58)
  }
});

export const Home = connect(HomeScreen);
