import firebase from "firebase";
import { USER } from "../endpoint";

export const updateScoreUser = async (idUser, data) => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(USER + idUser)
      .update(data, function(error) {
        if (error) {
          let data = {
            errorCode: "probleme Recommencer svp ",
            success: false
          };
          reject("probleme Recommencer svp ");
        } else {
          let data = {
            success: true
          };
          resolve(data);
        }
      });
  });
};
