import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";
import { Request, Response } from "express";
import { decode, sign, verify } from "jsonwebtoken";

const prisma = new PrismaClient();

class UserRepository {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return response.status(400).json({ error: "Email já existente" });
      }

      const hashedPassword = await hash(password, 10);

      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      response.status(200).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.error("Erro ao criar usuário", error);
      return response.status(500).json({ error: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return response
          .status(404)
          .json({ error: "Não foi possivel encontrar o usuário" });
      }

      const matchPassword = await compare(password, user.password);
      if (!matchPassword) {
        return response.status(401).json({ error: "Senha Incorreta!" });
      }

      const token = sign(
        {
          id: user.id_user,
          email: user.email,
        },
        process.env.SECRET as string,
        { expiresIn: "1d" }
      );

      response
        .status(200)
        .json({ message: "Login efetuado com sucesso", token: token });
    } catch (error) {
      console.error("Erro ao realizar o login", error);
      return response.status(500).json({ error: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getUser(request: Request, response: Response) {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return response
        .status(401)
        .json({ message: "Token de autorização não fornecido" });
    }

    try {
      const decoded = decode(token) as {
        id: string;
        email: string;
      } | null;
      if (!decoded) {
        return response.status(401).json({ message: "Token inválido" });
      }

      const user = await prisma.user.findUnique({
        where: {
          email: decoded.email,
        },
      });

      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado" });
      }

      return response.status(200).json({ user });
    } catch (error) {
      console.error("Erro ao obter usuário", error);
      return response.status(500).json({ error: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  }
}

export { UserRepository };
