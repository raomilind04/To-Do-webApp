const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose"); 

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")) 
 



// moongose
mongoose.connect("mongodb://localhost:27017/todolistDB"); 
const itemsSchema= mongoose.Schema({
    name: String
}); 
const Item= mongoose.model("item", itemsSchema);
const intro= new Item({
    name: " || Welcome || "
});  

const defaultItems= [intro]; 


// GET and POST requests 
app.get("/", (req,res)=> {
    var today= new Date(); 
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
        }; 
    
    var day= today.toLocaleDateString("en-US", options); 

        Item.find({}, (err, foundItems)=> {
            if(foundItems.length=== 0){
                Item.insertMany(defaultItems, (err)=> {
                    if(err){
                        console.log(err); 
                    }else{ 
                        console.log("No error in saving on database"); 
                    }
                }); 
                res.redirect("/"); 
            }else {
                res.render("list", {listTitle: day, newListItems: foundItems});
            }
           
        })
     
})


 
app.post("/", (req, res)=> {
    var itemName= req.body.newItem;
    const item= new Item({
        name: itemName
    }); 
    item.save(); 
    res.redirect("/"); 
})

app.post("/delete", (req,res)=> {
    const checkedItemID= req.body.checkbox;
    Item.findByIdAndRemove(checkedItemID, (err)=> {
        if(err){
            console.log(err); 
        }else{
            console.log("No error in deleting from db"); 
            setTimeout(()=> {
                res.redirect("/"); 
            }, 1000) 
        }
    })
})

app.listen(3000, () => {
  console.log("server is running");
});
