import { Router } from "express";
import { VideoRepository } from "../modules/videos/repositories/VideoRepository";
import { login } from "../middleware/login";

const videoRoutes = Router();
const videoRepository = new VideoRepository();

videoRoutes.post("/publish-video", login, (request, response) => {
  videoRepository.create(request, response);
});

videoRoutes.get("/search-user-videos", login, (request, response) => {
  videoRepository.searchUserVideos(request, response);
});

videoRoutes.get("/search", (request, response) => {
  videoRepository.searchVideo(request, response);
});

export { videoRoutes };
