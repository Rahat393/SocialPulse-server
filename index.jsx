const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ["http://localhost:5173/"],
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lnoy20s.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try{
    const postCollection = client.db("SocialPulse").collection("postData");
// console.log(postCollection);

app.post('/post', async(req, res) => {
  const postData = req.body;
  const result = await postCollection.insertOne(postData);
  res.send(result)
});

app.get('/post', async(req, res) => {
  const query ={};
  const result = await postCollection.find(query).toArray();
  res.send(result)
});

app.get("/posts/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const post = await postCollection.findOne(query);
  res.send(post);
});

app.put("/like/:id", async (req, res) => {
  // const home = req.body;
  const id = req.body;
  console.log(id)
  const filter = {_id: new ObjectId(id)};
  const options = { upsert: true };
  const updateDoc = {
    $set:  {
      like : id
    },
  };
  const result = await postCollection.updateOne(
    filter,
    updateDoc,
    options
  );
  res.send(result);
});

    console.log("Database Connected... yaa");
  } finally{

  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("social Server is running...");
});

app.listen(port, () => {
  console.log(`social Server is running...on ${port}`);
});