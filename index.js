const {initializeDatabase} = require("./db/db.connection.js")

const express = require("express")

const app = express()
app.use(express.json())

// const fs = require("fs")

const Hotel = require("./model/HotelModel.js")
const { error } = require("console")


// const jsonData = fs.readFileSync("./data/hotelData.json","utf-8")

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.get("/",(req,res)=>{
    res.json("welcome to my Hotel express app")
})




async function createHotels(newHotel){
    await initializeDatabase()
    try{
        const hotel = new Hotel(newHotel)
        const saveHotel = await hotel.save()
        return saveHotel
    } catch(err) {
        console.log("Error loading Hotels",err)
    }
}

app.post("/hotels",async(req,res)=>{
    try {
        const addedHotel = await createHotels(req.body)
        if(!addedHotel) {
            return res.status(404).json({error:"newly added hotel not found"})
        }
        return res.status(201).json({message:"new Hotel Added successfully",hotelData:addedHotel})
    } catch(err){
        return res.status(500).json({error:"an erro occured while adding hotels"})
    }
})

async function getAllHotels(hotel) {
    await initializeDatabase()
    try {
        const allHotels = await Hotel.find()
        return allHotels
    } catch(err) {
        console.log("an error occured while getting all hotels")
        throw err
    }
}

app.get("/allHotels",async(req,res)=>{
    try {
        const hotels = await getAllHotels()
        if (!hotels === 0) {
            return res.status(404).json({error:"unable to get all hotels data"})
        } else {
            return res.status(200).json({message:"all hotels found successfully",allHotels:hotels})
        }
    } catch(err) {
        return res.status(500).json({error:"unable to find all Hotels",errorDetails:err.message})
    }
})

async function hotelWithName({hotelName}) {
    await initializeDatabase()
    try {
        const foundHotel = await Hotel.findOne({name:hotelName})
        return foundHotel
    } catch(err) {
        console.log("an error occured while getting hotels with id")
        throw err
    }
}

app.get("/hotelname/:name",async (req,res)=>{
    const hotelName = req.params.name
    try {
        
        const foundHotel = await hotelWithName({hotelName})
        if(!foundHotel) {
            return res.status(404).json({error:"hotel not founds"})
        } else {
            return res.status(200).json({message:"Hotel found successfully",hotelData:foundHotel})
        }
    } catch(err) {
        return res.status(500).json({error:"an error occured while getting hotel my title",errorDetails:err.message})
        throw err
    }
})


// const hotelData = JSON.parse(jsonData)


const PORT = 7737

app.listen(PORT,()=>{
    console.log(`App is running on Port ${PORT}`)
})


