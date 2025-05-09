const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({path: './config.env'});

//initializing the port
const port = process.env.PORT || 3000;
const server = app.listen(port, ()=>{
    console.log(`app running on ${port}`);
})