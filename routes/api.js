const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Spotify = require('../classes/Spotify')
require('dotenv').config();

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
        .catch(e => res.status(500).json(e))
    }
  })
})

router.get('/artist/:id', (req, res) => {
  Spotify.getToken((err, token, token_type) => {
    if (err) {
      res.status(500).json(err)
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
      .catch(err => res.status(500).json(err))
  })
})

module.exports = router;



