const express = require("express");
const { MongoClient } = require("mongodb");
const objectID = require("mongodb").ObjectId;

require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 7000;
// middle ware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://AsonsServer:shawon646@cluster0.sfpfh.mongodb.net/?retryWrites=true&w=majority`;
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("EcommercePackage");
    const databaseCar = client.db("CarPackage");
    const productCollection = database.collection("products");
    const productCollectionnnn = databaseCar.collection("products");
    const colorCollection = databaseCar.collection("color");
    const cartCollection = databaseCar.collection("cart");
    const userCollection = database.collection("usersecom");

    // get product api
    app.get("/product", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
    // get product api
    app.get("/products", async (req, res) => {
      const cursor = productCollectionnnn.find({});
      const product = await cursor.toArray();
      res.send(product);
    });

    // get color api
    app.get("/color", async (req, res) => {
      const cursor = colorCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
    // post color
    app.post("/color", async (req, res) => {
      const product = req.body;
      const result = await colorCollection.insertOne(product);
      res.json(result);
    });

    // get cart api
    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
    // post cart
    app.post("/cart", async (req, res) => {
      const product = req.body;
      // console.log(product);
      const result = await cartCollection.insertOne(product);
      res.json(result);
    });
    // get cart by email
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = cartCollection.find(query);
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // single cart
    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id", id);
      const query = { _id: new objectID(id) };
      const product = await cartCollection.findOne(query);
      res.json(product);
    });
    // delete cart
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new objectID(id) };
      const result = await cartCollection.deleteOne(query);
      res.json(result);
    });

    // update cart
    app.put("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: new objectID(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateProduct.status,
        },
      };
      const result = await cartCollection.updateOne(filter, updateDoc, option);
      // console.log("updating ", result);
      res.json(result);
    });

    // single product
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id", id);
      const query = { _id: new objectID(id) };
      const product = await productCollection.findOne(query);
      res.json(product);
    });

    // single products
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id", id);
      const query = { _id: new objectID(id) };
      const product = await productCollectionnnn.findOne(query);
      res.json(product);
    });

    // post product

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollectionnnn.insertOne(product);
      res.json(result);
    });

    // update product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: new objectID(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          id: updateProduct.id,
          name: updateProduct.name,
          company: updateProduct.company,
          price: updateProduct.price,
          description: updateProduct.description,
          category: updateProduct.category,
          imgA: updateProduct.imgA,
          imgB: updateProduct.imgB,
          imgC: updateProduct.imgC,
          imgD: updateProduct.imgD,
          stock: updateProduct.stock,
          colors: updateProduct.colors,
        },
      };
      const result = await productCollectionnnn.updateOne(
        filter,
        updateDoc,
        option
      );

      res.json(result);
    });

    // delect product api

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new objectID(id) };
      const result = await productCollectionnnn.deleteOne(query);

      res.json(result);
    });

    // get user api
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });

    // post  users
    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   console.log("hit the order pst", user);
    //   const result = await userCollection.insertOne(user);
    //   console.log(result);
    //   res.json(result);
    // });
    // put users
    app.put("/users", async (req, res) => {
      const user = req.body;
      // console.log(user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      // console.log(result);
      res.json(result);
    });

    //  get admin role
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }

      res.json({ admin: isAdmin });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" car server");
});

const use = [
  { id: 100, name: "shaon" },
  { id: 101, name: "rahim" },
];
app.get("/usersss", (req, res) => {
  res.send(use);
});
app.listen(port, () => {
  console.log(`simple node server running on ${port}`);
});
