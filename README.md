# Project documentation

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API DOCUMENTATION](#contributing)

## Installation

1. Clone the repository.
   ```bash
   git clone https://github.com/ghulamrabbani883/7webs.git
   
2. Install the dependencies
   ```bash
   npm install

## Usage

1. Create a .env file in the root folder and add the necessary variables given in exapmple.env file
   
2. Run the command
   ```bash
   npm run dev

## API DOCUMENTATION

### User Login and Register

1. Create a new user using the URL   http://localhost:4000/user/register with the following JSON object
     {
       "name":"",
       "email":"",
       "password":""
     }

2. Login using the URL      http://localhost:4000/user/login with the following JSON object
     {
       "email":"",
       "password":""
     }

3. To log out go through the link http://localhost:4000/user/logout



### Availability slots

1. To create new slots use the given  URL http://localhost:4000/api/availability and make post request with the following JSON object
   ```bash
   "availability":[{
        "day":"Monday",
        "slots":[{
            "start":"09:00",
            "end":"06:00"
        }]
    },
   {
        "day":"Tuesday",
        "slots":[{
            "start":"09:00",
            "end":"06:00"
        }]
    }]

2. To fetch the  slots on a particular date go through the sample http://localhost:4000/api/available-slots/04-09-2024 and make the get request, output will be in following object
   ```bash
    
   slots:[{
            "start":"09:00",
            "end":"06:00"
        },{
            "start":"09:00",
            "end":"06:00"
        }]

### Booking slots

1. For new booking  use the given  URL http://localhost:4000/api/bookings and make a post request with the following JSON object, and userId will be automatically added, since you can only perform this when you are logged in
   ```bash
    {
           "date": "YYYY-MM-DD",
           "slot": {"start": "HH:MM", "end": "HH:MM"}
       }
2. To fetch the  booking  go through the sample http://localhost:4000/api/bookings and make the get request, output will be in following object
   ```bash
    
   [ {
           "userId": "user_id",
           "date": "YYYY-MM-DD",
           "slot": {"start": "HH:MM", "end": "HH:MM"}
       }]

