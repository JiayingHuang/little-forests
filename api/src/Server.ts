import morgan from "morgan";
import helmet from "helmet";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import plants from "./routes/plants";
import users from "./routes/users";
import forests from "./routes/forestTypes";
import little_forests from "./routes/littleForests";
import site_conditions from "./routes/siteConditions";
import { connect } from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import "./middleware/passportAuth";
import "express-async-errors";

import logger from "@shared/Logger";
import passport from "passport";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import path from "path";

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/
let mongoDB: string =
	process.env.DATABASE || "mongodb://127.0.0.1:27017/little";
connect(mongoDB)
	.catch((err) => {
		logger.warn("MongoDB connection error: " + err);
	})
	.then(() => {
		logger.info("Connected to database");
	});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "build")));

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
	app.use(cors());
}

// Security
if (process.env.NODE_ENV === "production") {
	app.use(helmet());
}
app.use(
	session({
		name: "LittleForests",
		secret: process.env.SECRET || "DEV SECRET DON't USE",
		resave: true,
		saveUninitialized: true,
		cookie: {
			secure: "auto",
			sameSite: "strict",
		},
		store: MongoStore.create({ mongoUrl: mongoDB }),
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Add APIs
app.use("/", plants);
app.use("/", users);
app.use("/", forests);
app.use("/", little_forests);
app.use("/", site_conditions);
app.use("/", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default app;
