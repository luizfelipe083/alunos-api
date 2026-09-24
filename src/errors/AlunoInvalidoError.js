const ApiError = require("./ApiError");

class AlunoInvalidoError extends ApiError {
  constructor(message = "Nome e email são obrigatórios") {
    super(message, 400);
  }
}

module.exports = AlunoInvalidoError;
