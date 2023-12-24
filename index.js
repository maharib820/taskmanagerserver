const express = require('express');
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.TASKMANAGER_DB_USER}:${process.env.TASKMANAGER_DB_PASS}@cluster0.8ydx2m5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const taskCollection = client.db("taskManager").collection("tasks");

        app.post("/addtask", async (req, res) => {
            const data = req.body;
            const result = await taskCollection.insertOne(data);
            res.send(result);
        })

        app.get("/tasks", async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
        })

        app.patch("/task/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const status = req.query.status;
            const updateDoc = {
                $set: {
                    status: status
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        })


        app.get("/task/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await taskCollection.findOne(filter);
            res.send(result);
        })

        app.post("/task/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const data = req.body;
            console.log(data);
            const updateDoc = {
                $set: {
                    title: data.title,
                    description: data.description,
                    deadline: data.deadline,
                    priority: data.priority
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Task manager server is runnning')
})

app.listen(port, () => {
    console.log(`Task manager server is runnning on port ${port}`)
})