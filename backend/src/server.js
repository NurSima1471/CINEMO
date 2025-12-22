const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
// --- YENİ: TV Routes dosyasını çağır ---
const tvRoutes = require("./routes/tv"); 
// --------------------------------------
const recommendationRoutes = require("./routes/recommendations");
const aiRoutes = require("./routes/ai");
const userRoutes = require("./routes/user.route"); 

const app = express();

// DB Connect
connectDB();

// Security & logs
app.use(helmet());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// --- YENİ: Frontend'deki /api/tv isteklerini burası karşılayacak ---
app.use("/api/tv", tvRoutes);
// ------------------------------------------------------------------

app.use("/api/recommendations", recommendationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes); // User routes burada olmalı

app.get("/", (req, res) => res.send("Movie Recommendation API running"));

// --- ÖNEMLİ: Error Handler EN SONDA olmalıdır ---
app.use(errorHandler);
// ------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);