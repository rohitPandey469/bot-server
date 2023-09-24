import express from "express";
import path from "path";
import bodyParser from "body-parser";
const app = express();
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import dialogflowRoute from "./routes/dialogflow.js";
import authRoute from "./routes/auth.js";
import stripeRoute from "./routes/stripe.js";
import "dotenv/config";
import dbConn from "./config/db.js";
import mongoose from "mongoose";
import questionsRoutes from "./routes/questions.js";
import answerRoutes from "./routes/answers.js";
import userRoutes from "./routes/userProfile.js"

const PORT = process.env.PORT || 5000;

console.log(process.env.NODE_ENV);
// db connection
dbConn();

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
app.use("/", authRoute);
app.use("/api/dialogflow", dialogflowRoute);
app.use("/api/create-checkout-session", stripeRoute);
app.use("/questions", questionsRoutes);
app.use("/answers", answerRoutes);
app.use("/user",userRoutes)

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join( "views", "index.html"));
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join( "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
