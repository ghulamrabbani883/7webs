const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/userRoute');
const bookingRoute = require('./routes/bookingRoute');
const availabiltyRoute = require('./routes/availabilityRoute');
//Configure dotenv files above using any other library and files
dotenv.config({path:'./.env'}); 
//Creating an app from express
const app = express();
require('./config/config')
//Using express.json to get request of json data
app.use(express.json());
app.use(cors())
app.use(cookieParser())


app.get('/', (req,res)=>{
    res.send('Hello from 7webs software developer test')
})
app.use('/user', userRoute);
app.use('/api', bookingRoute)
app.use('/api', availabiltyRoute)



//listening to the server
app.listen(process.env.PORT,()=>{
    console.log(`Server is listening at ${process.env.PORT}`);
})
