import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";

export const router = Router()
router.get('/',(req,res)=>{
    res.json({
        message:"this is the '/' route"
    })
})
router.post('/signup',(req,res,next)=>{
    res.json({
        message:"Signup"
    })
})

router.post('/signin',(req,res,next)=>{
    res.json({
        message:"Signin"
    })
})

router.get('/elements',(req,res,next)=>{
    
})
router.get('/avatars',(req,res,next)=>{

})


router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)