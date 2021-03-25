const fetch = require("node-fetch");

exports.getData = async function (next) {
  console.log("hello from the service method");

  return fetch("http://localhost:8080/api/games")
    .then((response) => response.json())
    .then((data) => {
      next(data);
    });
};
