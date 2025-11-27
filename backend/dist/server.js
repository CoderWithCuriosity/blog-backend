"use strict";
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookieparser');
const dotenv = require("dotenv");
const PORT = 4000;
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
