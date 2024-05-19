const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3001;

app.use(express.json());
app.use(cors());

// let todos = [];

//connect mongodb
mongoose.connect('mongodb://localhost:27017/Todo-App')
.then(() =>{
    console.log('DB connected successfully')
})
.catch((err) => {
    console.log(err)
});

//creatiing schema
const todoSchema =new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    description : {
        required : true,
        type : String
    }
});

//creating model
const todoModel =mongoose.model('Todo',todoSchema);


app.post('/todos', async (req,res) => {

    const {title,description} = req.body;
    // const newTOdo = {
    //     id :todos.length + 1 ,
    //     title,
    //     description
    // };

    // todos.push(newTOdo);
    // console.log(todos);
    // res.status(201).json(newTOdo)

    try{
        const newTodo = new todoModel({title,description});
        await newTodo.save();
        res.status(200).json(newTodo);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : error.message});
    }

});

//GetAllItems

app.get('/todos',async (req,res) => {

    try{
     const todos = await todoModel.find();
     res.json(todos);
    }
    catch(error){
     console.log(error)
     res.status(500).json({message : error.message});
    }; 

});

//update todo item
app.put('/todos/:id', async (req, res) => {

    try{
        const {title,description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        { title, description},
        { new: true }
    );
    if(!updatedTodo){
        return res.status(404).json({message : "Todo not found"})
    };
    res.json(updatedTodo)
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : error.message})
    };
});

//Delete a Todo item
app.delete('/todos/:id',async (req,res) => {
    try{
        const ID = req.params.id;
        await todoModel.findByIdAndDelete(ID)
        res.status(204).end();
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : error.message})
    }; 
});

app.listen(port ,() =>{
    console.log('server listeing to port '+ port)
})

