import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
import { User } from "@entities/User";
import { Token } from "@entities/Token";
import { Session } from "@entities/Session";
import { Product } from "@entities/Product";
import { Category } from "@entities/Category";
import { Order } from "@entities/orders";
import { Post } from "@entities/Post";
import { Role } from "@entities/Role";
import { Blog } from "@entities/Blog";

dotenv.config();

// Base options common to both environments
const baseOptions: Partial<DataSourceOptions> = {
    type: "postgres",
    synchronize: false, // IMPORTANT: Set to false in production to avoid accidental data loss. Use migrations instead.
    logging: process.env.NODE_ENV === 'development', // Log queries only in development
    entities: [User, Token, Session, Product, Category, Order, Blog, Post, Role], // Make sure all your entities are listed here
    migrations: ["src/database/migrations/*.ts"], // Point to your migrations folder
    subscribers: [],
};

let connectionOptions: DataSourceOptions;

if (process.env.NETLIFY_DATABASE_URL) {
    // Production environment on Netlify with Neon
    console.log("Using Netlify Neon (PostgreSQL) database connection URL.");
    connectionOptions = {
        ...baseOptions,
        url: process.env.NETLIFY_DATABASE_URL,
        ssl: {
            // Neon requires SSL, but we can allow self-signed certs for serverless
            rejectUnauthorized: false,
        },
    } as DataSourceOptions;
} else {
    // Local development environment with PostgreSQL
    console.log("Using local PostgreSQL connection variables.");
    connectionOptions = {
        ...baseOptions,
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432, // Default PostgreSQL port
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    } as DataSourceOptions;
}

export const AppDataSource = new DataSource(connectionOptions);