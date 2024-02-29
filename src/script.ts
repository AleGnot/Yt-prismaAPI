import express from "express";
import { userRoutes } from "./routes/user.routes";
import { videoRoutes } from "./routes/video.routes";

const app = express();
const port = process.env.PORT ?? 5000;

app.use(express.json());
app.use("/user", userRoutes);
app.use("/videos", videoRoutes);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
