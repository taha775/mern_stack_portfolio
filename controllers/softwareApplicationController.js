import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/error.js"
import { SoftwareApplication } from "../models/softwareApplicationSchema.js"
import { v2 as cloudinary } from 'cloudinary';






export const addnewApplication =catchAsyncErrors(async (req,res,next)=>{
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('Software Application icon /svg required', 400));
    }
    
    const {svg} = req.files
    const {name}=req.body
    if(!name){
        return next(new ErrorHandler("Software's name is required", 400))
    }


    const cloudinaryResponse = await cloudinary.uploader.upload(
        svg.tempFilePath,
        { folder: 'PORTFOLIO_SOFTWARE_APPLICATIONS' }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            'Cloudinary Error:',
            cloudinaryResponse.error || 'Unknown Cloudinary error'
        );

    }

    const softwareapplication =  SoftwareApplication.create({
        name,
        svg:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url

}
    })
    res.status(200).json({
        success:true,
        message:"New Software Applications Added ",
        softwareapplication,
    })
}) 
export const getAllApplications =catchAsyncErrors(async (req,res,next)=>{   
    const softwareapplication = await SoftwareApplication.find()
    res.status(200).json({
        success:true,
        softwareapplication
    })
   


}) 

export const deleteApplication =catchAsyncErrors(async (req,res,next)=>{

    const {id} = req.params
    const softwareapplication = await SoftwareApplication.findById(id)
    if(!softwareapplication){
        return next(new ErrorHandler("software Application not found",400))
    }
    const softwareApplicationSvgId = softwareapplication.svg.public_id
    await cloudinary.uploader.destroy(softwareApplicationSvgId)
    await softwareapplication.deleteOne()
    res.status(200).json({
        success:true,
        message:"software application deleted"

    })



}) 




