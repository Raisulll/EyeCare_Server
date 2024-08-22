import express from "express";
import { run_query } from "../db/connectiondb.js";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({ 
    cloud_name: 'dvt7ktdue', 
    api_key: '343128951383287', 
    api_secret: '86-oV6lIZFuMi6PtLM_oi2bKn50' 
  });

const router = express.Router();

// Route to fetch all doctors
router.get('/doctors', async (req, res) => {
    try {
        const query = 'SELECT DOCTOR_ID, DOCTOR_NAME, DOCTOR_SPECIALITY FROM DOCTOR';
        const doctors = await run_query(query, []);
        console.log(doctors);
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

// Route to fetch time slots for a specific doctor
router.get('/doctors/:doctorId/times', async (req, res) => {
    const doctorId = parseInt(req.params.doctorId, 10);
    if (isNaN(doctorId)) {
        return res.status(400).json({ error: 'Invalid doctor ID' });
    }
    try {
        const query = 'SELECT DOCTOR_TIMESLOT FROM DOCTOR WHERE DOCTOR_ID = :doctorId';
        const times = await run_query(query, { doctorId });
        console.log(times);
        res.json(times);
    } catch (error) {
        console.error(`Error fetching time slots for doctor ID: ${doctorId}`, error);
        res.status(500).json({ error: 'Failed to fetch time slots' });
    }
});

// Route to fetch all appointments for a specific patient
router.get('/appointments', async (req, res) => {
    const patientId = parseInt(req.query.patientId, 10);
    if (isNaN(patientId)) {
        return res.status(400).json({ error: 'Invalid patient ID' });
    }
    try {
        const query = `
            SELECT A.APPOINTMENT_ID, A.APPOINTMENT_DATE, A.APPOINTMENT_TIME, A.APPOINTMENT_STATUS, 
                   D.DOCTOR_NAME, D.DOCTOR_SPECIALITY
            FROM APPOINTMENT A
            JOIN DOCTOR D ON A.DOCTOR_ID = D.DOCTOR_ID
            WHERE A.PATIENT_ID = :patientId
        `;
        const appointments = await run_query(query, { patientId });
        console.log(appointments);
        res.json(appointments);
    } catch (error) {
        console.error(`Error fetching appointments for patient ID: ${patientId}`, error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Route to book an appointment
// Helper function to get the next occurrence of a specific day of the week
function getNextDayOfWeek(dayOfWeek) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = daysOfWeek.indexOf(dayOfWeek);
    if (dayIndex === -1) throw new Error('Invalid day of the week provided');

    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay();
    
    // Calculate how many days until the next occurrence of the specified day
    const daysUntilNextOccurrence = (dayIndex + 7 - currentDayIndex) % 7 || 7;
    
    const nextDate = new Date();
    nextDate.setDate(currentDate.getDate() + daysUntilNextOccurrence);
    
    return nextDate;
}
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload a profile picture and store it in the database
router.post('/upload-picture', upload.single('profilePhoto'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imageStream = streamifier.createReadStream(req.file.buffer);

    cloudinary.v2.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
        if (error) {
            console.error('Error uploading to Cloudinary:', error);
            return res.status(500).send('Upload to Cloudinary failed');
        }

        // SQL query to insert the picture details into the PICTURETABLE
        const query = `
            INSERT INTO PICTURETABLE (PICTURE_URL, PICTURE_PUBLICID, PICTURE_VERSION)
            VALUES (:url, :publicId, :version)
        `;
        
        try {
            await run_query(query, { 
                url: result.secure_url, 
                publicId: result.public_id, 
                version: result.version 
            });
            
            res.json({ 
                message: 'Upload successful', 
                profilePhoto: { 
                    url: result.secure_url, 
                    publicId: result.public_id, 
                    version: result.version 
                } 
            });
        } catch (dbError) {
            console.error('Error saving picture to database:', dbError);
            res.status(500).json({ error: 'Failed to save picture to database' });
        }
    }).end(imageStream);
});

router.post('/appointments', async (req, res) => {
    const { doctor, time, day, patientId } = req.body;

    // Check if all required fields are provided
    if (!doctor || !time || !day || !patientId) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        // Calculate the next occurrence of the provided day
        const appointmentDate = getNextDayOfWeek(day);

        // Convert date to Oracle-friendly format (YYYY-MM-DD)
        const formattedDate = appointmentDate.toISOString().split('T')[0];

        // SQL query to insert a new appointment
        const query = `
            INSERT INTO APPOINTMENT (
                APPOINTMENT_DATE, 
                APPOINTMENT_TIME, 
                APPOINTMENT_STATUS, 
                PATIENT_ID, 
                DOCTOR_ID
            ) 
            VALUES (
                TO_DATE(:appointmentDate, 'YYYY-MM-DD'), 
                :time, 
                'Pending', 
                :patientId, 
                :doctor
            )
        `;
        
        // Running the query with provided values
        await run_query(query, { appointmentDate: formattedDate, time, patientId, doctor });

        // Sending success response
        res.status(201).json({ message: 'Appointment successfully booked!' });

    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});



export default router;
