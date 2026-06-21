import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";


const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: async () => ({
        folder: "tasks",
        resource_type: "auto",
        allowed_formats: [
            "jpg",
            "png",
            "pdf",
            "mp4"
        ]
    })

});


export const upload = multer({
    storage
});