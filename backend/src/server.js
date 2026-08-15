require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 3000;

connectDatabase();

app.listen(PORT, () => {
    console.log(`Nirvach server running on http://localhost:${PORT}`);
});
