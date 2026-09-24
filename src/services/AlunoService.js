const prisma = require("../models/prismaClient");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");

class AlunoService {
  async findMany(page, pageSize) {
    const alunos = await prisma.aluno.findMany({
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
    });
    return alunos;
  }

  async create(aluno) {
    const { nome, email } = aluno;

    if (!nome || !email) {
      throw new AlunoInvalidoError();
    }

    const novoAluno = await prisma.aluno.create({
      data: { nome, email },
    });

    return novoAluno;
  }
}

module.exports = new AlunoService();
