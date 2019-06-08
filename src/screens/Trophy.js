import React from "react";

import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";

// Libs Extenal
import { Button, Overlay, Header } from "react-native-elements";

// Internal Component
import { BUTTON_COLOR_ONE } from "../../utils/colors";
import Container from "../components/Container";
import Title from "../components/Title";

import { Loading } from "../components/Loading";
import { getInfoUser } from "../../api/auth";
import { getAllWomen } from "../../api/women";

class Trophy extends React.Component {
  state = {
    infoUser: undefined,
    deck: undefined,
    women: undefined,
    detailWoman: false,
    idDetail: undefined
  };

  async componentDidMount() {
    this.fetchQuestions();
    const infoUserJSON = await AsyncStorage.getItem("infoUser");
    let info = JSON.parse(infoUserJSON);

    getInfoUser(info.id)
      .then(val => {
        let infoUser = val.value;
        let deck = [];

        if (infoUser.women !== undefined) {
          deck = infoUser.women.split("-");
          deck = deck.map(function(x) {
            return parseInt(x, 10);
          });
        }

        this.setState({ infoUser, deck });
      })
      .catch(val => {
        alert(val);
      });
  }

  contentModal = () => {
    let { women, idDetail } = this.state;
    if (idDetail) {
      let [element] = women.filter(val => val.id === idDetail);
      return (
        <Container>
          <Image
            style={{
              width: 100,
              height: 100,
              margin: 10,
              borderColor: "black",
              borderWidth: 1
            }}
            source={require("../../assets/femaleFound.png")}
          />
          <Title title={element.name} style={{ color: BUTTON_COLOR_ONE }} />
          <Text style={{ margin: 10 }}>{element.description}</Text>
          <Button
            title="Exit"
            onPress={() =>
              this.setState({ detailWoman: false, idDetail: undefined })
            }
          />
        </Container>
      );
    }
  };

  fetchQuestions = () => {
    this.setState({ loading: true });

    let res;

    getAllWomen()
      .then(val => {
        res = val.women;
        this.setState({ women: res });
      })
      .catch(val => {
        this.setState({ women: null });
        alert(val);
      });
  };

  _noData = () => {
    return <Title title="No data sorry " />;
  };

  render() {
    const { infoUser, women, deck, detailWoman } = this.state;

    if (infoUser === undefined) {
      return <Loading />;
    } else if (infoUser === null) {
      return (
        <View style={[styles.container, styles.containerView]}>
          {this._noData()}
        </View>
      );
    }

    return (
      <>
        <Header
          backgroundColor={BUTTON_COLOR_ONE}
          centerComponent={{
            text: `Trophy`,
            style: { color: "#fff", fontWeight: "bold", fontSize: 20 }
          }}
        />
        <Container
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center"
          }}
        >
          <Title title={deck.length + " / " + women.length} />
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",

                justifyContent: "center"
              }}
            >
              {women.map((element, index) => {
                if (deck.includes(element.id)) {
                  return (
                    // <Image
                    //   key={index}
                    //   style={{
                    //     width: 100,
                    //     height: 100,
                    //     margin: 10,
                    //     borderColor: "black",
                    //     borderWidth: 1
                    //   }}
                    //   source={{
                    //     uri: element.img
                    //   }}
                    // />
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        this.setState({
                          detailWoman: true,
                          idDetail: element.id
                        })
                      }
                    >
                      <Image
                        key={index}
                        style={{
                          width: 100,
                          height: 100,
                          margin: 10,
                          borderColor: "black",
                          borderWidth: 1
                        }}
                        source={require("../../assets/femaleFound.png")}
                      />
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <Image
                      key={index}
                      style={{
                        width: 100,
                        height: 100,
                        margin: 10,
                        borderColor: "black",
                        borderWidth: 1
                      }}
                      source={require("../../assets/female.png")}
                    />
                  );
                }
              })}
            </View>
          </ScrollView>
          {this.state.idDetail !== undefined && (
            <Overlay
              isVisible={detailWoman}
              windowBackgroundColor="rgba(255, 255, 255, .5)"
              overlayBackgroundColor="white"
              onBackdropPress={() =>
                this.setState({ detailWoman: false, idDetail: undefined })
              }
            >
              {this.contentModal()}
            </Overlay>
          )}
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({});

export default Trophy;
