'use strict';

const axios = require('axios');
const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');

const context = {
  LYRICS: 'lyrics',
  TITLE: 'title',
  ARTIST: 'artist',
};

const app = dialogflow({debug: true});

const checkSong = (conv, lyrics, index) => {
  const headers = {
    Authorization: `Bearer ${functions.config().geniusapi.key}`,
  };
  context['LYRICS'] = lyrics;

  return axios
    .get(`https://api.genius.com/search?q=${lyrics}`, {
      headers: headers,
    })
    .then((res) => {
      const title = res.data.response.hits[index].result.title;
      const artist = res.data.response.hits[index].result.primary_artist.name;
      context['TITLE'] = title;
      context['ARTIST'] = artist;
      conv.ask(`Are you thinking of the song ${title} by ${artist}?`);
    })
    .catch((err) => {
      conv.close('yikes');
    });
};

const handleCorrectSong = (conv) => {
  const artist = context['ARTIST'];
  conv.close(
    `Glad we figured that out! I love ${artist}. You can ask the Google Assistant directly if you'd like to listen to them now.`
  );
};

app.intent('check first song', (conv, {lyricpreface}) => {
  const splitByLyricPreface = conv.query.split(lyricpreface);
  const lyrics = splitByLyricPreface[1];
  return checkSong(conv, lyrics, 0);
});

app.intent('first song matches', (conv) => {
  conv.followup('correct-song-identified', {}, 'en-US');
});

app.intent('check second song', (conv) => {
  const lyrics = context['LYRICS'];
  return checkSong(conv, lyrics, 1);
});

app.intent('check second song - yes', (conv) => triggerCorrectSongIntent(conv));

app.intent('check third song', (conv) => {
  const lyrics = context['LYRICS'];
  return checkSong(conv, lyrics, 2);
});

app.intent('check third song - yes', (conv) => triggerCorrectSongIntent(conv));

app.intent('correct song identified', (conv) => handleCorrectSong(conv));

app.intent('cannot identify song', (conv) => {
  conv.close('I don\'t know that one. Any chance you made it up?');
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
