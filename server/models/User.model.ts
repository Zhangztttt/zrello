import { generateHash } from '../utils/hash';
import { Schema,model,Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document{
    name:String;
    email:String;
    password:String;
    stripeCustomerId?:String;
    comparePassword:(password:string)=>Promise<boolean>
}

const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"请输入用户名"]
    },
    email:{
        type:String,
        required:[true,"请输入邮箱"],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"请输入密码"],
        select:false
    },
    stripeCustomerId:{
        type:String,
        default:null
    }
},{
  timestamps:true
})

userSchema.pre("save",async function(next) {
  if(!this.isModified('password')) return next()
  this.password = await generateHash(this.password)
})

userSchema.methods.comparePassword =async function(password:string){
    return await bcrypt.compare(password,this.password)
}

export const User = model<UserDocument>('User',userSchema)