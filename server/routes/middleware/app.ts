import path from "path";
import express from "express";
import favicon from "serve-favicon";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

import { app } from "../../index";

const rootPath = process.env.NODE_ENV == "development" ? "../../.." : "../../../..";

// Requests
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(cors({ origin: "*" }));

// Static content
app.use(favicon(path.join(__dirname, `${rootPath}/public/favicon.ico`)));
app.use("/avatars/", express.static(path.join(__dirname, `${rootPath}/assets/data/avatars`)));

export {};
