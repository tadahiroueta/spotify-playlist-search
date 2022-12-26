const CLIENT_ID = '78f6632a92254410b635991b3c0c32a5'
const REDIRECT_URI = "https://playlist.tadahiroueta.com/" // change when deploying

let accessToken, playlists

const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

const Spotify = {

    /**
     * Fetches access token from Spotify API or returns existing token
     * 
     * @returns {string} access token
     */
    getAccessToken() {
        if (accessToken) return accessToken
        
        const href = window.location.href
        const accessTokenMatch = href.match(/access_token=([^&]*)/)
        const expiresInMatch = href.match(/expires_in=([^&]*)/)

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

    /**
     * Fetches all playlists made by user
     * 
     * @returns {Promise<Array>} array of playlist ids
     */
    async getPlaylists() {
        if (playlists) return playlists

        const accessToken = Spotify.getAccessToken();
        playlists = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', { headers: { Authorization: `Bearer ${accessToken}`}})
            .then(response => response.json())

        playlists = await Promise.all(playlists.items.map(async item => {
            await delay(1000)
            const songs = await Spotify.getSongs(item.id)
            return {
                name: item.name,
                cover: item.images[0].url,
                songs: songs
        }}))
        return playlists
    },

    /**
     * Fetches only useful data from playlist
     * 
     * @param {string} playlistId
     * @returns {Promise<Array>} names of songs in the playlist
     */
    getSongs(playlistId) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { headers: { Authorization: `Bearer ${accessToken}`}})
            .then(response => response.json())
            .then(jsonResponse => jsonResponse.items.map(item => item.track.name))
    },

    searchSong(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: { Authorization: `Bearer ${accessToken}` }})

            .then(response => response.json())
            .then(jsonResponse => {

                const tracks = jsonResponse.tracks
                return tracks ? tracks.items.slice(0, 5).map(track => ({
                    name: track.name,
                    artist: track.artists[0].name,
                    cover: track.album.images[0].url,
                })) : []
})}}

export default Spotify