const cloudinary = require('cloudinary').v2;
const fs=require("fs")

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async(image)=>{
	try {
		if(!image) {
			return null;
		}

		//uplod file on cloudinary
		const response= await cloudinary.uploader.upload(image,{
            resource_type: "auto"
		})
		//file has been uploaded successfully
		 fs.unlinkSync(image)
		return response;
		
	} catch (error) {
       fs.unlinkSync(image) // remove the locally saved temporary file as the uploded operation got failed
        return null;	
    } 
}

module.exports={uploadOnCloudinary}