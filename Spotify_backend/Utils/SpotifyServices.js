const axios = require('axios');
const qs = require('querystring');

class SpotifyService {
  static instance = null;
  static accessToken = null;
  static accessTokenExpiry = 0;

  constructor() {
    if (SpotifyService.instance) {
      return SpotifyService.instance;
    }
    SpotifyService.instance = this;
  }

  static async initialize() {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
      await SpotifyService.instance.getAccessToken();
    }
    return SpotifyService.instance;
  }

  static getInstance() {
    if (!SpotifyService.instance) {
      throw new Error('SpotifyService not initialized. Call initialize() first.');
    }
    return SpotifyService.instance;
  }

  async getValidAccessToken() {
    const now = Date.now();
    if (SpotifyService.accessToken && now < SpotifyService.accessTokenExpiry) {
      return SpotifyService.accessToken;
    }
    return this.getAccessToken();
  }

  async getAccessToken() {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type: 'client_credentials'
      })
    };

    try {
      const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });

      if (response.status === 200) {
        SpotifyService.accessToken = response.data.access_token;
        SpotifyService.accessTokenExpiry = Date.now() + (response.data.expires_in * 1000);
        console.log('New Spotify access token generated');
        return SpotifyService.accessToken;
      } else {
        throw new Error('Failed to get Spotify access token');
      }
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw new Error('Failed to get Spotify access token');
    }
  }

  async searchSongs(query, limit = 20) {
    const accessToken = await this.getValidAccessToken();
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'track',
          limit: limit
        },
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      
      // Extract relevant information from the response
      const tracks = response.data.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map(artist => artist.name),
        album: track.album.name,
        duration_ms: track.duration_ms,
        popularity: track.popularity,
        preview_url: track.preview_url,
        image_url: track.album.images[0]?.url // Get the first (usually largest) image
      }));

      return tracks;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await this.getAccessToken();
        return this.searchSongs(query, limit);
      }
      console.error('Error searching songs:', error);
      throw new Error('Failed to search songs');
    }
  }
}

module.exports = SpotifyService;