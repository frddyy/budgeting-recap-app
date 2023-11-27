import { Sequelize } from "sequelize";

const env = {
  database: "budgeting_recap_db",
  username: "postgres",
  password: "ferdy1234567",
  host: "localhost",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  pool: {
    max: env.pool.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle,
  },
  logging: (msg) => console.log(`[Sequelize] ${msg}`),
});

const db = {
  Sequelize,
  sequelize,
};

export default db;
