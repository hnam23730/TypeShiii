import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../entities/Product";
import { Session } from "../entities/Session";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Blueshark_1",
    database: "myapp",
    logging: false,
    synchronize: true,
    dropSchema: false,
    entities: [__dirname + "/../entities/**/*.{js,ts}", Session],
    migrations: [__dirname + "/../migrations/**/*.{js,ts}"],
    subscribers: [__dirname + "/../subscribers/**/*.{js,ts}"],
})
