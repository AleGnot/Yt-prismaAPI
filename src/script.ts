import express from "express";
import { userRoutes } from "./routes/user.routes";
import { videoRoutes } from "./routes/video.routes";

const app = express();

app.use(express.json());
app.use("/user", userRoutes);
app.use("/videos", videoRoutes);

app.listen(process.env.PORT);
