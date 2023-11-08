
import express, { Router } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import serverless from "serverless-http";

const app=express();
const router=Router();
//dotenv.config({ path: `.env.${process.env.NODE_ENV}`});
dotenv.config();
const port=process.env.PORT;
const API_URL=process.env.API_URL;

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//initial content
app.get("/", async (req, res)=>{
    try{
    const result = await axios.get(API_URL);
    res.render("index.ejs", {
        content: result.data
    });
    } catch (error){
        res.render("index.ejs", {
            content: error
        });
    }
});

//Get by id
app.get("/api/posts/complete/:id", async (req,res)=>{
    const newBody={completed: true};
    try{
    const result= await axios.patch(API_URL+"/tasks/"+req.params.id, newBody);
    res.redirect("/");
    }catch(error){
        res.render("index.ejs", {
            content: error
        });
    }

});

//Add Page
app.get("/new", (req, res) => {
    res.render("modify.ejs", { heading: "New Task", submit: "Create Task" });
  });

  //Delete
app.get("/api/posts/delete/:id", async (req, res)=>{
    try{
    const result= await axios.delete(API_URL+"/tasks/"+req.params.id);
    console.log(result.data);
    res.redirect("/");
    }catch(error){
        res.status(500).json({error: error});
    }
});

//update using patch
app.get("/edit/:id", async (req, res)=>{

    try{
    const result= await axios.get(API_URL+"/tasks/"+req.params.id);

    res.render("modify.ejs", {
        heading: "Update Task",
        submit: "Update Task",
        content: result.data
    });

    console.log(result.data);
    }catch(error){
        res.status(500).json({error: error});
    }

});

app.post("/api/posts/:id", async (req, res)=>{
    try{
    const result= await axios.patch(API_URL+"/tasks/"+req.params.id, req.body);
    console.log(result.data);
    res.redirect("/");
    }catch(error){
        res.status(500).json({error: error});
    }

});

//add to db
app.post("/api/posts", async (req, res)=>{
    try{
    const result= await axios.post(API_URL+"/tasks", req.body);
    console.log(result.data);
    res.redirect("/");
    }catch(error){
        res.status(500).json({error: error});
    }
    
});

//app.use("/", router);

app.listen(port, ()=>{
    console.log(`Client started at port: ${port}`);
});

export default app;