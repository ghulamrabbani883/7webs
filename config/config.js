const mongoose = require("mongoose");

mongoose
  .connect(process.env.URI)
  .then((data) => {
    console.log(`Database connected to ${data.connection.host}`);
  }).catch((error)=>console.log(`Error is connection DB ${error}`))
