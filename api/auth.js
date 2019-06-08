import { LOGIN, BASE_URL, REGISTER, USER } from "../endpoint";
import firebase from "firebase";

export const loginUser = async (email, password) => {
  console.log("email ", email);

  try {
    const value = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    // console.log(value.user.stsTokenManager.expirationTime);
    console.log(value.user);
    let data = {
      email: value.user.email,
      token: value.user.lastLoginAt,
      id: value.user.uid,
      success: true
    };
    return { data };
  } catch (err) {
    console.log(err);
    let data = {
      errorCode: err.code,
      errorMessage: err.message,
      success: false
    };
    return { data };
  }
};

export const registerUser = async (email, password) => {
  try {
    const value = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    let data = {
      email: value.user.email,
      token: value.user.lastLoginAt,
      id: value.user.uid,
      success: true
    };

    return { data };
  } catch (err) {
    let data = {
      errorCode: err.code,
      errorMessage: err.message,
      success: false
    };
    return { data };
  }
};

export const addUserInDatabase = async data => {
  let { id } = data;
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(USER + id)
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

export const getInfoUser = token => {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(USER + token)
      .once("value")
      .then(function(snapshot) {
        let data = {
          value: snapshot.val(),
          success: true
        };
        resolve(data);
      })
      .catch(error => {
        let data = {
          errorCode: "Something was wrong Contact Admin pls ",
          success: false
        };
        reject(data.errorCode);
      });
  });
};

export const signOut = () => {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        let data = {
          success: true
        };
        resolve(data);
        // Sign-out successful.
      })
      .catch(error => {
        let data = {
          errorCode: "Something was wrong Contact Admin pls ",
          success: false
        };
        reject(data.errorCode);
        // An error happened.
      });
  });
};

export const resetPassword = () => {
  var auth = firebase.auth();
  var emailAddress = "user@example.com";

  auth
    .sendPasswordResetEmail(emailAddress)
    .then(function() {
      // Email sent.
    })
    .catch(function(error) {
      // An error happened.
    });
};

export const deleteUser = () => {
  var user = firebase.auth().currentUser;

  return new Promise((resolve, reject) => {
    user
      .auth()
      .delete()
      .then(() => {
        let data = {
          success: true
        };
        resolve(data);
        // Sign-out successful.
      })
      .catch(error => {
        let data = {
          errorCode: "Something was wrong Contact Admin pls ",
          success: false
        };
        reject(data.errorCode);
        // An error happened.
      });
  });
};

// POST REGISTER USER
export const registerUserAncien = user => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + REGISTER, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        nickname: user.username,
        password: user.password,
        password_confirmation: user.confirmPassword
      })
    })
      .then(response => {
        if (!response.ok) {
          reject("nulll");
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject("nulll");
      });
  });
};

// POST FOR CONNECT USER
export const connecteUser = user => {
  return new Promise((resolve, reject) => {
    fetch(BASE_URL + LOGIN, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password
      })
    })
      .then(response => {
        // if (!response.ok) {
        //   reject("erreur");
        // }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
};
