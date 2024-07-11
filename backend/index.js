require("dotenv").config();

const config = require("./config.json")
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

//path variable
const path=require('path');

// Connecting to MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Could not connect to MongoDB...', err));

const User = require("./models/user.models");
const Note = require("./models/note.model");

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Create account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Full name is required" });
    }

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User Already Exists!",
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

//LOGIN CREDENTIALS

app.post("/login",async (req, res) => {
    const {email,password}=req.body;

    if(!email){
        return res.status(400).json({message:"Email is required"})
    }

    if(!password){
        return res.status(400).json({message:"Password is required"})
    }

    const userInfo=await User.findOne({email:email});

    if(!userInfo){
        return res.status(400).json({message:"User Not Found"})
    }

    if(userInfo.email==email && userInfo.password==password){
        const user={user: userInfo};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"36000m"
        });

        return res.json({
            error:false,
            message:"Login Successful",
            email,
            accessToken,
        });

    }
    else{
        return res.status(400).json({message:"iNVALID cREDENTIALS"})
    }

});

//GET USER
app.get("/get-user",authenticateToken,async (req, res) =>{
    const {user} = req.user; 

    const isUser=await User.findOne({_id:user._id});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user:{
            fullName:isUser.fullName,
            email:isUser.email,
            _id:isUser._id,
            createdOn:isUser.createdOn,
        },
        message:"",
    });
});

//ADD NOTE TO TODO LIST

app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags, deadline } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is Required" });
    }

    if (!content) {
        return res.status(400).json({ error: true, message: "Content is Required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
            createdOn: new Date(),
            deadline: deadline ? new Date(deadline) : null // Handle the deadline field
        });

        await note.save();

        return res.json({ error: false, note, message: "Note Added Successfully" });

    } catch (error) {
        console.error("Error adding note:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


//Edit using Id
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned, deadline } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags && isPinned === undefined && !deadline) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (tags !== undefined) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;
        if (deadline !== undefined) note.deadline = new Date(deadline);

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Updated",
        });

    } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});



//Get All
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    console.log("User ID from JWT:", user._id);

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        if (notes.length === 0) {
            console.log("No notes found for user:", user._id);
        }

        return res.json({ error: false, notes, message: "All Notes Retrieved" });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

//Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res)=>{
    const noteId=req.params.noteId;
    const {user}=req.user;

    try {
        const note=await Note.findOne({_id:noteId , userId:user._id});
        
        if(!note){
            return res.json({ error:false, message: "Note Not Found" });
        }

        await Note.deleteOne({_id:noteId,userId:user._id});

        return res.json({ error:false, message: "Deleted" });

    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

//pinned note
app.get("/search-notes/", authenticateToken, async (req, res)=>{
    const {query}=req.query;
    const {user} =req.user;

    if(!query){
        return res.status(400).json({error:true,message:"Search query is required"});
    }

    try{
        const matchingNotes=await Note.find({
            userId:user._id,
            $or:[
                {title:{$regex:new RegExp(query,"i")}},
                {content:{$regex:new RegExp(query,"i")}},
            ],
        });

        return res.json({
            error:false,
            notes:matchingNotes,
            message:"Notes Matching the search query"
        })

    }catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "clibackend", "build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "backend", "build", "index.html"));
    });
}

const port =process.env.PORT||8000;

app.listen(port, () => {
    console.log("Server is running on port ${port}");
});

module.exports = app;