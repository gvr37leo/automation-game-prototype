var express = require('express')
var fs = require('fs')
var path = require('path')
var app = express()

app.get('/images/list', function(req, res){
    var imagesDir = path.join(__dirname, 'images')
    fs.readdir(imagesDir, { withFileTypes: true }, function(err, entries){
        if(err){
            console.error('Unable to read images directory:', err)
            res.status(500).json({ error: 'Unable to list images' })
            return
        }

        var fileNames = entries
            .filter(function(entry){ return entry.isFile() })
            .map(function(entry){ return entry.name })

        res.json(fileNames)
    })
})

app.use(express.static('./'))

app.listen(8000, () => {
    console.log('listening')
})