import axios from "axios";

const ImageUpload = async (file: File): Promise<string> => {
    try {
        // Debug: Log all environment variables
        console.log("All VITE env vars:", import.meta.env);
        console.log("Cloudinary Cloud Name:", import.meta.env.VITE_CLOUDINARY_CLOUDNAME);
        console.log("Cloudinary Preset Name:", import.meta.env.VITE_CLOUDINARY_PRESETNAME);
        
        // Check if variables are undefined
        if (!import.meta.env.VITE_CLOUDINARY_CLOUDNAME) {
            throw new Error("VITE_CLOUDINARY_CLOUDNAME is undefined. Check your .env file!");
        }
        if (!import.meta.env.VITE_CLOUDINARY_PRESETNAME) {
            throw new Error("VITE_CLOUDINARY_PRESETNAME is undefined. Check your .env file!");
        }
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESETNAME);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUDNAME}/image/upload`,
            formData
        );

        return response.data.secure_url; 
    } catch (error) {
        console.error("Image upload failed:", error);
        throw new Error("Failed to upload image");
    }
};

export default ImageUpload;