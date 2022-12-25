import { useState } from 'react';

import Spotify from './Spotify';

function App() {
  const [album, setAlbum] = useState({ name: "", cover: "album-cover-placeholder.jpg" })
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
  const searchPlaylist = (playlists, searchSong) => { for (const playlist of playlists) if (playlist.find(song => searchSong.name === song.name)) return playlist }

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
          <img className="Album-cover" src={process.env.PUBLIC_URL + album.cover} alt="album cover" />
          <h4 className="Album-title">{album.name}</h4>
        </div>

        <div className="Search">
          
          <div className='Search-bar'>
            <img className='Magnifying-glass' src={process.env.PUBLIC_URL + "magnifying-glass.png"} alt="magnifying glass" />
            <input className='Search-input' type='text' placeholder="Search" value={searchTerm} onChange={ e => search(e.target.value) } />
          </div>

          {searchResults.length > 0 ? (
            <div className="Search-results">
              {searchResults.map(result => (

                <div className='Search-result' key={result.name}>
                  <img className='Song-cover' src={process.env.PUBLIC_URL + result.cover} alt="song cover" />

                  <div className='Song-text'>
                    <h3 className='Song-name'>{result.name}</h3>
                    <p className='Song-artist'>{result.artist}</p>
                    </div>
                </div>
              ))}
            </div>
          ) : <p className="Not-found">No results found</p>}
        </div>
      </div>

      <footer className='Footer'>
        <p className="Footer-text">Find your personal playlist by searching for a song in it&emsp;&emsp;&emsp;|&emsp;&emsp;&emsp;by Tadahiro Ueta&emsp;&emsp;&emsp;|&emsp;&emsp;&emsp;tadahiroueta@gmail.com</p>
      </footer>
    </div>
)}

export default App;
