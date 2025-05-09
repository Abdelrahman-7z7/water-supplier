const express = require('express')
const supabase = require('./config/supabaseConfig')

const app = express()

//middleware for returning response in json format
app.use(express.json())

app.get('/', (req, res) =>{
    res.json({"name":'Server is running...'})
})

module.exports = app;