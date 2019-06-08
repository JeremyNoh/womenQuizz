import React from "react";

import {
  StyleSheet,
  Image,
  TouchableOpacity,
  AsyncStorage
} from "react-native";

// Libs Extenal
import { Header } from "react-native-elements";

// Internal Component
import { BUTTON_COLOR_ONE } from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";
import Icon from "react-native-vector-icons/FontAwesome";

class Home extends React.Component {
  componentDidMount() {
    // this.props.navigation.navigate("Play");
  }

  render() {
    return (
      <>
        <Header
          backgroundColor={BUTTON_COLOR_ONE}
          centerComponent={{
            text: `Home`,
            style: { color: "#fff", fontWeight: "bold", fontSize: 20 }
          }}
          rightComponent={{
            icon: "people",
            color: "#fff",
            onPress: () => {
              this.props.navigation.navigate("SignedOut"), AsyncStorage.clear();
            }
          }}
        />
        <Container>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Play")}
          >
            <Title title="Jouer" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Play")}
          >
            <Image
              style={{
                marginTop: 20,
                width: 270,
                height: 270,
                borderColor: "black",
                borderRadius: 140,
                borderWidth: 1,
                backgroundColor: BUTTON_COLOR_ONE
              }}
              source={require("../../assets/search.png")}
            />
          </TouchableOpacity>
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({});

export default Home;
