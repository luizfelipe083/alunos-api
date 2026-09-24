# API de Alunos — Node.js · Express · Prisma

## Como rodar

1. Instale as dependências:
   ```
   npm install
   ```
2. Copie o `.env.example` para `.env`:
   ```
   cp .env.example .env
   ```
3. Rode a primeira migration (cria o banco SQLite e a tabela `Aluno`):
   ```
   npx prisma migrate dev --name init
   ```
4. Suba o servidor em modo dev:
   ```
   npm run dev
   ```
5. A API sobe em `http://localhost:3000`.

## Rotas

| Verbo         | Rota          | Descrição                                    |
|---------------|---------------|-----------------------------------------------|
| GET           | /alunos       | Lista paginada, com orderBy/order e total     |
| GET           | /alunos/:id   | Busca um aluno pelo id                        |
| POST          | /alunos       | Cria um aluno                                 |
| PUT / PATCH   | /alunos/:id   | Atualiza um aluno                             |
| DELETE        | /alunos/:id   | Remove um aluno                               |
