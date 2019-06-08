import React from "react";

import { View, StyleSheet, ActivityIndicator } from "react-native";
import { COLOR_TEXT } from "../../utils/colors";

export const Loading = props => {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color={COLOR_TEXT} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});
