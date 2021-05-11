const fetch = require('node-fetch');
require('dotenv').config();

class Spotify {
    token; token_type; expires

    constructor() {
        this.token = null;
        this.token_type = null;
        this.expires = null;
    }

    checkIfExpired() {
        if (this.expires === null || Date.now() > this.expires) 
            return true
        return false
    }

    setData(token, token_type, expires) {
        this.token = token
        this.token_type = token_type
        this.expires = expires
    }
    
    getToken(callback) {
        if (this.checkIfExpired()) {
            this.getNewToken()
                .then(data => {
                    callback(null, data.access_token, data.token_type)
                    this.setData(data.access_token, data.token_type, Date.now() + data.expires_in*1000)
                })
                .catch(err => callback(err))
        } else
            callback(null, this.token, this.token_type)
    }

    async getNewToken() {
        try {
            const base64encoded = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${base64encoded}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials'
            })
            if (!response.ok)
                throw new Error('POST request for new Spotify token failed - ' + response)
            return response.json()
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = new Spotify();