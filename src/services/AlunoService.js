const prisma = require("../models/prismaClient");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");

class AlunoService {
  async findMany(page, pageSize, orderBy, order) {
    // Só aceitamos ordenar por campos que realmente existem no model,
    // senão o Prisma quebra a aplicação com um campo inválido.
    const camposValidos = ["id", "nome", "email", "createdAt"];
    const campoOrdenacao = camposValidos.includes(orderBy) ? orderBy : "id";

    // Se vier um valor de "order" diferente de "asc"/"desc", cai no padrão
    // "asc" em vez de deixar o Prisma lançar um erro.
    const direcaoOrdenacao = ["asc", "desc"].includes(order) ? order : "asc";

    const [alunos, total] = await Promise.all([
      prisma.aluno.findMany({
        skip: (page - 1) * pageSize,
        take: Number(pageSize),
        orderBy: { [campoOrdenacao]: direcaoOrdenacao },
      }),
      prisma.aluno.count(),
    ]);

    return { alunos, total };
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
