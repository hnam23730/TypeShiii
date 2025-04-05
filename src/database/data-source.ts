import { DataSource } from "typeorm"
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
    entities: ["src/entities/**.ts"]
})
