import dotenv from "dotenv";
dotenv.config();
import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import router from "@routers/web.router";
import "reflect-metadata";
import { AppDataSource } from "@database/data-source";
import session from "express-session";
import apiRouter from "@routers/api.router";
import cors from "cors";
import path from "path";
import { Category } from "@entities/Category";
import passport from "config/passport";
import { TypeormStore } from "connect-typeorm";
import { Session } from "@entities/Session";




AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")

        const app: Express = express();
        const port = process.env.PORT || 3000;
        app.use(express.static(path.join(__dirname, "../public")));
        app.use(express.static(path.join(__dirname, "../publicFP")));
        app.use(cors())
        app.set("view engine", "ejs");
        app.set("views", path.join(__dirname, "views"));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        // configure session
        const sessionRepository = AppDataSource.getRepository(Session);
        app.use(session({
            secret: process.env.SESSION_SECRET || "secret",
            resave: false,
            saveUninitialized: false, // Tốt hơn cho production
            store: new TypeormStore({
                // cleanupLimit: 2, // Bị lỗi trên các phiên bản MySQL cũ. Bỏ comment nếu bạn dùng MySQL 5.7+
                ttl: 86400 // Thời gian sống của session: 1 ngày
            }).connect(sessionRepository),
        }));

        // Khởi tạo Passport SAU KHI session đã sẵn sàng
        app.use(passport.initialize());
        app.use(passport.session());

        // Middleware tùy chỉnh phải được đặt SAU KHI session và passport đã được khởi tạo
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

        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            res.status(500).send("Something went wrong!");
        });
        app.use(router);
        app.use("/api/v1/",apiRouter)

        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
