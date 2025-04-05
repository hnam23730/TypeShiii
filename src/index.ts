import dotenv from "dotenv";
dotenv.config();
import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import router from "@routers/web.router";
import "reflect-metadata";
import { AppDataSource } from "./database/data-source";
import session from "express-session";
import apiRouter from "@routers/api.router";
import cors from "cors";
import path from "path";
import { Category } from "@entities/Catergory";



const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../publicFP")));
app.use(cors())
//app.use(express.static("public"));
//app.use(express.static("publicFP"));
app.set("view engine", "ejs");
app.set("views", "./src/views");

// configure bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('secret'));

// configure session
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());



app.use(function(req: any, res: any, next: NextFunction) {
    res.locals.userLogin = req.session.userLogin || null; // Make userLogin available in all views
    next();
  });
  app.use((req, res, next) => {
    res.locals.selectedCategory = req.query.category || null; // Truyền selectedCategory vào res.locals
    next();
});

app.use(async (req, res, next) => {
    try {
        const categories = await AppDataSource.getRepository(Category).find();
        res.locals.categories = categories; // Truyền danh mục đến tất cả các view
        next();
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.locals.categories = []; // Nếu lỗi, truyền danh sách rỗng
        next();
    }
});
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});
app.use(router);
app.use("/api/v1/",apiRouter)



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

