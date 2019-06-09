import React, { Component } from "react";

import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  AsyncStorage,
  Image
} from "react-native";

// Internal Component
import { BUTTON_COLOR_ONE } from "../../utils/colors";
import Title from "../components/Title";

import { Loading } from "../components/Loading";

// Libs Extenal
import Icon from "react-native-vector-icons/FontAwesome";

import { Button, Overlay, Header } from "react-native-elements";
import * as Progress from "react-native-progress";
import Toast, { DURATION } from "react-native-easy-toast";

import { getAllWomen } from "../../api/women";
import Container from "../components/Container";
import { getInfoUser } from "../../api/auth";
import { updateScoreUser } from "../../api/user";
import { shuffleArray } from "../../utils/functionNative";
const NBR_QUESTION_IN_QUIZZ = 7;

export default class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizArr: [],
      numberQuestion: 0,
      goodAnswser: 0,
      gameFinish: false,
      gameStop: false,
      life: [true, true, true]
    };
  }

  async componentDidMount() {
    this.fetchQuestions();

    const infoUserJSON = await AsyncStorage.getItem("infoUser");
    let info = JSON.parse(infoUserJSON);

    getInfoUser(info.id)
      .then(val => {
        let infoUser = val.value;
        this.setState({ infoUser }, () => {});
      })
      .catch(val => {
        alert(val);
      });
  }

  // enlève dans la Questions le nom ou Prenom de la Femme
  _formatDescription = (description, name) => {
    let regex = new RegExp(name, "gi");
    let newStr = description;
    if (description.includes(name)) {
      newStr = description.replace(regex, "she");
    }

    let arr = name.split(" ");
    arr.forEach(value => {
      let rege = new RegExp(value, "gi");
      newStr = newStr.replace(rege, "she");
    });
    return newStr;
  };

  // mets en forme le Questionnaire
  fetchQuestions = () => {
    let res;
    getAllWomen()
      .then(val => {
        res = shuffleArray(val.women);
        let questions = [];

        for (let index = 0; index < NBR_QUESTION_IN_QUIZZ; index++) {
          let obj = {
            question: this._formatDescription(
              res[index].description,
              res[index].name
            ),
            id: res[index].id,
            correct_answer: res[index].name,
            incorrect_answers: [
              res[Math.floor(Math.random() * res.length)].name,
              res[Math.floor(Math.random() * res.length)].name,
              res[Math.floor(Math.random() * res.length)].name
            ]
          };

          questions.push(obj);
        }
        this.setState({ quizArr: questions });
      })
      .catch(val => {
        this.setState({ women: null });

        alert(val);
      });
  };

  // retire une vie du Player
  takeAlife = () => {
    let { life } = this.state;

    if (life.includes(true)) {
      let index = life.lastIndexOf(true);

      life[index] = false;
    } else {
      this.setState({ gameStop: true });
    }

    this.setState({ life });
  };

  // ajoute une card WOmen dans le deck du Player
  sendScore = () => {
    let { quizArr, infoUser } = this.state;
    let id = quizArr[Math.floor(Math.random() * quizArr.length)].id;

    let women;
    let isOk = true;
    if (infoUser.women === undefined) {
      women = [id];
    } else {
      let deck = JSON.parse(infoUser.women);
      let nbr = 0;
      while (deck.includes(id)) {
        id = quizArr[Math.floor(Math.random() * quizArr.length)].id;
        nbr++;

        if (nbr > deck.length) {
          isOk = false;
          break;
        }
      }

      women = [...deck, id];
    }

    if (isOk) {
      infoUser.women = JSON.stringify(women);
      updateScoreUser(infoUser.id, infoUser)
        .then(val => {})
        .catch(val => {
          alert(val);
        });
    }
  };

  next(correctAnswer, indexValue, lengthQuizz) {
    let { goodAnswser, numberQuestion } = this.state;

    // rajoute une bonne Réponse
    correctAnswer === indexValue &&
      this.setState({ goodAnswser: 1 + goodAnswser });

    // retire une vie du PLayer
    correctAnswer !== indexValue && this.takeAlife();

    // affiche le popup Good | bad Answer
    correctAnswer === indexValue
      ? this.refs.good.show("Good Answer", 300)
      : this.refs.bad.show("Bad Answer", 300);

    this.setState({ numberQuestion: 1 + numberQuestion });
    if (numberQuestion === lengthQuizz) {
      this.sendScore();
      this.setState({
        gameFinish: true
      });
    }
  }

  _noData = () => {
    return <Title title="No data sorry " />;
  };

  gameLost = () => {
    let { gameStop, goodAnswser, numberQuestion } = this.state;
    return (
      <Overlay
        isVisible={gameStop}
        overlayBackgroundColor="white"
        overlayStyle={{}}
        onBackdropPress={() => this.props.navigation.navigate("Home")}
      >
        <Container>
          <Title
            title="Tu as perdu"
            style={{ color: "rgba(255, 0, 0, 0.5)" }}
          />
          <Image
            style={{
              width: 100,
              height: 100,
              margin: 10
            }}
            source={require("../../assets/sad.png")}
          />
          <Text style={{ margin: 10, fontSize: 15, marginBottom: 30 }}>
            tu as un score de : {goodAnswser} sur {numberQuestion}
          </Text>
          <Button
            title="Revenir à l'accueil "
            onPress={() => this.props.navigation.navigate("Home")}
          />
        </Container>
      </Overlay>
    );
  };
  render() {
    const { quizArr, numberQuestion, gameFinish, goodAnswser } = this.state;

    if (quizArr === undefined) {
      return <Loading />;
    } else if (quizArr === null) {
      return (
        <View style={[styles.container, styles.containerView]}>
          {this._noData()}
        </View>
      );
    }

    return (
      <>
        <Header backgroundColor="#252C4A" />
        <View
          style={{
            backgroundColor: "#252C4A",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          {this.state.life.map((val, index) => {
            return (
              <Image
                key={index}
                style={{
                  width: 30,
                  height: 30,
                  margin: 10
                }}
                source={
                  val === true
                    ? require("../../assets/like.png")
                    : require("../../assets/likeEmpty.png")
                }
              />
            );
          })}
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
            backgroundColor: "#252C4A"
          }}
        >
          {quizArr &&
            quizArr.map((element, index) => {
              let arr = [...element.incorrect_answers];
              let random = Math.floor(Math.random() * 2 - 1 + 1);
              arr.splice(random, 0, element.correct_answer);
              arr = shuffleArray(arr);

              return (
                index === numberQuestion && (
                  <View key={index} style={styles.container}>
                    <Text
                      style={{
                        backgroundColor: "white",
                        padding: 8,
                        marginBottom: 10,
                        width: "40%",
                        fontSize: 17,
                        color: "black",
                        fontWeight: "bold",
                        borderRadius: 10,
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center"
                      }}
                    >
                      Question # {index + 1}
                    </Text>

                    <Text style={styles.quizQ}>{element.question}</Text>
                    {arr.map((b, n) => {
                      return (
                        <TouchableOpacity
                          key={n}
                          onPress={() =>
                            this.next(
                              element.correct_answer,
                              b,
                              quizArr.length - 1
                            )
                          }
                          style={styles.nxtBtn}
                        >
                          <Text style={styles.btnTxt}>{b}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )
              );
            })}
          <Toast
            ref="good"
            position="top"
            style={{ backgroundColor: "rgba(34, 139, 34, 0.5)" }}
          />
          <Toast
            ref="bad"
            position="top"
            style={{ backgroundColor: "rgba(255,0,0, 0.5)" }}
          />
          <Overlay
            isVisible={gameFinish}
            overlayBackgroundColor="white"
            overlayStyle={{}}
            onBackdropPress={() => this.props.navigation.navigate("Home")}
          >
            <Container>
              <Title
                title="Félicitations"
                style={{ color: "rgba(34, 139, 34, 0.5)" }}
              />
              <Image
                style={{
                  width: 100,
                  height: 100,
                  margin: 10
                }}
                source={require("../../assets/happy.png")}
              />
              <Text style={{ margin: 5, fontSize: 15, marginBottom: 30 }}>
                Tu as débloqué un Trophé va vite voir ton deck
              </Text>
              <Button
                title="Revenir à l'accueil "
                onPress={() => this.props.navigation.navigate("Home")}
              />
            </Container>
          </Overlay>
          {this.gameLost()}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 15,
    margin: 10
  },
  quizQ: {
    // backgroundColor: "white",
    color: "white",
    padding: 10,
    fontSize: 17,
    fontWeight: "400",
    borderRadius: 10,
    fontWeight: "bold",
    marginBottom: 30
  },
  options: {
    margin: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingStart: 20,
    paddingEnd: 20
  },
  nxtBtn: {
    width: "auto",
    padding: 12,
    // backgroundColor: "white",
    justifyContent: "flex-start",
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BUTTON_COLOR_ONE
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white"
  }
});
