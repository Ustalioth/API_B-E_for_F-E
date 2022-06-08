const express = require("express");
const app = express();
const PORT = 8081;

const fs = require("fs");

const users = require("./users.json");
const products = require("./products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/user", (req, res) => {
  let newUser = req.body;
  newUser.id =
    Math.max.apply(
      null,
      users.map((s) => +s.id)
    ) + 1;

  if (
    newUser.first_name == "" ||
    newUser.first_name == undefined ||
    newUser.first_name == null
  ) {
    res.status(500).send("firstname must be defined");
  }

  if (
    newUser.last_name == "" ||
    newUser.last_name == undefined ||
    newUser.last_name == null
  ) {
    res.status(500).send("lastname must be defined");
  }

  if (users.push(newUser)) {
    fs.writeFile("./users.json", JSON.stringify(users), (err) => {
      if (err) throw err;
      res.status(200).send(newUser);
    });
  } else {
    res.status(500).send("User not inserted");
  }
});

app.get("/user/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user != undefined && user != null) {
    res.status(200).send(user);
  } else {
    res.status(500).send("User not found");
  }
});

app.delete("/user/delete/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user != undefined) {
    if (users.splice(users.indexOf(user), 1)) {
      fs.writeFile("./users.json", JSON.stringify(users), (err) => {
        if (err) throw err;
        res.status(200).send("User deleted");
      });
    }
  }
});

app.patch("/user/patch/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;

  let user = users.find((user) => user.id == id);

  JSON.parse(JSON.stringify(req.body));

  if (user != undefined) {
    Object.keys(req.body).forEach((key) => {
      console.log("key : " + key);
      console.log(user[key]);
      console.log(req.body[key]);
      user[key] = req.body[key];
    });

    fs.writeFile("./users.json", JSON.stringify(users), (err) => {
      if (err) throw err;
      //res.status(200).send("User updated");
    });

    res.status(200).send("User updated");
  }

  res.status(200).send("User not found");
});

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`));
