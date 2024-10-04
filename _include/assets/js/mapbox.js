const ACCESS_TOKEN =
  "pk.eyJ1IjoiYm9kdXN0cmllcyIsImEiOiJjbDN5dWo5c2UwNjFzM2Rydmthb3lmMnk0In0.QFskVVZgbv3thIfeTWrBvQ";

const script = document.getElementById("search-js");
script.onload = () => {
  const collection = mapboxsearch.autofill({
    accessToken: ACCESS_TOKEN
  });

};




