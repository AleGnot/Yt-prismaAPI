import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

class VideoRepository {
  async create(request: Request, response: Response) {
    const { title, description, id_user } = request.body;

    try {
      await prisma.video.create({
        data: {
          videoAuthor: id_user,
          title,
          description,
        },
      });
      await prisma.$disconnect();

      return response
        .status(200)
        .json({ message: "Video criado com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar video", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  async searchUserVideos(request: Request, response: Response) {
    const { id_user } = request.body;

    try {
      const results = await prisma.video.findMany({
        where: {
          videoAuthor: id_user,
        },
      });

      if (results.length === 0) {
        return response
          .status(404)
          .json({ error: "Usuário não possui videos publicados" });
      }

      await prisma.$disconnect();

      return response
        .status(200)
        .json({ message: "Videos encontrados", videos: results });
    } catch (error) {
      console.error("Erro ao buscar videos de usuário", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }

  async searchVideo(request: Request, response: Response) {
    const { search } = request.query;

    if (!search) {
      return response
        .status(400)
        .json({ message: "O parâmetro de busca é obrigatório." });
    }

    try {
      const results = await prisma.video.findMany({
        where: {
          title: {
            contains: String(search),
          },
        },
      });

      if (results.length === 0) {
        return response.status(404).json({ error: "Nenhum video encontrado" });
      }

      await prisma.$disconnect();

      return response
        .status(200)
        .json({ message: "Videos encontrados", videos: results });
    } catch (error) {
      console.error("Erro ao buscar por titulo de video", error);
      return response.status(500).json({ error: "Internal server error" });
    }
  }
}

export { VideoRepository };
