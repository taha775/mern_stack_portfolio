import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js"
import { Skill } from "../models/skillSchema.js"
import { v2 as cloudinary } from 'cloudinary';



export const addNewSkills = catchAsyncErrors(async(req,res,next)=>{
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('Skill svg required', 400));
    }
    
    const {svg} = req.files
    const {title, proficiency}=req.body
    if(!title || !proficiency){
        return next(new ErrorHandler("please fill full form ", 400))
    }


    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        { folder: 'PORTFOLIO_SKILL_SVGS' }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            'Cloudinary Error:',
            cloudinaryResponse.error || 'Unknown Cloudinary error'
        );

    }

    const skill =  Skill.create({
        title,
        proficiency,
        svg:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url

}
    })
    res.status(200).json({
        success:true,
        message:"New Skill Added ",
        skill,
    })
})


export const deleteSkills = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params
    const skill = await Skill.findById(id)
    if(!skill){
        return next(new ErrorHandler("skill not found",400))
    }
    const skillSvgId = skill.svg.public_id
    await cloudinary.uploader.destroy(skillSvgId)
    await skill.deleteOne()
    res.status(200).json({
        success:true,
        message:"skill deleted"

    })

})

export const updateSkills = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params
    let skill =await Skill.findById(id)
    if(!skill){
        return next(new ErrorHandler("skill not found",400))
    }

    const {proficiency} = req.body
    skill = await Skill.findByIdAndUpdate(
        id,
        {proficiency},
        {new:true,
            runValidators:true,
            usefindAndModify:false
        }
    ) 

    res.status(200).json(
        {
            success:true,
            message:"skill updated",
            skill
        }
    )

})

export const getAllSkills = catchAsyncErrors(async(req,res,next)=>{

    const skills = await Skill.find()
    res.status(200).json({
        success:true,
        skills
    })

})