import "express-async-errors";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.config";
import vacancyRouter from "./routes/vacancy.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>List of vacancies using typescript</h1>");
});

// routes
app.use("/vacancies", vacancyRouter);

const startDB = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Mongodb is connected!!!");
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
// connecting to Mongodb and starting the server
startDB();
