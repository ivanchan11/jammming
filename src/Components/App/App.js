import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'Untitled Playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  /*If the song is already in the playlist, do nothing, otherwise update playlist*/
  addTrack(track) {
    let currentPlaylist = this.state.playlistTracks;
    if (currentPlaylist.find(savedTrack => savedTrack.id === track.id)) {
      return currentPlaylist;
    } else {
      currentPlaylist.push(track)
      this.setState({playlistTracks: currentPlaylist})
    }
  }

  /*When - is click, locate the item from array, using .filter() to keep songs*/
  removeTrack(track) {
    let currentPlaylist = this.state.playlistTracks;
    let newPlaylist = currentPlaylist.filter(deleteTrack => deleteTrack.id !== track.id);
    this.setState({playlistTracks: newPlaylist})
    }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = [];
    for (let j = 0; j < this.state.playlistTracks.length; j++) {
      trackURIs.push(this.state.playlistTracks[j].uri)
    }
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    this.setState({playlistName: 'Untitled Playlist',
                   playlistTracks: []})
  }

  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks})
    })
  
  }

  render() {
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave = {this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;