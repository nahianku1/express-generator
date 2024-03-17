import { connect } from "mongoose";
import app from "./app";
import config from "./app/config/config";
import { Server } from "http";
import { seedAdmin } from "./app/seed/seedAdmin";
import { seedGuest } from "./app/seed/seedUser";

let server: Server;

async function run() {
  try {
    await connect(config.db_url as string);
    seedAdmin();
    seedGuest();
    server = app.listen(config.port, () => {
      console.log(`Server: http://localhost:${Number(config.port)}`);
    });
  } catch (error) {
    console.log(error);
  }
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log(`unhandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log(`uncaughtException is detected , shutting down ...`);
  process.exit(1);
});

(async () => {
  await run();
})();
