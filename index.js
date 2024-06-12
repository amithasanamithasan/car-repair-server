const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1gieptu.mongodb.net/?
retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const serviceCollection=client.db('CarRepairing').collection('service');
const bookingCollection =client.db('CarRepairing').collection('booked');
    app.get('/service', async (req, res) => {
      
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
         
        });


     app.get('/service/:id', async(req, res) => {
    const id = req.params.id
    const query = { _id: new ObjectId(id) };
    const options={
      projections:{ title: 1 , price: 1, service_id: 1 ,img: 1},
    };
    const result = await serviceCollection.findOne(query, options);
    res.send(result)
  });


    //query user 1 email related data bar korar condition 

// booked
app.get('/booked', async(req,res)=>{
  console.log(req.query.email);
let query={};
if(req.query?.email){
  query={email: req.query.email}
}

  const result= await bookingCollection.find(query).toArray();
  res.send(result)
})
// create

app.post('/booked' , async(req, res)=>{
  const booking=req.body;
  console.log(booking)
  const result =await bookingCollection.insertOne(booking);
  res.send(result)

});
// delete

 app.delete('/booked/:id',async(req, res)=>{
  const id =req.params.id;
  const query={_id: new  ObjectId(id)}
  const result= bookingCollection.deleteOne(query)
  res.send(result)
 });
//  update
app.patch('/booked/:id',async(req, res)=>{
const id =req.params.id;
const filter={_id: new ObjectId(id)}
const updateBooking=req.body;
console.log(updateBooking)

   const updateDoc = {
                $set: {
                    status: updateBooking.status
                },
            };
     const result = await bookingCollection.updateOne(filter, updateDoc);
      res.send(result);

})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}
run().catch(console.dir);


app.get('/',(req, res)=>{
    res.send('Doctor is running')
})

app.listen(port, ()=>{
    console.log(`car services is running on port ${port}`)
})