let accessToken;
let expiresIn;
const clientId = '70d8c0fa07b247658c7b1f90895c12e2';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if(accessToken){
      return accessToken
    } else if (window.location.href.match(/access_token=([^&]*)/) !=null) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expiresIn *1000);
      window.history.pushState('Access Token', null, '/')
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
    }
  },

  search(term){
    fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`).then(response => {
      return response.json()
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.map (track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }))
      }
    })
  }
  /*{ search(term) {
    fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`).then(response => {
      return response.json()
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.map (track => {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        })
      }
    })
  }   */}

export default Spotify;
