const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');

const customDomain = 'https://r2.haojin.li';

// Configure S3 for Cloudflare R2
const s3 = new AWS.S3({
    endpoint: process.env.R2_ENDPOINT,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: 'auto'
});

// Function to ensure only image files are uploaded
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
    }
};

// Configure multer (use memory storage and custom file validation)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Function to upload file to Cloudflare R2 with a unique name
const uploadToR2 = (file) => {
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.originalname}`;

    const params = {
        Bucket: 'trailmix',
        Key: uniqueFilename,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    return s3.upload(params).promise().then(result => {
        // Construct the image URL using the custom domain
        return {
            ...result, // Original result (in case you need other properties)
            Location: `${customDomain}/${uniqueFilename}` // Override Location with custom domain URL
        };
    });
};


// Export the multer middleware for multiple files
module.exports = {
    upload: upload.array('images', 10),
    uploadToR2
};