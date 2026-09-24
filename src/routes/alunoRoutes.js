const express = require("express");
const alunoController = require("../controllers/AlunoController");

const router = express.Router();

router.get("/", alunoController.findMany);
router.get("/:id", alunoController.findUnique);
router.post("/", alunoController.create);
router.put("/:id", alunoController.update);
router.patch("/:id", alunoController.update);

module.exports = router;
