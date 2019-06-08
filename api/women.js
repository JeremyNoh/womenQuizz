export const getAllWomen = () => {
  return new Promise((resolve, reject) => {
    fetch("https://women-of-history-api.herokuapp.com/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
