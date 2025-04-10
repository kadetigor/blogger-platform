import { setupApp } from "./app";
import express from "express";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/mongoDb";

// создание приложения
const bootstrap = async () => {
  const app = express()
  setupApp(app);

  const PORT = SETTINGS.PORT;

  await runDB(SETTINGS.MONGO_URL)

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}

bootstrap();
