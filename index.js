const express = require('express');
// const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9000; 
app.use(cors())

require('dotenv').config()

app.get('/', (req, res)=> {
    res.send('Doctors Server is running')
})

app.listen(port, () => {
    console.log(`Example app listen on port ${port}`)
})