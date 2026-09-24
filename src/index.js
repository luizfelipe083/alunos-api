const express = require("express");
const alunoRouter = require("./routes/alunoRoutes");

const app = express();
app.use(express.json());
app.use("/alunos", alunoRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
