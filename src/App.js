import { useState } from 'react';

import Spotify from './Spotify';

function App() {
  const [album, setAlbum] = useState({ name: "", cover: "album-cover-placeholder.jng" })
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const playlists = Spotify.getPlaylists()

  /**
   * Tries to find the cover of a playlist that includes the song
   * 
   * @param {Array} playlists (made by user)
   * @param {Object} song -- top result from search
   * @returns {string} href of playlist cover image
   */
  const searchPlaylist = (playlists, song) => { for (const playlist of playlists) if (playlist.find(song => song.name === song.name)) return playlist }

  const search = (input) => {
    // search for song
    input.preventDefault()
    setSearchTerm(input)
    setSearchResults(Spotify.searchSong(searchTerm))
    
    // find playlist
    const topResult = searchResults[0]
    setAlbum(searchPlaylist(playlists, topResult))
  }

  return (
    <div className="App">

      <header className="Header">
        <img className="Spotify-logo" src={process.env.PUBLIC_URL + "spotify-logo.png"} alt="logo" />
        <h1 className="Title">Spotify Search</h1>
      </header>

      <div className="Body">
        
        <div className='Album'>
          <img className="Album-cover" src={album.cover} alt="album cover" />
          <h2 className="Album-title">{album.name}</h2>
        </div>

        <input className='Search-bar' type='text' placeholder="Enter a song" value={searchTerm} onChange={() => search(e.target.value)} />

        <div className="Search-results">
          {searchResults.map(result => (

            <div className='Search-result' key={result.id}>
              <h3 className='Name'>{result.name}</h3>
              <p className='Artist'>{result.artist}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className='Footer'>
        <p className="Description">words words words words words words words words words words words words words words</p>
        <p className='Credit'>Made by Tadahiro Ueta</p>
        <p className='Contact'>Contact at tadahiroueta@gmail.com</p>
      </footer>
    </div>
)}

export default App;
