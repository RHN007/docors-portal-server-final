const express = require('express');
// const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9000; 

// middle ware 
app.use(cors())
app.use(express.json())

require('dotenv').config()

app.get('/', (req, res)=> {
    res.send('Doctors Server is running')
})

app.listen(port, () => {
    console.log(`Doctors Portal Running on ${port}`)
})