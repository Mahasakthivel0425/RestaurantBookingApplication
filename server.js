const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();

// Initialize dotenv for environment variables
dotenv.config();

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('public')); // or wherever your static files are located

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use 'true' in production with HTTPS
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/CSS', express.static(path.join(__dirname, 'CSS')));
app.use('/Javascript', express.static(path.join(__dirname, 'Javascript')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const client = new MongoClient(process.env.atlasuri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: false
});
async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas', error);
    }
}

connectToDatabase();

mongoose.connect(process.env.atlasuri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsCAFile: process.env.CA_CERT_PATH, // Optional: Path to CA certificate
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const registrationSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    lastname: String,
    dob: Date,
    password: String,
    email: String,
    mobile: String,
    image: String,
    google: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    concertDetails: [{
        concertName: String,
        location: String,
        address: String,
        city: String,
        date: String,
        time: String
    }],
    payments: [{
        orderId: String,
        paymentId: String,
        signature: String,
        amount: Number, // Store amount in rupees
        currency: String,
        status: String,
        created_at: { type: Date, default: Date.now },
        paymentDate: String, // Store payment date
        paymentTime: String  // Store payment time
    }]
});

const eventSchema = new mongoose.Schema({
    concertName: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true }
});

const Event = mongoose.model('Event', eventSchema);
const Registration = mongoose.model('Registration', registrationSchema);



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://restaurant-booking-application.onrender.com/auth/google/callback",
    passReqToCallback: true,
    prompt: 'consent' // Ensure the consent screen is shown
},
async function (req, token, tokenSecret, profile, done) {
    try {
        let user = await Registration.findOne({ 'google.id': profile.id });

        if (user) {
            return done(null, user);
        } else {
            // If the user is not in the database, create a new user
            const newUser = new Registration({
                google: {
                    id: profile.id,
                    token: token,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                },
                username: profile.displayName,
                email: profile.emails[0].value,
                // You can add more profile details if necessary
            });

            await newUser.save();
            return done(null, newUser);
        }
    } catch (err) {
        return done(err);
    }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await Registration.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('User not authenticated');
}

// Google OAuth login route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'consent' }));

// Google OAuth callback route
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        console.log('User authenticated successfully');
        // Save user info in the session
        req.session.user = req.user;
        res.redirect(`/profile/${req.user.id}`);
    }
);

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Express routes
app.get('/HTML/index.html', (req, res) => {
    res.sendFile(path.join(__dirname,'HTML','index.html'));
});

app.get('/HTML/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'about.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/HTML/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'contact.html'));
});

app.get('/HTML/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'Register.html'));
});

app.get('/HTML/Login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'Login.html'));
});

app.get('/HTML/rahman.html/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'rahman.html'));
});

app.get('/HTML/sima.html/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'sima.html'));
});

app.get('/HTML/vijayantony.html/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'vijayantony.html'));
});

app.get('/HTML/prabhudeva.html/:userId', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'prabhudeva.html'));
});

app.get('/HTML/common.html/:userid', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'common.html'));
});

app.get('/HTML/history.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'history.html'));
});

app.get('/events/:eventId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.json(event);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.get('/getPaymentAndBookingHistory', async (req, res) => {
    const { user } = req.session;
    if (!user) {
        return res.status(401).send('User not authenticated');
    }

    try {
        const userData = await Registration.findById(user._id)
            .select('payments concertDetails')
            .lean();

        if (userData) {
            const history = [];

            const concertDetailsLength = userData.concertDetails.length;
            const paymentsLength = userData.payments.length;
            const maxLength = Math.max(concertDetailsLength, paymentsLength);

            for (let i = 0; i < maxLength; i++) {
                const concert = userData.concertDetails[i] || {};
                const payment = userData.payments[i] || {};
                history.push({ ...concert, ...payment });
            }

            history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            res.json(history);
        } else {
            res.status(404).send('No history found for user');
        }
    } catch (error) {
        console.error('Error fetching payment and booking history:', error);
        res.status(500).send('Error fetching payment and booking history');
    }
});

app.post('/register', upload.single('image'), async (req, res) => {
    try {
        const newRegistration = new Registration({
            ...req.body,
            image: req.file ? req.file.filename : ''
        });

        const user = await newRegistration.save();
        req.login(user, err => {
            if (err) {
                return res.status(500).send('Error during login after registration.');
            }
            res.redirect(`/profile/${user._id}`);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving registration data.');
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    Registration.findOne({ username })
        .then(user => {
            if (!user || user.password !== password) {
                return res.status(401).send('Invalid username or password.');
            }

            req.session.user = user;
            res.redirect(`/profile/${user._id}`);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});



app.get('/profile/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'index.html'));
});


app.get('/getProfileData', (req, res) => {
    const { user } = req.session;
    if (!user) {
        return res.status(401).send('User not authenticated');
    }

    res.json({
        profileImage: user.image ? `/uploads/${user.image}` : null,
        username: user.username,
        _id: user._id,
        uniqueId: user.uniqueId
    });
});


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



app.post('/create-free-booking/:userId', async (req, res) => {
    const { userId } = req.params;
    const { concertDetails, totalTickets, mobile, status } = req.body;
    try {
        const user = await Registration.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Save the booking details to the user's concertDetails array
        user.concertDetails.push({
            ...concertDetails,
            totalTickets
        });

        // For free tickets, use the current date and time as payment date and time
        const currentDate = new Date();
        const paymentDate = currentDate.toLocaleDateString(); // Example format: "7/4/2024"
        const paymentTime = currentDate.toLocaleTimeString(); // Example format: "11:25:32 AM"

        // Save the payment details
        const paymentDetails = {
            concertName: concertDetails.concertName,
            location: concertDetails.location,
            address: concertDetails.address,
            city: concertDetails.city,
            amount: 0, // For free tickets
            currency: 'INR',
            status: 'success', // Assuming free tickets are always successful
            paymentDate,
            paymentTime,
            created_at: currentDate
        };
        user.payments.push(paymentDetails);

        await user.save();
        await sendEmail(status, paymentDetails, concertDetails, user);
        res.json({ success: true, message: 'Booking created successfully', booking: user.concertDetails[user.concertDetails.length - 1] });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

app.post('/create-order/:userId', async (req, res) => {
    const options = {
        amount: req.body.amount * 100, // Convert amount to paise
        currency: 'INR',
        receipt: 'order_rcptid_11',
        payment_capture: 1 // Auto-capture enabled
    };

    try {
        const response = await razorpay.orders.create(options);
        console.log(response);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/verify-payment/:userId', async (req, res) => {
    const { userId } = req.params;
    const { orderId, paymentId, signature, amount, currency, status, concertName, location, address, city, totalTickets, date,time } = req.body;

    // Verify payment signature
    const shasum = crypto.createHmac('sha256', razorpay.key_secret);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== signature) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    // Create a new payment object
    const payment = {
        orderId,
        paymentId,
        signature,
        amount, // Store amount in rupees
        currency,
        status,
        concertName,
        location,
        address,
        city,
        totalTickets,
        created_at: new Date()
    };
    const concertDetail={
        concertName,
        location,
        address,
        city,
        date,
        time
    }
    try {
        // Find the user and update their payments array
        const user = await Registration.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.payments.push(payment);
        user.concertDetails.push(concertDetail);
        await user.save();

        // Send email based on payment status
        await sendEmail(status, payment,concertDetail, user);

        res.json({ success: true, message: 'Payment verified and stored successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save payment data' });
    }
});

app.get('/payment_status.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'payment_status.html'));
});

// Endpoint to provide payment details
app.get('/payment-details', (req, res) => {
    const { paymentId, orderId, amount, currency, status, concertName, location, address, city } = req.query;
    res.json({ paymentId, orderId, amount, currency, status, concertName, location, address, city });
});

const { Server } = require('http');
const { PDFDocument, rgb } = require('pdf-lib');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(paymentStatus, paymentDetails, concertDetails, user) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const fontSize = 12;
    const textColor = rgb(0, 0, 0);

    page.drawText(`Payment ${paymentStatus === 'success' ? 'Failed':'Successful'}`, { x: 50, y: 350, size: fontSize, color: textColor });
    page.drawText(`Concert Name: ${concertDetails.concertName}`, { x: 50, y: 320, size: fontSize, color: textColor });
    page.drawText(`Location: ${concertDetails.location}`, { x: 50, y: 300, size: fontSize, color: textColor });
    page.drawText(`Address: ${concertDetails.address}`, { x: 50, y: 280, size: fontSize, color: textColor });
    page.drawText(`City: ${concertDetails.city}`, { x: 50, y: 260, size: fontSize, color: textColor });
    page.drawText(`Date: ${concertDetails.date}`, { x: 50, y: 240, size: fontSize, color: textColor });
    page.drawText(`Time: ${concertDetails.time}`, { x: 50, y: 220, size: fontSize, color: textColor });
    page.drawText(`Payment ID: ${paymentDetails.paymentId || 'N/A'}`, { x: 50, y: 200, size: fontSize, color: textColor });
    page.drawText(`Order ID: ${paymentDetails.orderId || 'N/A'}`, { x: 50, y: 180, size: fontSize, color: textColor });
    page.drawText(`Amount: ${paymentDetails.amount} ${paymentDetails.currency}`, { x: 50, y: 160, size: fontSize, color: textColor });
    page.drawText(`Status: ${paymentStatus === 'success' ?'Failed':'Successful'}`, { x: 50, y: 140, size: fontSize, color: textColor });
    page.drawText(`Mobile Number: ${user.mobile}`, { x: 50, y: 100, size: fontSize, color: textColor });
    page.drawText(`Time of Payment: ${new Date(paymentDetails.created_at).toLocaleString()}`, { x: 50, y: 80, size: fontSize, color: textColor });

    const pdfBytes = await pdfDoc.save();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Payment ${paymentStatus === 'success' ? 'Failed':'Successful' } - ${concertDetails.concertName}`,
        html: `
        <p>Dear ${user.username},</p>
        <p>We are writing to inform you that your payment for the concert "${concertDetails.concertName}" has ${paymentStatus === 'success' ? 'failed.':'been successfully completed. '}</p>
        <p>Concert Details:</p>
        <ul>
            <li>Concert Name: ${concertDetails.concertName}</li>
            <li>Location: ${concertDetails.location}</li>
            <li>Address: ${concertDetails.address}</li>
            <li>City: ${concertDetails.city}</li>
            <li>Date: ${concertDetails.date}</li>
            <li>Time: ${concertDetails.time}</li>
        </ul>
        <p>Payment Details:</p>
        <ul>
            <li>Payment ID: ${paymentDetails.paymentId || 'N/A'}</li>
            <li>Order ID: ${paymentDetails.orderId || 'N/A'}</li>
            <li>Amount: ${paymentDetails.amount} ${paymentDetails.currency}</li>
            <li>Status: ${paymentStatus === 'success' ? 'Failed' :'Successful' }</li>
            <li>Mobile Number: ${user.mobile}</li>
            <li>Time of Payment: ${new Date(paymentDetails.created_at).toLocaleString()}</li>
        </ul>
        <p>Thank you for your ${paymentStatus === 'success' ?'attempt.': 'purchase.'}</p>
        <p>If you have any questions or need further assistance, please feel free to contact us.</p>
        <p>Best regards,</p>
        <p>${concertDetails.concertName} Team</p>
        `,
        attachments: [
            {
                filename: 'Payment_Details.pdf',
                content: pdfBytes,
                contentType: 'application/pdf'
            }
        ]
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
