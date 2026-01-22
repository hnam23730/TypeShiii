import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import router from "./routes/web.router";
import { AppDataSource } from "./database/data-source";
import session from "express-session";
import apiRouter from "./routes/api.router";
import cors from "cors";
import path from "path";
import { Category } from "./entities/Category";
import { Role } from "./entities/Role";
import passport from "./config/passport";
import { TypeormStore } from "connect-typeorm";
import { Session } from "./entities/Session";



export const appPromise = AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!")

        // --- Database Seeding Logic ---
        console.log("Seeding database with initial data if necessary...");
        const roleRepository = AppDataSource.getRepository(Role);
        const adminRoleExists = await roleRepository.findOneBy({ id: 1 });
        if (!adminRoleExists) {
            console.log("Creating admin role...");
            await roleRepository.save({ id: 1, name: "admin" });
        }
        const userRoleExists = await roleRepository.findOneBy({ id: 2 });
        if (!userRoleExists) {
            console.log("Creating user role...");
            await roleRepository.save({ id: 2, name: "user" });
        }
        console.log("Seeding complete.");

        const app: Express = express();
        const port = process.env.PORT || 3000;
        app.set("trust proxy", 1); // Quan trọng: Trên Vercel nên để là 1 để tin tưởng proxy đầu tiên
        
        // Cấu hình Cache cho file tĩnh để Vercel Edge Cache có thể lưu trữ (giảm Cache Miss)
        const staticOptions = {
            maxAge: '1d', // Cache ở trình duyệt 1 ngày
            setHeaders: (res: Response, path: string) => {
                // public: cho phép cache chung, s-maxage: thời gian cache trên CDN (Vercel)
                res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
            }
        };
        app.use(express.static(path.join(__dirname, "../public"), staticOptions));
        app.use(express.static(path.join(__dirname, "../publicFP"), staticOptions));
        
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
            proxy: true, // BẮT BUỘC trên Vercel để cookie secure hoạt động đúng
            resave: false,
            saveUninitialized: false, // Tốt hơn cho production
            store: new TypeormStore({
                // cleanupLimit: 2, // Bị lỗi trên các phiên bản MySQL cũ. Bỏ comment nếu bạn dùng MySQL 5.7+
                ttl: 86400 // Thời gian sống của session: 1 ngày
            }).connect(sessionRepository),
            cookie: {
                secure: process.env.NODE_ENV === 'production', // Chỉ bật secure trên production (HTTPS), tắt khi chạy local
                sameSite: 'lax', // 'lax' an toàn và ổn định hơn 'none' cho việc chuyển trang nội bộ
                maxAge: 24 * 60 * 60 * 1000 // 1 ngày
            }
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
        
        return app;
    })
    .catch((err) => {
        console.error("FATAL: Error during application startup.", err);
        // In a serverless environment, throwing the error is better than process.exit()
        // as it allows the platform to log the specific error.
        throw err;
    })

export default async function handler(req: any, res: any) {
    const app = await appPromise;
    app(req, res);
}

if (require.main === module) {
    appPromise.then(app => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    })
}
