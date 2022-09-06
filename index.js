const express = require('express')
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const {sign}=require("jsonwebtoken");
const cors=require("cors");
const bcrypt=require('bcrypt')
const path = require('path')
const jwt_decode = require('jwt-decode');
const app = express()
const port = 3001
bodyParser.json()
app.use(express.json());
const User = require('./models/users');
const Sport = require('./models/sport');
const Slot = require('./models/slots');
const Place = require('./models/place');
app.use(express.static(path.resolve(__dirname, "./clientside/build")));
app.use(cors());
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true}, (error)=>{
  if (error) {console.log("error")} else {console.log("connection successful")};
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post("/register",async (req,res)=>{
  const new_user=new User(req.body)
    const emailExists = await User.findOne({email: req.body.email});
    const usernameExists = await User.findOne({username: req.body.username});
    if (emailExists ) {
      res.json("Email already registered")
    }
    else if (usernameExists ) {
      res.json("Username already taken")
    }
    else
    {
      await new_user.save((error)=>{
    if(error) {console.log(error)};
    console.log("User created successfully")
    res.json("User created successfully")
    })}
})
app.post("/addsport",async (req,res)=>{
  const new_sport=new Sport(req.body)
    const sport_exists = await Sport.findOne({name: req.body.name});
    if (sport_exists ) {
      res.json("Sport already there")
    }
    else
    {
      await new_sport.save((error)=>{
      if(error) {console.log(error)};
      res.json("Sport added successfully, refresh to load changes")
    })}
})
app.post("/addplace",async (req,res)=>{
  const new_place=new Place(req.body)
    const place_exists = await Place.findOne({name: req.body.name});
    if (place_exists ) {
      res.json("Place already there")
    }
    else
    {
      await new_place.save((error)=>{
      if(error) {console.log(error)};
      res.json("Place added successfully, refresh to load changes")
    })}
})
app.post("/sports/addslot",async (req,res)=>{
  console.log(req.body)
  const new_slot=new Slot(req.body)
    const slot_exists = await Slot.findOne({$and: [{'endTime': {$gt: new_slot.startTime}}, {'startTime' : {$lt: new_slot.endTime}}]});
    if (slot_exists ) {
      res.json("Slot conflict, kindly recheck!")
    }
    else if(new_slot.endTime<=new_slot.startTime){
      res.json("Invalid slot")
    }
    else
    {
      const sport=await Sport.findOne({name : req.body.sport})
      console.log(sport)
      new_slot.sport=sport._id
      const place=await Place.findOne({name : req.body.place})
      if(place==null)
      {
        res.json("The place you are trying to enter doesn't exist, kindly add it to the Place console first")
      }
      else{
        console.log(place)
        new_slot.place=place._id
        new_slot.place_name=place.name
        await new_slot.save((error)=>{
        if(error) {console.log(error)};
        res.json("Slot added successfully, refresh to load changes")
      })
      
    }
    }
})
app.put("/sports/bookslot",async (req,res)=>{
    const slot_exists = await Slot.findOne({$and: [{'endTime': {$eq: req.body.endTime}}, {'startTime' : {$eq: req.body.startTime}}]});
    if (slot_exists ) {
      const user=await User.findOne({name : req.body.username})
      if(user==null)
      {
        res.json("Only regged users are allowed to booka  slot. Please register/login")
      }
      else{
        const slots = await Slot.find({$and: [{'client' : user._id}, {'date' : {$eq: req.body.date}}]})
        if (slots.length>=3)
        {
          res.json("Maximum slots booked for the day!")
        }
        else{
          slot_exists.client=user._id
          slot_exists.is_booked=true
          await slot_exists.save()
          res.json("Slot booked successfully, refresh to load changes")
        }
    }
  }
    else{
      res.json("Operation unsuccessful, please try again!")
    }
      }
      
)
app.post("/addstaff",async (req,res)=>{
    const new_staff = await User.findOne({username: req.body.username});
    if (new_staff!=null) {
      new_staff.is_staff=true
      await new_staff.save((error)=>{
        if(error) {console.log(error);
         res.json("Operation unsuccessful, please try again")};
          res.json("Access Updated successfully!, refresh to load changes")
      })
    }
    else{
      res.json("No such user exists in the database!")
    }
    
})
app.post("/deletestaff",async (req,res)=>{
    const new_staff = await User.findOne({username: req.body.username});
    if (new_staff!=null) {
      new_staff.is_staff=false
      await new_staff.save((error)=>{
        if(error) {console.log(error);
         res.json("Operation unsuccessful, please try again")};
          res.json("Access Updated successfully, refresh to load changes!")
      })
    }
    else{
      res.json("No such user exists in the database!")
    }
    
})
app.post("/login", async (req, res)=>{
  const { username, password} = req.body;
  const user = await User.findOne({username: username});
  if(!user)
  {
      res.json({error: "No such user exists in the database"});
  }
  else{
      const accessToken=sign({username: user.username, id: user.id}, "72564A672EBAC906DACECA4DD53E82A4C7D8570F821B0E917CD7A701BDF6A5CA")
      bcrypt.compare(password, user.password).then((match)=>{
          if(!match) {
              res.json({error: "wrong password"});}
          else{
              res.json(accessToken);
          }
      })
  }
});
app.post('/sports/updateinventory/:name/:item', async (req,res)=>{
  const name=req.params.name;
  const item=req.params.item;
  const sport=await Sport.findOne({name: name});
  var result = sport.inventory.find(t=>t.equipment == item);
  var index = sport.inventory.indexOf(result); // get index if value found otherwise -1
if (index > -1) { //if found
  sport.inventory[index].count=req.body.count
}
else{
  sport.inventory.push({"equipment" : req.body.equipment, "count" : req.body.count})
}
  await sport.save()
  res.json(sport);
})
app.get('/users/bytoken/:token', async (req,res)=>{
  const token=req.params.token;
  try{
    const result=await jwt_decode(token);
    const user = await User.findOne({username: result.username}, {password:0});
    res.json(user);
  }
  catch(err){
      return res.json({error: err});
  }
})
app.get("/sports", async (req, res)=>{
  const listOfSports = await Sport.find()
  res.json(listOfSports);
});
app.get("/places", async (req, res)=>{
  const listOfPlaces = await Place.find()
  res.json(listOfPlaces);
})
app.get('/slots/byuserId/:id', async (req,res)=>{
  const id=req.params.id;
  const user=await User.findOne({name : req.body.username})
  const Slotsarr=await Slot.find({client : user._id})
  console.log(Slotsarr)
  res.json(Slotsarr);
})
app.get('/place/byId/:id', async (req,res)=>{
  const id=req.params.id;
  const place=await Place.findOne({_id : id})
  res.json(place);
})
app.get('/sports/:name', async (req,res)=>{
  const name=req.params.name;
  const sport=await Sport.findOne({name: name});
  res.json(sport);
})
app.get('/slotsbysport/:name', async (req,res)=>{
  const name=req.params.name;
  const sport=await Sport.findOne({name: name});
  const slots = await Slot.find({sport : sport._id})
  res.json(slots);
})
app.delete('/sports/delete/:name', async (req,res)=>{
  const name=req.params.name;
  const sport=await Sport.findOneAndDelete({name: name});
  res.json(sport);
})
app.delete('/sports/deleteinventory/:name/:item', async (req,res)=>{
  const name=req.params.name;
  const item=req.params.item;
  const sport=await Sport.findOne({name: name});
  var result = sport.inventory.find(t=>t.equipment == item);
  var index = sport.inventory.indexOf(result); // get index if value found otherwise -1
if (index > -1) { //if found
  sport.inventory.splice(index, 1);
}
  await sport.save()
  res.json(sport);
})
app.put("/sports/deleteslot",async (req,res)=>{
    const slot_exists = await Slot.findOneAndDelete({$and: [{'date' : req.body.date},{'endTime': req.body.endTime}, {'startTime' : req.body.startTime}]});
    res.json(slot_exists)
})