import express from "express";
import { userRoutes } from "./routes/user.routes";
import { videoRoutes } from "./routes/video.routes";

const app = express();
const port = process.env.PORT ?? 5000;

const cors = require("cors");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methodss",
    "POST, GET, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(cors());

app.use(express.json());
app.use("/user", userRoutes);
app.use("/videos", videoRoutes);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
