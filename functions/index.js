'use strict';

const axios = require('axios');
const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');

const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'search lyrics'.
app.intent('search lyrics', (conv, {lyricpreface}) => {
  const splitByLyricPreface = conv.query.split(lyricpreface);
  const lyrics = splitByLyricPreface[1];

  const headers = {
    Authorization: `Bearer ${functions.config().geniusapi.key}`,
  };

  return axios
    .get(`https://api.genius.com/search?q=${lyrics}`, {
      headers: headers,
    })
    .then((res) => {
      const song = res.data.response.hits[0].result.full_title;
      conv.close(song);
    })
    .catch((err) => {
      // conv.json(err);
      conv.close('yikes');
    });
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
