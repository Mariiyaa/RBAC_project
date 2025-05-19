import { Request,Response } from "express";
import bcryptjs from "bcryptjs";
import  User from "../models/User"
import jwt, { SignOptions } from "jsonwebtoken";
import { redisClient } from "../config/redis";
import { publishUserCreated } from "../utils/rabbit";

const createToken = (id: string, role: string): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = (process.env.JWT_EXPIRATION || "1d") as jwt.SignOptions["expiresIn"];
  
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in .env");
    }
  
    const options: SignOptions = { expiresIn };
    return jwt.sign({ id, role }, secret, options);
  }
export const signup =async (req: Request, res: Response): Promise<any> => {

    const { email, password ,role} = req.body;
    console.log(req.body);
try {
    
    const user = await User.findOne({email})
    if(user){
        console.log("User already exists");
        return res.status(400).json({
            message:"User already exists"
        })
        
    }
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password,salt)

    const newUser = await new User({
        email,
        password:hashedPassword,
        role
    })
    await newUser.save()

    const token = createToken(newUser._id.toString(), newUser.role);
    res.status(201).json({ message: "User created successfully" });

    // Do side effects after response
    await publishUserCreated({
        id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
    });
    await redisClient.set(newUser._id.toString(), token);

} catch (error : any) {
    console.log("Signup error:", error);
    if (error.code === 11000) {
        return res.status(400).json({ message: "User already exists" });
    }
    return res.status(500).json({
        error
    })
    
    
    }

}

export const login = async (req: Request, res: Response): Promise<any>  => {
    const { email, password } = req.body;
 console.log(email,password)
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        } 
        
        const valid = await bcryptjs.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const token = createToken(user._id.toString(), user.role);
        await redisClient.set(user._id.toString(), token);

        res.status(201).json({token,message :"Login successfully"})
    } catch (error) {   
        console.log(error);
        return res.status(500).json({
            error,
        });
        
    }
}

    