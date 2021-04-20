const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Spotify = require('../classes/Spotify')
require('dotenv').config();

router.get('/test2', (req, res) => {
    res.send(Spotify.token)
})

router.get('/token', (req, res) => {
    Spotify.getToken((err, token, token_type) => {
        if (err) {
            console.error(err)
            res.status(500).send(err)
        } else {
            console.log(token, token_type)
            res.send({token: token, token_type: token_type, expires: Spotify.expires})
        }
    })

    // fs.readFile('./data.json', 'utf8', async (err, data) => {
    //     if (err)
    //         console.error(err)
    //     else {
    //         let fileData = JSON.parse(data)
    //         let changed = false
    //         const expires = new Date(fileData.expires)
    //         if (expires < new Date()) {
    //             console.log('token expired, getting new one...')
    //             try {
    //                 fileData = await getSpotifyToken()
    //                 const toExpire = new Date()
    //                 toExpire.setTime(toExpire.getTime() + fileData.expires_in*1000)
    //                 fileData.expires = toExpire.getTime()
    //                 changed = true
    //                 console.log(fileData.access_token)
    //                 res.send({access_token: Buffer.from(fileData.access_token).toString('base64'), token_type: fileData.token_type, expires: fileData.expires})
    //             } catch (e) {
    //                 res.status(500)
    //                 res.send('Something went wrong... ' + e)
    //             }
    //         } else {
    //             res.send({access_token: Buffer.from(fileData.access_token).toString('base64'), token_type: fileData.token_type, expires: fileData.expires})
    //         }

    //         if (changed)
    //             writeFile(fileData)
    //     }
    // })
})



router.get('/spotify/search', (req, res) => {
    Spotify.getToken((err, token, token_type) => {
        if (err) {
            res.status(500).send(err)
        } else {
            // https://developer.spotify.com/documentation/web-api/reference/#category-search
            const uri = encodeURI(`https://api.spotify.com/v1/search?q=${req.query.q}&type=${req.query.type}`)
            fetch(uri, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `${token_type} ${token}`
                }
            }).then(response => response.json())
            .then(response => res.send(response))
            .catch(e => res.status(500).send(e))
        }
    })
})

router.get('/download', (req, res) => {
    fetch(req.query.url)
    .then(response => {
        response.body.pipe(res)
    })
})

module.exports = router;



