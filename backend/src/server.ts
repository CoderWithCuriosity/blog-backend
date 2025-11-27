import express, { Application } from 'express';
import cors from 'cors';
import cookie from 'cookie';
import dotenv from 'dotenv';

//Routes
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import { sequelize } from './config/db';

dotenv.config();

const app: Application = express();
const PORT: number = 3000;

app.use(cors());
app.use(express.json());

//Using the routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

//connect to db
sequelize.authenticate().then(() => {
    console.log("MySql Connected!");
}).catch((err) => {
    console.log("DB Error: ", err);
});

//Sync model
sequelize.sync({ alter: true }).then(() => {
    console.log("Model synchronized");
}).catch((err) => {
    console.log("Sync Error: ", err);
})

app.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`)
})