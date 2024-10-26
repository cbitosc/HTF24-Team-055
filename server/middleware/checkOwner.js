const Task = require("../model/Task");

const checkOwner = async (req,res,next)=>{
    const {taskId }= req.params;
    const userId = req.user.id;
    try{
        const task = await Task.findById(taskId);
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        if(task.createdBy!=userId){
            return res.status(403).json({message:"You are not authorized to access this task"});
        }
        next();
    } catch(err){
        console.log(err);
        return res.status(500).json({message:"Unauthorized to access thsi task"});
    }
}

module.exports = checkOwner;