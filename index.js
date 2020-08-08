let products = [
  {
    id: 1,
    title: "Brown eggs",
  },
  {
    id: 2,
    title: "Sweet fresh strawberry",
  },
  {
    id: 3,
    title: "Asparagus",
  },
  {
    id: 4,
    title: "Green smoothie",
  },
  {
    id: 5,
    title: "Raw legumes",
  },
  {
    id: 6,
    title: "Baking cake",
  },
  {
    id: 7,
    title: "Pesto with basil",
  },
  {
    id: 8,
    title: "Hazelnut in black ceramic bowl",
  },
];

const express = require("express");
//const products = require("./products.json");
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/products/", (req, res) => {
  res.send(products);
});

app.get(`/product/:id`, (req, res) => {
  for (let product of products) {
    if (product.id === Number(req.params.id)) {
      res.send(product);
    }
  }
});

app.post("/product/:id", (req, res) => {
  products.forEach((product) => {
    if (product.id === Number(req.params.id)) {
      res.send("This ID already exists");
    }
  });
  products.push(req.body);
  res.send(req.body);
});

//don't work
app.put("/product/:id", (req, res) => {
  products.forEach((product, i) => {
    if (product.id === Number(req.params.id)) {
      Object.assign(product, req.body);
      res.send(req.body);
    }
  });
});

app.delete("/product/:id", (req, res) => {
  products.forEach((product, i) => {
    if (product.id === Number(req.params.id)) {
      console.log(product);
      products.splice(i, 1);
      res.send(`product ${product.title} deleted`);
    }
  });
});

app.listen(3000);
