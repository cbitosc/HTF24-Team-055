const router = require("express").Router();
const Task = require("../model/Task");
const User = require("../model/User");
const authenticate = require("../middleware/authentication");
const checkOwner = require("../middleware/checkOwner");

router.get("/",authenticate,async(req,res)=>{
    const userId = req.user.id;
    console.log(userId);
    try{
        const tasks = await Task.find({createdBy: userId});
        console.log(tasks);
        res.json(tasks);
    }
    catch(error){
        res.status(400).json("Error in fetching tasks");
    }
});

router.post("/",authenticate,async(req,res)=>{
    const {title,description,status} = req.body;
    const userId = req.user.id;
    try{
        const task = new Task({title:title,description:description,createdBy:userId,status:status});
        await task.save();
        res.status(200).json({message:"Task created successfully"});
    } catch(err) {
        console.log(err);
        res.status(400).json({message:"Task creation failed"});
    }
});

router.put("/:taskId",[authenticate,checkOwner],async(req,res)=>{
    const {taskId} = req.params;
    const {title,description,status} = req.body;
    try{
        const updatedTask = await Task.findByIdAndUpdate(taskId,{title,description,status},{new:true});
        if(!updatedTask){
            return res.status(404).json({message:"Task not found"});
        }
        res.json({message:"Task updated"});
    }
    catch(err){
        res.status(400).json({message:"Task update failed"});
    }
});

router.delete("/:taskId",[authenticate,checkOwner],async (req,res)=>{
    const {taskId} = req.params;
    try{
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if(!deletedTask){
            return res.status(404).json({message:"Task not found"});
        }
        res.json({message:"Task deleted"});
    } catch(err) {
        res.status(400).json({message:"Error in deleting task."})
    }
});

router.patch("/:taskId/status",async (req,res)=>{
    const {taskID} = req.params;
    const {status} = req.body;
    if(!["planned","ongoing","completed"].includes(status)){
        return res.status(400).json({message:"Invalid Status Value"});
    }
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId,{status},{new:true});
        if(!updatedTask){
            return res.status(404).json({message:"Task not found"});
        }
        res.json({message:"Task status changed"});
    } catch(err){
        res.status(400).json({message:"Error patching status"});
    }
})

module.exports = router;