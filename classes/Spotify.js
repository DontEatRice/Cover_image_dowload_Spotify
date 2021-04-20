const fetch = require('node-fetch');
const dataSchema = require('../models/data')
require('dotenv').config();

class Spotify {
    static token = null
    static token_type = null
    static expires = null

    static checkIfExpired() {
        if (this.expires === null || Date.now() > this.expires) 
            return true
        return false
    }

    static setData(token, token_type, expires) {
        this.token = token
        this.token_type = token_type
        this.expires = expires
    }

    static updateDataInDB(data) {
        const toPush = {token: data.access_token, token_type: data.token_type, expires: Date.now() + data.expires_in*1000}
        dataSchema.findOneAndReplace({expires: {$gte:0}}, toPush, null, (err) => {
            if (err)
                console.error(err)
            else
                console.log('udpated!')
        })
    }
    
    static getToken(callback) {
        if (this.checkIfExpired()) {
            // check in database for token data
            dataSchema.findOne({}, (err, data) => {
                if (err) 
                    callback(err)
                else {
                    console.log('get data from database, because token is null or expired')
                    // check if token from database is expired
                    if (Date.now() < data.expires) {
                        callback(null, data.token, data.token_type)
                        this.setData(data.token, data.token_type, data.expires)
                    } else {
                        // if token is expired then make call for a new one
                        this.getNewToken()
                            .then(data => {
                                callback(null, data.access_token, data.token_type)
                                this.setData(data.access_token, data.token_type, Date.now() + data.expires_in*1000)
                                this.updateDataInDB(data)
                            })
                            .catch(err => callback(err))
                    }
                }
            })  
        } else
            callback(null, this.token, this.token_type)
    }

    static async getNewToken() {
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

module.exports = Spotify