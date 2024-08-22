import express from "express";
import { run_query } from "../db/connectiondb.js";
import multer from "multer";
import cloudinary from "cloudinary";

cloudinary.config({ 
    cloud_name: 'dvt7ktdue', 
    api_key: '343128951383287', 
    api_secret: '86-oV6lIZFuMi6PtLM_oi2bKn50',
    debug: true // Enable debug mode for Cloudinary
});

const router = express.Router();

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to update patient profile
router.post('/patientprofile', upload.single('profilePhoto'), async (req, res) => {
    console.log('Received request to update patient profile');
    console.log('Request body:', req.body);

    const { patientName, patientEmail, patientPhone, patientDob, patientDistrict, patientArea, patientRoadNum, patientGender, patientPassword } = req.body;

    if (!patientEmail) {
        console.error('Patient email is required');
        return res.status(400).json({ error: 'Patient email is required' });
    }

    let profilePhotoUrl = null;
    let profilePhotoPublicId = null;
    let profilePhotoVersion = null;

    // If a profile picture is uploaded, process the image
    if (req.file) {
        console.log('Profile photo detected, starting upload to Cloudinary');

        try {
            const result = await new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        return reject(error);
                    }
                    console.log('Upload to Cloudinary successful:', result);
                    resolve(result);
                }).end(req.file.buffer); // Pass the buffer directly here
            });

            profilePhotoUrl = result.secure_url;
            profilePhotoPublicId = result.public_id;
            profilePhotoVersion = result.version;

        } catch (error) {
            console.error('Error during Cloudinary upload:', error);
            return res.status(500).json({ error: 'Upload to Cloudinary failed' });
        }
    } else {
        console.log('No profile photo uploaded');
    }

    try {
        // SQL query to update patient profile
        let updateQuery = `
            UPDATE PATIENT
            SET PATIENT_NAME = :patientName,
                PATIENT_PHONE = :patientPhone,
                PATIENT_DOB = TO_DATE(:patientDob, 'YYYY-MM-DD'),
                PATIENT_DISTRICT = :patientDistrict,
                PATIENT_AREA = :patientArea,
                PATIENT_ROADNUMBER = :patientRoadNum,
                PATIENT_GENDER = :patientGender
        `;

        // If a password is provided, add it to the update query
        if (patientPassword) {
            updateQuery += `, PATIENT_PASSWORD = :patientPassword`;
        }

        // If a profile picture was uploaded, add it to the update query
        if (profilePhotoUrl) {
            updateQuery += `, URL = :profilePhotoUrl, PUBLIC_ID = :profilePhotoPublicId, VERSION = :profilePhotoVersion`;
        }

        updateQuery += ` WHERE PATIENT_MAIL = :patientEmail`;

        console.log('Running SQL query to update patient profile:', updateQuery);

        // Running the update query with provided values
        await run_query(updateQuery, {
            patientName,
            patientPhone,
            patientDob,
            patientDistrict,
            patientArea,
            patientRoadNum,
            patientGender,
            patientPassword,
            profilePhotoUrl,
            profilePhotoPublicId,
            profilePhotoVersion,
            patientEmail,
        });

        console.log('Profile updated successfully');
        res.json({ message: 'Profile updated successfully!' });

    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
