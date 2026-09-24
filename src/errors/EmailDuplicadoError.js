const ApiError = require("./ApiError");

class EmailDuplicadoError extends ApiError {
  constructor(message = "Este email já está sendo usado por outro aluno") {
    super(message, 409);
  }
}

module.exports = EmailDuplicadoError;
