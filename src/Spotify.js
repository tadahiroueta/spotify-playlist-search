const CLIENT_ID = 'ad690788d09d4d73b9576bcadb4ce7c6'
const REDIRECT_URI = "process.env.PUBLIC_URL"

let accessToken

const Spotify = {
    getAccessToken() {
        if (accessToken) return accessToken
        
        const match = window.location.href.match
        const accessTokenMatch = match(/access_token=([^&]*)/)
        const expiresInMatch = match(/expires_in=([^&]*)/)

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // clear the parameters, allowing us to grab a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');

            return accessToken;
        } 
        else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
            window.location = accessUrl;
    }},

    getPlaylists() {
        const accessToken = Spotify.getAccessToken();
        return fetch('https://api.spotify.com/v1/me/playlists', { headers: { Authorization: `Bearer ${accessToken}`}})
            .then(response => response.json())
            .then(jsonResponse => {

                const playlists = jsonResponse.items
                return playlists ? playlists.map(playlist => { return {
                    name: playlist.name, 
                    cover: playlist.images[0].url, 
                    songs: playlist.tracks.map(song => song.name)
                }}) : []
    })},

    searchSong(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: { Authorization: `Bearer ${accessToken}` }})

            .then(response => response.json())
            .then(jsonResponse => {

                const tracks = jsonResponse.tracks
                return tracks ? tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                })) : []
})}}

export default Spotify