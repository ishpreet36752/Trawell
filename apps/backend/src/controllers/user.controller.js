const User=require("../models/user")

// register a new user
 async function registerUser(req, res) {
	try {
		const {firstName,lastName,emailId,password, age , gender, image, about} = req.body;

	// check required fields are present or not
	if(!firstName || !emailId || !password  ){
		return res.status(400).json({message: "First name, email and password are required"});
	}
		// check if user already exists
		const existingUser = await User.find({emailId: emailId});
		if(existingUser.length > 0){
			return res.status(400).json({message: "User already exists with this email"});
		}
		// create a new user
		const newUser=await User.create({
			firstName,
			lastName,
			emailId,
			password,
			age,
			gender,
			image,
			about
		})
		const token=await newUser.getJWT();
		return res.cookie(
			"token", token, {
              httpOnly: true,      // only accessible via HTTP, not JS
             maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            }).status(201).json({message: "User registered successfully", user: newUser});

	} catch (error) {
		return res.status(500).json({message: "Server error", error: error.message});
		
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

module.exports={registerUser,loginUser,getUserProfile}