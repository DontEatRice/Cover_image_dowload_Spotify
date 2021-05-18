const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Spotify = require('../classes/Spotify')
require('dotenv').config();

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

router.get('/artist/:id', (req, res) => {
    Spotify.getToken((err, token, token_type) => {
        if (err){
            res.status(500).send(err)
            return
        }

        const id = req.params.id
        const uri = encodeURI(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`)

        fetch(uri, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${token_type} ${token}`
            }
        }).then(data => data.json())
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err))
    })
})


router.get('/download', (req, res) => {
    fetch(req.query.url)
    .then(response => {
        response.body.pipe(res)
    })
})

module.exports = router;



