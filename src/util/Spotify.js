let accessToken;
let expiresIn;
const clientId = '70d8c0fa07b247658c7b1f90895c12e2';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken
    } else if (window.location.href.match(/access_token=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/);
      expiresIn = window.location.href.match(/expires_in=([^&]*)/);
      window.setTimeout(() => accessToken = '', expiresIn *1000);
      window.history.pushState('Access Token', null, '/')
      return accessToken
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
    }
  },

  search(term){
    const accessToken = this.getAccessToken();
    fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
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
  },

  savePlaylist(playlistName,trackUris) {
    if(!playlistName || !trackUris) {
      return
    }

    const accessToken = this.getAccessToken();
    const headers = {Authorization: 'Bearer ' + accessToken};
    let userId;

    fetch('https://api.spotify.com/v1/me',{headers: headers}).then(response => response.json()).then(
      jsonResponse => {
        let userId = jsonResponse.id;
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
          method: 'POST',
          body: JSON.stringify({playlistName})
        }).then(response => response.json()).then(jsonResponse => {
          let playlistID = jsonResponse.id;
          fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
            method: 'POST',
            body: JSON.stringify({trackUris})
          })
        })
      }
    )
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
