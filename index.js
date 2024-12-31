const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suunm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect(); // Ensure the client connects
    const serviceCollection = client.db("carDoctor").collection("services");
    const bookingCollection = client.db("carDoctor").collection("bookings");

    // Services: Fetch all
    app.get('/services', async (req, res) => {
      try {
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch services' });
      }
    });

    // Services: Fetch one by ID
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { projection: { title: 1, price: 1, service_id: 1 } };

      try {
        const result = await serviceCollection.findOne(query, options);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch the service' });
      }
    });

    // Bookings: Create a new booking
    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      try {
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to create booking' });
      }
    });



   // for product
   app.get('/products', async (req, res) => {
    try {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to fetch products' });
    }
  });


  app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const options = { projection: { title: 1, price: 1, service_id: 1 } };

    try {
      const result = await serviceCollection.findOne(query, options);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to fetch the service' });
    }
  });



    // Checkout: Create a new booking (duplicate logic removed)
    app.post('/checkout', async (req, res) => {
      const booking = req.body;
      try {
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to process checkout' });
      }
    });

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

run().catch(console.dir);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Doctor is running');
});

// Start server
app.listen(port, () => {
  console.log(`Car doctor server is running on port ${port}`);
});
