const express=require("express")
const {auth}=require("../middleware/auth.middleware")
const {NoteModel}=require("../model/note.model")

const noteRouter=express.Router()

noteRouter.use(auth)

noteRouter.post("/create",async(req,res)=>{
    try{
        const note=new NoteModel(req.body)
        await note.save()
        res.status(200).json({msg:"A new note has been created!"})
    } catch(err){
        res.status(400).json({error:err})
    }
})

noteRouter.get("/",async(req,res)=>{
    try{
        const notes=await NoteModel.find({userID:req.body.userID})
        res.status(200).json({notes})
    } catch(err){
        res.status(400).json({error:err})
    }
})

noteRouter.patch("/update/:noteID",async(req,res)=>{
    const {noteID}=req.params
    const note=await NoteModel.findOne({_id:noteID})
    try{
        if(note.userID===req.body.userID){
            await NoteModel.findByIdAndUpdate({_id:noteID},req.body)
            res.status(200).json({msg:`The note with ID:${noteID} has been updated`})
        } else {
            res.status(200).json({msg:"You are not authorised!"})
        }
    } catch(err){
        res.status(400).json({error:err})
    }
})

noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const {noteID}=req.params
    const note=await NoteModel.findOne({_id:noteID})
    try{
        if(note.userID===req.body.userID){
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.status(200).json({msg:`The note with ID:${noteID} has been deleted`})
        } else {
            res.status(200).json({msg:"You are not authorised!"})
        }
    } catch(err){
        res.status(400).json({error:err})
    }
})

module.exports={
    noteRouter
}