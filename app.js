const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

mongoose.connect(
  "mongodb+srv://admin-mt:mongo2020@cluster0.0wyblts.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);

const itemsSchema = new mongoose.Schema({
  name: String,
});
const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to your todoList",
});

const item2 = new Item({
  name: "Hit ++ for Add item",
});

const item3 = new Item({
  name: "Hit -- for Remove item",
});

const defaultItems = [item1, item2, item3];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Item.find()
    .then(function (foundItems) {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(function () {
            console.log(" Default items add is successfull");
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then(function (foundList) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then(function (foundlist) {
      foundlist.items.push(item);
      foundlist.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedId)
      .then(function () {
        console.log("Successfull deleted");
        res.redirect("/");
      })
      .catch(function (er) {
        console.log(err);
      });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedId } } }
    )
      .then(function () {
        res.redirect("/" + listName);
      })
      .catch(err => {
        console.log(err);
      });
  }
});

app.listen(3000, function () {
  console.log("Server started port 3000");
});
