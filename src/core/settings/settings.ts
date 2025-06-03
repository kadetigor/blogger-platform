export const SETTINGS = {
    PORT: process.env.PORT || 3002,
    MONGO_URL:
        process.env.MONGO_URL || "mongodb+srv://kadetigor3216:yxqFwxLKJaQKAlqG@mycluster.o5wevkr.mongodb.net/",
        DB_NAME: process.env.DB_NAME || "blogger-platform",
    AC_SECRET: process.env.AC_SECRET || "185516583cc6637f4f9e545fbf8e53f9cf53db3aab85760af7e9a7bc9bba22ed9d90e9fe528c191bf367ee72f2f27be2c34776fe08bafd32abfb5303eb6be142",
    AC_TIME: process.env.AC_TIME || "1h",
} as const;