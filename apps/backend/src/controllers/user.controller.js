const User=require("../models/user");
const { uploadOnCloudinary } = require("../utilis/cloudinary");

// register a new user
async function registerUser(req, res) {
	try {
		const { firstName, lastName, emailId, password, age, gender, about } = req.body;

		// check required fields are present or not
		if (!firstName || !emailId || !password) {
			return res.status(400).json({ message: "First name, email and password are required" });
		}
		// check if user already exists
		const existingUser = await User.find({ emailId: emailId });

		if (existingUser.length > 0) {
			return res.status(400).json({ message: "User already exists with this email" });
		}
		const profileImageLocalPath = req.file?.path;

		let profileImage;

		if (profileImageLocalPath) {
			profileImage = await uploadOnCloudinary(profileImageLocalPath);
		}
		// create a new user
		const userData = {
			firstName,
			lastName,
			emailId,
			password,
			age,
			gender,
			about,
		};

		if (profileImage?.url) {
			userData.profileImage = profileImage.url;
		}
		const newUser = await User.create(userData);

		// generate token
		const token = await newUser.getJWT();

    if (!token) {
      return res
        .status(500)
        .json({ message: "Failed to generate authentication token" });
    }
		
		return res.cookie("token", token, {
			httpOnly: true, // only accessible via HTTP, not JS
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		}).status(201).json({ message: "User registered successfully", user: newUser });

	} catch (error) {
		return res.status(500).json({ message: "Server error", error: error.message });
  }
}
 
// login user
async function loginUser(req, res) {
	try {
		const{emailId,password}=req.body;
		if(!emailId || !password){
		  return res.status(400).json({message: "Email and password are required"});
		}
		const user=await User.findOne({emailId: emailId})
		if(!user){
			return res.status(400).json({message: "user not found with this email"});
		}
		const isMatch=await user.validatePassword(password, user.password);
		if(!isMatch){
			return res.status(400).json({message: "Invalid  password"});
		}
		// generate token
		const token= await user.getJWT();
          
		return  res.cookie
		("token", token, {
        httpOnly: true,      // only accessible via HTTP, not JS
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).status(200).json({message: "User logged in successfully", user: user});
	} catch (error) {
		return res.status(500).json({message:"error while login",error:error})
	}
}

// fetch user profile
 async function getUserProfile(req, res) {
 try {
	const userId=req.params.userId;
	const user=await User.findById(userId).select('-password'); // exclude password field
	if(!user){
		return res.status(404).json({message: "User not found"});
	}
	return res.status(200).json({user: user});
 } catch (error) {
	return res.status(500).json({message: "Server error", error: error.message});
 }
}
//  logout user
async function logout(req,res){
 try{
	
	let  existUser = await User.findByIdAndUpdate(req.user._id);
  
	if (!existUser) {
	  // If not found in User model, check in Employee model
	  existUser = await Employee.findByIdAndUpdate( req.user._id); 
	}
  
	if (!existUser) { 
		// console.log("user not found");
	  return res.status(404).json(404, {}, "User not found");
	} 
	const token = await User.findById(req.user._id).select("token")

	const options = {
        httpOnly: true,
        secure: true
	}
	return res
	  .status(200)
	  .clearCookie("token",token,options)
	  .json( {message: "User logged out"});
  }
  catch(err){
	return res.status(500).json(err.message);
  }
}
//  update user profile like firstName , lastName, gender , age , about
async function updateUser(req,res) {
	try {
		const {firstName,lastName,emailId,age, gender,about}=req.body;
		const userId=req.user._id;
		const user=await User.findById(userId);
		if(!user){
			return res.status(404).json({message:"user not found"});
		}
		const updateUser=await User.findByIdAndUpdate(userId,
			{
				firstName:firstName,
				lastName:lastName,
				emailId:emailId,
				age:age,
				about:about,
				gender:gender,
				
			},
			{ new:true, runValidators:true}
		);

		return res.status(200).json({message:"update user sucessfully" , user:updateUser})

	} catch (error) {
		return res.status(500).json({message:"error while updating userprofile",error:error.message});
	}
	
}

// update user password
async function updatePassword(req,res) {
	try {
		const {currentPassword,newPassword}=req.body
		const user=await User.findById(req.user._id);
		if(!user){
			return res.status(404).json({message:"user not found"})
		}
		if( !currentPassword || !newPassword ){
			return res.status(404).json({message:"please enter current and new password"})
		}
		const isMatch= await user.validatePassword(currentPassword,user.password)
		if(!isMatch){
			return res.status(401).json({message:"Incorrect current password"})
		}
		if (currentPassword === newPassword) {
            return res.status(400).json({message:"New password cannot be the same as current password"})
      }

		user.password=newPassword;
		await user.save();
       return res.status(200).json({message:"password updated"})


	} catch (error) {
		return res.status(500).json({message:"error while update password" , error:error.message})
	}
	
}

// update profile image of the user
async function updateProfileImage(req,res) {
	try {
		const user=await User.findById(req.user._id)
		if(!user){
			return res.status(404).json({message:"user not found"})
		}

		const profileImageLocalPath=req.file?.path;
		let profileImage;
		if(profileImageLocalPath){
			profileImage=await uploadOnCloudinary(profileImageLocalPath)
		}
		user.profileImage=profileImage.url;
		await user.save();
		return res.status(200).json({message:"updated user profile",user:user.profileImage})
	} catch (error) {
		return res.status(500).json({message:"error while updating profile image",error:error.message})
	}
	
}
//  delete user profile
async function deleteUserProfile(req,res) {
	try {
		const {password}=req.body
		if(!password){
			return res.status(400).json({message:"please enter password"})
		}
		const user =await User.findById(req.user._id)
		if(!user){
			return res.status(404).jason({message:"user not found"})
		}
		const isMatch=await user.validatePassword(password,user.password)
		if(!isMatch){
			return res.status(401).json({message:"wrong password enter valid password"})
		}
		await user.deleteOne()
		return res.status(200).json({message:"successfully delete user profile"})
		
	} catch (error) {
		return res.status(500).json({message:"error while deleting profile",error:error.message})
	}
	
}
module.exports={
	registerUser,
	loginUser,
	getUserProfile,
	logout,
	updateUser,
	updatePassword,
	updateProfileImage,
	deleteUserProfile
}