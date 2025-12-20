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
const recommendationRoutes = require("./routes/recommendations");
const aiRoutes = require("./routes/ai");

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => res.send("Movie Recommendation API running"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
