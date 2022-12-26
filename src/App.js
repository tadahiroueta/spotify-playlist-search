import { useState } from 'react';

import Spotify from './Spotify';

const PLAYLIST_PLACEHOLDER = { name: "", cover: "cover-placeholder.jpg" }

function App() {
  const [playlist, setPlaylist] = useState(PLAYLIST_PLACEHOLDER)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])


  /**
   * Tries to find the cover of a playlist that includes the song
   * 
   * @param {Array} playlists (made by user)
   * @param {Object} song -- top result from search
   * @returns {string} href of playlist cover image
   */
  const searchPlaylist = async (songName) => { 
    for (const playlist of await Spotify.getPlaylists()) if (playlist.songs.find(song => songName === song)) {
      setPlaylist(playlist)
      return
    }
    setPlaylist(PLAYLIST_PLACEHOLDER)
   }

  const search = async () => {
    // search for song
    const results = await Spotify.searchSong(searchTerm)
    setSearchResults(results)

    // find playlist
    searchPlaylist(results[0].name)
  }

  return (
    <div className="App">

      <header className="Header">
        <img className="Spotify-logo" src={process.env.PUBLIC_URL + "spotify-logo.png"} alt="logo" />
        <h1 className="Title">Spotify Search</h1>
      </header>

      <div className="Body">
        
        <div className='Playlist'>
          <img className="Playlist-cover" src={process.env.PUBLIC_URL + playlist.cover} alt="playlist cover" />
          <h4 className="Playlist-title">{playlist.name}</h4>
        </div>

        <div className="Search">
          
          <div className='Search-bar'>
            <img className='Magnifying-glass' src={process.env.PUBLIC_URL + "magnifying-glass.png"} alt="magnifying glass" onClick={search} />
            <input className='Search-input' type='text' placeholder="Search" value={searchTerm} onChange={ e => setSearchTerm(e.target.value) } onKeyUp={({ key }) => { if (key === "Enter") search() }} />
          </div>

          {searchResults.length > 0 ? (
            <div className="Search-results">
              {searchResults.map(result => (

                <div className='Search-result' key={JSON.stringify(result)}>
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
