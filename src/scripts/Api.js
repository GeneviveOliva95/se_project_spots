class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "4a4150e0-1b5c-48df-a744-8115870883ef",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
