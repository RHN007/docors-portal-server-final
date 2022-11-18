const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 9000; 

// middle ware 
app.use(cors())
app.use(express.json())

//MongoDb Connection 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eekiv4v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run () {
        try {
                const appointmentOptionsCollection = client.db('doctorsPortal').collection('appointmentOptions')


                //Loading all data 
                app.get('/appointmentOptions', async (req, res) => {
                    const query = {}
                    const options = await appointmentOptionsCollection.find(query).toArray()
                    res.send(options)
                })



        }
        finally{

        }
}
run().catch(console.log)














app.get('/', async(req, res)=> {
    res.send('Doctors Server is running')
})

app.listen(port, () => {
    console.log(`Doctors Portal Running on ${port}`)
})
