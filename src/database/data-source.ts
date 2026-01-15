import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
import { User } from "@entities/User";
import { Token } from "@entities/Token";
import { Session } from "@entities/Session";
import { Product } from "@entities/Product";
import { Category } from "@entities/Category";
import { Order } from "@entities/orders";
import { Blog } from "@entities/Blog";

dotenv.config();

const baseOptions: Partial<DataSourceOptions> = {
    type: "mysql",
    synchronize: false, // IMPORTANT: Set to false in production to avoid accidental data loss. Use migrations instead.
    logging: process.env.NODE_ENV === 'development', // Log queries only in development
    entities: [User, Token, Session, Product, Category, Order, Blog], // Make sure all your entities are listed here
    migrations: ["src/database/migrations/*.ts"], // Point to your migrations folder
    subscribers: [],
};

let connectionOptions: DataSourceOptions;

if (process.env.NETLIFY_DATABASE_URL) {
    // Production environment on Netlify
    console.log("Using Netlify database connection URL.");
    connectionOptions = {
        ...baseOptions,
        url: process.env.NETLIFY_DATABASE_URL,
        ssl: {
            // Netlify's database requires SSL.
            rejectUnauthorized: true,
        },
    } as DataSourceOptions;
} else {
    // Local development environment
    console.log("Using local database connection variables.");
    connectionOptions = {
        ...baseOptions,
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    } as DataSourceOptions;
}

export const AppDataSource = new DataSource(connectionOptions);