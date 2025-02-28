import * as path from 'node:path';
import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource} from "typeorm";
import configuration from "./src/configs/configuration";


const config = configuration().database;

export default new DataSource({
    type: 'postgres',
    host: config?.host,
    port: config?.port,
    username: config?.user,
    password: config?.password,
    database: config?.db,
    entities: [path.join(
        process.cwd(),
        'src',
        'database',
        'entities',
        '*.entity.ts',
    )],
    migrations: [path.join(
        process.cwd(),
        'src',
        'database',
        'migrations',
        '*.ts',
    )],

    synchronize: false,
});