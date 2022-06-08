const express = require("express");
const app = express();
const PORT = 8082;

const fs = require("fs");

const products = require("./products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/product/:amount", (req, res) => {
  const { amount } = req.params;

  res.status(200).send(products.slice(0, amount));
});

app.post("/product", (req, res) => {
  let newProduct = req.body;
  newProduct.id =
    Math.max.apply(
      null,
      users.map((s) => +s.id)
    ) + 1;

  if (
    newProduct.name == "" ||
    newProduct.name == undefined ||
    newProduct.name == null
  ) {
    res.status(500).send("name must be defined");
  }

  if (products.push(newProduct)) {
    fs.writeFile("./products.json", JSON.stringify(products), (err) => {
      if (err) throw err;
      res.status(200).send(newProduct);
    });
  } else {
    res.status(500).send("Product not inserted");
  }
});

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));
