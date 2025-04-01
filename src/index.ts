import { app } from "./app";

// создание приложения
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
