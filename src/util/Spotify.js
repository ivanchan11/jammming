import { nullLiteral } from "@babel/types";

const clientID = '70d8c0fa07b247658c7b1f90895c12e2';
const redirectURI = 'https://far-flung-smoke.surge.sh';
let accessToken;
let expiresIn;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    else {
      let url = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = url;
      return null;
    }
  },

  search(term) {
    const accessToken  = this.getAccessToken();
    if (accessToken === null) { throw "Spotify accessToken not set"};
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json()
    }).then(jsonResponse => {
      const tracks = jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
      return tracks
    });
  },

  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris) {
      return
    }

    const accessToken = this.getAccessToken();
    const headers = { Authorization: 'Bearer ' + accessToken };
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers: headers }).then(response => {return response.json()}).then(
      jsonResponse => {
        let userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ name: playlistName })
        }).then(response => response.json()).then(jsonResponse => {
          let playlistID = jsonResponse.id;
          fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ uris: trackUris })
          })
        })
      }
    )
  }
}

export default Spotify;
