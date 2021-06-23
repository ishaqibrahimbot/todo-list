//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connect to database
mongoose.connect("mongodb+srv://admin-ishaq:g8wnvw57dBiX2z6@ishaqclusterone.n3mde.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

//Define schema for item
const itemSchema = new mongoose.Schema ({
  name: String
});

//Initialize model for item schema
const Item = mongoose.model("Item", itemSchema);


//Define schema for different lists
const listSchema = new mongoose.Schema ({
  name: String,
  items: [itemSchema]
});

//Initialize model for list schema
const List = mongoose.model("List", listSchema);


//Establish get and post for default root route
app.get("/", function(req, res) {

  Item.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
        const day = date.getDate();
        res.render("list", {listTitle: day, newListItems: items});
    }
  });
});

app.post("/", function(req, res){
  const newItem = req.body.newItem;
  const listItem = req.body.list;

  const item = new Item ({
    name: newItem
  });

  if (listItem === date.getDate()) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listItem}, (err, list) => {
      if (!err) {
        list.items.push(item);
        list.save();
        res.redirect("/" + listItem);
      }
    });
  }

});

//Implement delete functionality through post delete route
app.post("/delete", (req, res) => {
  const id = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === date.getDate()) {
    Item.deleteOne({_id: id}, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted the item: ", id);
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}, (err, foundList) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});

//Implement get route for custom lists using express route parameters
app.get("/:listName", (req, res) => {
  const customListName = _.capitalize(req.params.listName);

  List.findOne({name: customListName}, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (!results) {
        const list = new List ({
          name: customListName,
          items: defaultItems
        });
        list.save();

        res.redirect("/" + customListName);
      } else {
        res.render("list", {listTitle: customListName, newListItems: results.items});
      }
    }
  });
});

//Set up the server to work on the heroku port
app.listen(process.env.PORT, function() {
  console.log("Server started successfully");
});
