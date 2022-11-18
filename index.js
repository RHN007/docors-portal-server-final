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
                const bookingsCollection = client.db('doctorsPortal').collection('bookings')

                //use aggregate to query multiple collection and then merge date \



                //Loading all data from server (Sending data to client)
                app.get('/appointmentOptions', async (req, res) => {
                    const date = req.query.date;
                    console.log(date)
                    const query = {}
                    const options = await appointmentOptionsCollection.find(query).toArray()

                    //Get the booking of the provided date :
                    const bookingQuery = {appointmentDate:date}
                    const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray()

                    //Code Carefully :

                    options.forEach(option => {
                        const optionBooked = alreadyBooked.filter(book => book.treatment === option.name)
                        const bookedSlots = optionBooked.map(book => book.slot)
                        const remainingSlots = option.slots.filter(slot =>!bookedSlots.includes(slot))
                        option.slots = remainingSlots;
                        console.log(date, option.name, remainingSlots.length)
                    })
                    res.send(options)
                })
            /**
             * API NAMING CONVENTIONS:
             * bookings
             * app.get('/bookings')
             * app.get('/bookings/:id')
             * app.post('/bookings')
             * app.patch('/bookings/;id'
             * app.delete('/bookings/:id'))
             * */

             //Sending Data to client site ;
             app.get('/bookings', async(req, res) => {
               const email = req.query.email;
               const query = {email:email};
               const bookings = await bookingsCollection.find(query).toArray();
               res.send(bookings)
             })







            //Relieving data from client site
            app.post('/bookings', async(req,res)=> {
                const booking = req.body;
                console.log(booking)
                const query = {
                    appointmentDate: booking.appointmentDate,
                    email: booking.email,
                    treatment: booking.treatment
                }
                const alreadyBooked = await bookingsCollection.find(query).toArray()
                if(alreadyBooked.length){
                    const message = `You already have a booking on ${booking.appointmentDate}`
                    return res.send({acknowledged:false, message})
                }


                const result = await bookingsCollection.insertOne(booking);
                res.send(result)
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
