import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { Token } from "../entities/Token";
import { Session } from "../entities/Session";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";
import { Order } from "../entities/orders";
import { Post } from "../entities/Post";
import { Role } from "../entities/Role";
import { Blog } from "../entities/Blog";

dotenv.config();

// Base options common to both environments
const baseOptions: Partial<DataSourceOptions> = {
    type: "postgres",
    synchronize: true, // Bật true để tự động tạo bảng giống như chạy local (Lưu ý: Cẩn thận khi có dữ liệu quan trọng)
    logging: false,
    entities: [User, Token, Session, Product, Category, Order, Blog, Post, Role], // Make sure all your entities are listed here
    migrations: ["src/database/migrations/*.ts"], // Point to your migrations folder
    subscribers: [],
};

// Cấu hình kết nối trực tiếp tới Render (Dùng chung cho cả Local và Vercel)
const connectionOptions: DataSourceOptions = {
    ...baseOptions,
    host: "dpg-d5le8094tr6s73bt4450-a.singapore-postgres.render.com", // External Host của Render
    port: 5432,
    username: "typeshiii_user",
    password: "TR8o0Um7Vf7WF9tdzrsNgAE4FfE4PX7g",
    database: "typeshiii",
    ssl: true, // Render bắt buộc dùng SSL
    extra: {
        ssl: {
            rejectUnauthorized: false // Chấp nhận chứng chỉ SSL của Render
        }
    }
} as DataSourceOptions;

export const AppDataSource = new DataSource(connectionOptions);