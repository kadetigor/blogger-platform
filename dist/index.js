"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
// создание приложения
const PORT = process.env.PORT || 3002;
app_1.app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
