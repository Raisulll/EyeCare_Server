import express from "express";
import { run_query } from "../db/connectiondb.js";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

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

// Route to fetch time slots for a specific doctor considering existing appointments

router.get('/doctors/:doctorId/times', async (req, res) => {
    const doctorId = parseInt(req.params.doctorId, 10);
    const { day } = req.query;

    console.log(`Day: ${day}`);
    console.log(`Doctor ID: ${doctorId}`);

    if (isNaN(doctorId) || !day) {
        return res.status(400).json({ error: 'Invalid doctor ID or day' });
    }

    try {
        // Fetch doctor's default timeslot
        const doctorQuery = 'SELECT DOCTOR_TIMESLOT FROM DOCTOR WHERE DOCTOR_ID = :doctorId';
        const doctorTimes = await run_query(doctorQuery, { doctorId });
        console.log('Doctor Times:', doctorTimes);

        const doctorTimeslot = doctorTimes[0] ? doctorTimes[0][0] : undefined;
        console.log(`Doctor Timeslot: ${doctorTimeslot}`);

        // Check if doctorTimeslot is defined
        if (!doctorTimeslot) {
            return res.status(400).json({ error: 'Doctor timeslot not found' });
        }

        // Fetch the latest appointment time for the given day
        const appointmentQuery = `
            SELECT APPOINTMENT_TIME 
            FROM APPOINTMENT 
            WHERE DOCTOR_ID = :doctorId AND TO_CHAR(APPOINTMENT_DATE, 'DD-MON-YY') = :day 
            ORDER BY APPOINTMENT_TIME DESC 
            FETCH FIRST 1 ROWS ONLY
        `;
        const appointments = await run_query(appointmentQuery, { doctorId, day });
        console.log('Appointments:', appointments);

        let availableTimeslot;
        if (appointments.length > 0) {
            let lastAppointmentTime = appointments[0][0]; // Assuming appointment time is directly accessible as a string
            console.log(`Last Appointment Time: ${lastAppointmentTime}`);

            // Add .30 to the last appointment time
            let [hour, minute] = lastAppointmentTime.split('.').map(Number);

            if (minute === 30) {
                // If it's 5.30, make it 6.00
                hour += 1;
                minute = 0;
            } else {
                // If it's 5, make it 5.30
                minute = 30;
            }

            // Construct the new time slot as a string
            lastAppointmentTime = `${hour}${minute === 0 ? '.00' : '.30'}`;

            // Check if the time exceeds 10.00
            if (hour >= 10) {
                return res.json(['No more time slots available']);
            }

            availableTimeslot = lastAppointmentTime;
        } else {
            // If no appointments exist, use the default timeslot and add .00
            availableTimeslot = `${doctorTimeslot}.00`;
        }

        console.log(`Available Timeslot: ${availableTimeslot}`);
        res.json([availableTimeslot]);

    } catch (error) {
        console.error(`Error fetching time slots for doctor ID: ${doctorId}, error: ${error.message}`);
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

// Helper function to get the next occurrence of a specific day of the week
function getNextDayOfWeek(dayOfWeek) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = daysOfWeek.indexOf(dayOfWeek);
    if (dayIndex === -1) throw new Error('Invalid day of the week provided');

    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay();
    
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

// Route to book an appointment
router.post('/appointments', async (req, res) => {
    const { doctor, time, day, patientId } = req.body;

    if (!doctor || !time || !day || !patientId) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        const appointmentDate = getNextDayOfWeek(day);

        const formattedDate = appointmentDate.toISOString().split('T')[0];

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
        
        await run_query(query, { appointmentDate: formattedDate, time, patientId, doctor });

        res.status(201).json({ message: 'Appointment successfully booked!' });

    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});

export default router;
