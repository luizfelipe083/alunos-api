const prisma = require("../models/prismaClient");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");
const EmailDuplicadoError = require("../errors/EmailDuplicadoError");

class AlunoService {
  async update(id, dados) {
    const { nome, email } = dados || {};

    // Corpo vazio ou sem nenhum campo válido para atualizar: reaproveitamos o
    // AlunoInvalidoError, já que a causa raiz é a mesma (dados insuficientes
    // para a operação) — não justifica criar uma exceção nova só para isso.
    if (!nome && !email) {
      throw new AlunoInvalidoError("Informe ao menos nome ou email para atualizar");
    }

    await this.findUnique(id); // lança AlunoNaoEncontradoError se o id não existir

    const data = {};
    if (nome) data.nome = nome;
    if (email) data.email = email;

    try {
      const alunoAtualizado = await prisma.aluno.update({
        where: { id: Number(id) },
        data,
      });
      return alunoAtualizado;
    } catch (e) {
      // P2002 é o código que o Prisma lança ao violar uma constraint @unique
      // (o email de outro aluno). Aqui sim criamos uma exceção própria
      // (EmailDuplicadoError, 409) porque é uma causa diferente das outras
      // duas e merece uma mensagem/status específicos.
      if (e.code === "P2002") {
        throw new EmailDuplicadoError();
      }
      throw e;
    }
  }

  async delete(id) {
    await this.findUnique(id); // lança AlunoNaoEncontradoError se o id não existir

    await prisma.aluno.delete({
      where: { id: Number(id) },
    });
  }

  async findUnique(id) {
    // O id chega como texto (request.params); o campo no schema é Int.
    const aluno = await prisma.aluno.findUnique({
      where: { id: Number(id) },
    });

    if (!aluno) {
      throw new AlunoNaoEncontradoError();
    }

    return aluno;
  }

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
