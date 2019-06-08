import React from "react";

import { View, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
export const Form = props => {
  return (
    <Card title={props.title}>
      <View style={styles.containerCardEdit} {...props} />
    </Card>
  );
};

const styles = StyleSheet.create({
  containerCardEdit: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Form;

//
