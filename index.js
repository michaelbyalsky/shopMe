let products = [
  {
    id: 1,
    title: "Brown eggs",
    type: "dairy",
    description: "Raw organic brown eggs in a basket",
    filename: "0.jpg",
    height: 600,
    width: 400,
    price: 28.1,
    rating: 4,
  },
  {
    id: 2,
    title: "Sweet fresh strawberry",
    type: "fruit",
    description: "Sweet fresh strawberry on the wooden table",
    filename: "1.jpg",
    height: 450,
    width: 299,
    price: 29.45,
    rating: 4,
  },
  {
    id: 3,
    title: "Asparagus",
    type: "vegetable",
    description: "Asparagus with ham on the wooden table",
    filename: "2.jpg",
    height: 450,
    width: 299,
    price: 18.95,
    rating: 3,
  },
  {
    id: 4,
    title: "Green smoothie",
    type: "dairy",
    description:
      "Glass of green smoothie with quail egg's yolk, served with cocktail tube, green apple and baby spinach leaves over tin surface.",
    filename: "3.jpg",
    height: 600,
    width: 399,
    price: 17.68,
    rating: 4,
  },
  {
    id: 5,
    title: "Raw legumes",
    type: "vegetable",
    description: "Raw legumes on the wooden table",
    filename: "4.jpg",
    height: 450,
    width: 299,
    price: 17.11,
    rating: 2,
  },
  {
    id: 7,
    title: "Baking cake",
    type: "dairy",
    description:
      "Baking cake in rural kitchen - dough  recipe ingredients (eggs, flour, sugar) on vintage wooden table from above.",
    filename: "5.jpg",
    height: 450,
    width: 675,
    price: 11.14,
    rating: 4,
  },
  {
    id: 8,
    title: "Pesto with basil",
    type: "vegetable",
    description: "Italian traditional pesto with basil, cheese and oil",
    filename: "6.jpg",
    height: 450,
    width: 299,
    price: 18.19,
    rating: 2,
  },
  {
    id: 9,
    title: "Hazelnut in black ceramic bowl",
    type: "vegetable",
    description:
      "Hazelnut in black ceramic bowl on old wooden background. forest wealth. rustic style. selective focus",
    filename: "7.jpg",
    height: 450,
    width: 301,
    price: 27.35,
    rating: 0,
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
