import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

import Device from '../models/device.model.js';
import Rider from '../models/rider.model.js';

export const getAllMyDevices = async(req, res) =>{
    const id=req.body._id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(200).json({success: false, message: "Authentication failed!!"});
    }

    try{
        const devices = await Device.find({"user":id});
        if(!devices instanceof Array || devices.length === 0){
            res.status(200).json({success: false, message: "No devices registered!"});
        }else{
            res.status(200).json({success: true, data: devices});
        }
        
    }catch(error){
        console.error("Error trying to retrieve the list of all devices from Database!");
        res.status(500).json({success: false, message: "Server Error"});
    }

    return res;
};

export const registerNewDevice = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const deviceID = req.body.deviceID;
    const location=req.body.location;
    const id = req.body._id;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(!deviceID ||deviceID.length < 1){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});
    }
    
    if(!location || location.length <1){
        return res.status(200).json({success: false, message: "Invalid Device Location!"});
    }

    if(!password || password.length <1){
        return res.status(200).json({success: false, message: "Invalid Device Password for manual unlock!"});
    }else if(password.length <8){
        return res.status(200).json({success: false, message: "Device Password for manual unlock should not be less than 8 characters in length!"});
    }else if(!confirmPassword || confirmPassword.length <1){
        return res.status(200).json({success: false, message: "Please confirm the password!"});
    }else if(password !== confirmPassword){
        return res.status(200).json({success: false, message: "Password mismatched! Please confirm the password again"});
    }

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(200).json({success: false, message: "Authentication failed!"});
    }

    const salt = Number (process.env.SALT || 10);
    const session = await mongoose.startSession();
    try{
        const existingDevice = await Device.find({"deviceID": deviceID});

        if(existingDevice.length > 0){
            return res.status(200).json({success: false, message: "Device ID is already registered!"});
        }

        const hashedPassword = await bcrypt.hash(password, salt);

        session.startTransaction();
        const newDevice = new Device();
        newDevice.deviceID = deviceID;
        newDevice.location = location;
        newDevice.password = hashedPassword;
        newDevice.user = id;

        await newDevice.save({session});
        await session.commitTransaction();

        res.status(200).json({success: true, data:[newDevice]});
    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in New Device Registration! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const updateDevice = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const { id } = req.params;
    const deviceID = req.body.deviceID;
    const location = req.body.location;

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(200).json({success: false, message: "Authentication failed!"});
    }

    if(!deviceID || deviceID < 1){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});
    }

    if(!location || location.length < 1){
        return res.status(200).json({success: false, message: "Invalid Device Location!"});
    }

    const session = await mongoose.startSession();
    try{

        const device = await Device.findById(id);
        if(!device){
            return res.status(200).json({success: false, message: "Device DB ID not found!"});
        }

        const existingDevice = await Device.find({"deviceID": deviceID});
        if(Array.isArray(existingDevice) && existingDevice.length>0 && existingDevice[0]._id.toString() != id.toString()){
            return res.status(200).json({success: false, message: "Device ID is already registered!"});
        }
        
        session.startTransaction();
        device.deviceID = deviceID;
        device.location = location;

        const updatedDevice = await Device.findByIdAndUpdate(id, device, {new: true, session});

        await session.commitTransaction();

        res.status(200).json({success: true, data:[updatedDevice]});

    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in updating the Device information! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const updateDevicePassword = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const { id } = req.params;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(200).json({success: false, message: "Authentication failed!"});
    }

    if(!password || password.length <1){
        return res.status(200).json({success: false, message: "Invalid Device Password for manual unlock!"});
    }else if(password.length <8){
        return res.status(200).json({success: false, message: "Device Password for manual unlock should not be less than 8 characters in length!"});
    }else if(!confirmPassword || confirmPassword.length <1){
        return res.status(200).json({success: false, message: "Please confirm the password!"});
    }else if(password !== confirmPassword){
        return res.status(200).json({success: false, message: "Password mismatched! Please confirm the password again"});
    }
    
    const salt = Number (process.env.SALT || 10);
    const session = await mongoose.startSession();
    try{

        const device = await Device.findById(id);
        if(!device){
            return res.status(200).json({success: false, message: "Device DB ID not found!"});
        }

        const hashedPassword = await bcrypt.hash(password, salt);
        session.startTransaction();
        device.password = hashedPassword;

        const updatedDevice = await Device.findByIdAndUpdate(id, device, {new: true, session});

        await session.commitTransaction();

        res.status(200).json({success: true, message:"password updated"});

    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in updating the Device information! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const deviceSelfCheck = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const deviceID = req.body.deviceID;
    
    if(deviceID != null && deviceID.toString().length <=0){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});    
    }

    const session = await mongoose.startSession();
    try{
        const existingDevice = await Device.find({"deviceID": deviceID});

        if(existingDevice.length <= 0){
            return res.status(200).json({success: false, message: "Invalid Device ID!"});
        }else{
            session.startTransaction();
            const device = existingDevice[0];
            device.isOnline=true;
            device.lastUnlockCheck=Date.now();
            await Device.findByIdAndUpdate(device._id, device, {new: true, session});
            await session.commitTransaction();

            res.status(200).json({success: true, message: "Device checked!"});
        }
        
    }catch(error){
        await session.abortTransaction();
        console.error("Error trying to search for devices in the Database!");
        res.status(500).json({success: false, message: "Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const getOnlineStatusCount = async (req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const id = req.body._id;
    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(200).json({success: false, message: "Authentication failed!"});
    }


    try{
        const userId =mongoose.Types.ObjectId.createFromHexString(id);
        const result = await Device.aggregate([
            {
                $match: {
                user: userId
                }
            },{
                $group: {
                _id: "$isOnline",
                value: { $sum: 1 }
                }
            },
            {
                $project: {
                _id: 0,
                status: {
                    $cond: { if: { $eq: ["$_id", true] }, then: "Online", else: "Offline" }
                },
                value: 1
                }
            }
        ]);


        if(!result instanceof Array || result.length === 0){
            res.status(200).json({success: false, message: "No record found!"});
        }else{
            res.status(200).json({success: true, data: result});
        }

    }catch(error){
        console.error("Error trying retrieve the Data Online status of devices!");
        console.error(error.stack);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const unlockRiderDevice = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const id = req.body._id;
    const deviceID = req.body.deviceID;

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(200).json({success: false, message: "Authentication failed!"});
    }

    if(!deviceID || deviceID < 1){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});
    }
    
    
    const session = await mongoose.startSession();
    try{
        const rider = await Rider.findById(id);
        if(!rider){
            return res.status(200).json({success: false, message: "Authentication failed"});
        }

        const device = await Device.find({"deviceID":deviceID});
        if(!device||device.length<1){
            return res.status(200).json({success: false, message: "Device ID not found!"});
        }

        session.startTransaction();
        device[0].isUnlocked = true;

        const updatedDevice = await Device.findByIdAndUpdate(device[0]._id, device[0], {new: true, session});

        await session.commitTransaction();

        res.status(200).json({success: true, message:"device unlocked!"});

    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in updating the Device information! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}

export const unlockOwnerDevice = async(req, res) =>{
    if(!req.body){
        return res.status(400).json({success: false, message: "Invalid values!"});
    }

    const id = req.body._id;
    const deviceID = req.body.deviceID;
    const password = req.body.password;

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(200).json({success: false, message: "Authentication failed!"});
    }

    if(!deviceID || deviceID < 1){
        return res.status(200).json({success: false, message: "Invalid Device ID!"});
    }

    if(!password){
        return res.status(200).json({success: false, message: "Invalid Password!"});
    }
    
    
    const session = await mongoose.startSession();
    try{

        const device = await Device.find({"deviceID":deviceID});
        if(!device||device.length<1){
            return res.status(200).json({success: false, message: "Device ID not found!"});
        }

        if(device[0].user.toString() !== id){
            return res.status(200).json({success: false, message: "Authentication failed!"});
        }

        const correctPassword = await bcrypt.compare(password, device[0].password);
        
        if(!correctPassword){
            return res.status(200).json({success: false, message: "Invalide Password!"});
        }
        
        session.startTransaction();
        device[0].isUnlocked = true;

        const updatedDevice = await Device.findByIdAndUpdate(device[0]._id, device[0], {new: true, session});

        await session.commitTransaction();

        res.status(200).json({success: true, message:"device unlocked!"});

    }catch(error){
        if(session.inTransaction()){
            await session.abortTransaction();
        }
        console.error("Error in updating the Device information! - "+error.message);
        res.status(500).json({success: false, message:"Server Error"});
    }finally{
        await session.endSession();
    }

    return res;
}