import {catchAsyncErrors} from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';
import { User } from '../models/userSchema.js';
import { v2 as cloudinary } from 'cloudinary';
import { generateToken } from '../utils/jwt_token.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from "crypto"




export const register = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler('Avatar and Resume are Required', 400));
    }

    const { avatar, resume } = req.files;

    const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder: 'AVATARS' }
    );
    if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
        console.error(
            'Cloudinary Error:',
            cloudinaryResponseForAvatar.error || 'Unknown Cloudinary error'
        );
        return next(new ErrorHandler('Error uploading avatar', 500));
    }

    const cloudinaryResponseForResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        { folder: 'MY_RESUME' }
    );
    if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
        console.error(
            'Cloudinary Error:',
            cloudinaryResponseForResume.error || 'Unknown Cloudinary error'
        );
        return next(new ErrorHandler('Error uploading resume', 500));
    }

    const {
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioUrl,
        githubUrl,
        instagramUrl,
        facebookUrl,
        twitterUrl,
        linkedInUrl
    } = req.body;

    const user = await User.create({
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioUrl,
        githubUrl,
        instagramUrl,
        facebookUrl,
        twitterUrl,
        linkedInUrl,
        avatar: {
            public_id: cloudinaryResponseForAvatar.public_id,
            url: cloudinaryResponseForAvatar.secure_url
        },
        resume: {
            public_id: cloudinaryResponseForResume.public_id,
            url: cloudinaryResponseForResume.secure_url
        }
    });

  generateToken(user,"user registered",201,res)
});



export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body
    if(!email,!password){
        return next (new ErrorHandler("email and password are required "))
    }
    const user  = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("invalid email or passord "))
    }
    const isPasswordMatched = await user.comparePasswrod(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Password not Matched"))
    }
    generateToken(user,"user logged in",201,res)

})


export const logout = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("token","",{
        expires : new Date(Date.now()),
        httponly:true
    })
    .json({
        success:true,
        message:"Logged Out "
    })
})

export const  getUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        portfolioUrl: req.body.portfolioUrl,
        githubUrl: req.body.githubUrl,
        instagramUrl: req.body.instagramUrl,
        facebookUrl: req.body.facebookUrl,
        twitterUrl: req.body.twitterUrl,
        linkedInUrl: req.body.linkedInUrl,
    };

    // Fetch the user once at the beginning
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Handle avatar update
    if (req.files && req.files.avatar) {
        const avatar = req.files.avatar;
        
        // Delete old avatar from cloudinary if it exists
        if (user.avatar && user.avatar.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        // Upload new avatar to cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            { folder: "AVATARS" }
        );

        newUserData.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url, // Use secure_url instead of sec
        };
    }

    // Handle resume update
    if (req.files && req.files.resume) {
        const resume = req.files.resume;

        // Delete old resume from cloudinary if it exists
        if (user.resume && user.resume.public_id) {
            await cloudinary.uploader.destroy(user.resume.public_id);
        }

        // Upload new resume to cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "MY_RESUME" }
        );

        newUserData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url, // Use secure_url instead of sec
        };
    }

    // Update the user with new data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false, // This option should be useFindAndModify
    });

    res.status(200).json({
        success: true,
        message: "Profile updated",
        user: updatedUser,
    });
});

export const updatePassword =catchAsyncErrors(async (req,res,next)=>{
    const {currentPassword,newPassword,confirmNewPassword}= req.body
    if(!currentPassword || !newPassword|| !confirmNewPassword){
        return next ( new ErrorHandler("please fiil all required fileds ",400))
    }
    const user = await User.findById(req.user.id).select("+password")
    if(!user){
        return next(new ErrorHandler("user not logged in "),400)
    }
    const isPasswordMatched = await user.comparePasswrod(currentPassword)
    console.log("passowrd matched")

    if(!isPasswordMatched){
        return next(new ErrorHandler("incorrecct current Password ",400))
        
    }
    if(newPassword !== confirmNewPassword){
        return next(new ErrorHandler("newpassword and confirmnewpassword doesnt matched "))
    }
    user.password= newPassword
    await user.save()
    res.status(200).json({
        success:true,
        message:"password updated successfully "
    })

})



export const getProfileForPortfolio = catchAsyncErrors(async (req,res,next)=>{
    const id = "66a14db813eb50f51e91afe2"
    const user = await User.findById(id)
    res.status(200).json({
        success:true,
        user
    })
})


export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 400));
    }

    console.log(user);

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
    const message = `Your reset password token is: \n\n${resetPasswordUrl} \n\nIf you have not requested this, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Personal Portfolio Dashboard Recovery Password",
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});



export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const token = req.params.token; // Access the token string from req.params
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex"); // Ensure "hex" is a string

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset password token is expired or invalid", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password and confirm password do not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    generateToken(user, "Reset password successfully", 200, res);
});
