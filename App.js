console.disableYellowBox = true;

import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  createBottomTabNavigator
} from "react-navigation";

import React from "react";
import { Platform, StatusBar } from "react-native";
import { FontAwesome } from "react-native-vector-icons";
import { BUTTON_COLOR_TWO, BUTTON_COLOR_ONE } from "./utils/colors";

// Screens Import

import Home from "./src/screens/Home";
import Auth from "./src/screens/Auth";
import SplashScreen from "./src/screens/SplashScreen";
import Trophy from "./src/screens/Trophy";
import Play from "./src/screens/Play";

const SignedOut = createStackNavigator({
  Auth: Auth
});

const SignedIn = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="home" size={30} color={tintColor} />
        )
      }
    },
    Trophy: {
      screen: Trophy,
      navigationOptions: {
        tabBarLabel: "Trophy",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="user" size={30} color={tintColor} />
        )
      }
    }
  },
  {
    initialRouteName: "Home",
    tabBarPosition: "bottom",
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: "#487eb0",
      inactiveTintColor: "grey",
      showLabel: true,
      style: {
        borderTopWidth: 0,
        paddingTop: 3,
        paddingBottom: 4,
        height: 60,
        shadowColor: "black",
        shadowOpacity: 0.1,
        shadowRadius: 20,
        backgroundColor: "black",
        shadowOffset: { width: 0, height: 0 }
      }
    }
  }
);

const AuthLoading = createStackNavigator({
  SplashScreen: {
    screen: SplashScreen
  }
});

export default createAppContainer(
  createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      Play: Play,
      SignedOut: {
        screen: SignedOut
      },
      AuthLoading
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
