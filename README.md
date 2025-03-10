# Teste To-Do API

## Descrição

API RESTful para gerenciamento de tarefas (To-Do List), desenvolvida utilizando Node.js, Express e TypeScript. A API permite criar, listar, atualizar e excluir usuários e tarefas, armazenando os dados em um banco MongoDB.

## Tecnologias Utilizadas

- Node.js
- Express
- TypeScript
- MongoDB com Mongoose
- Docker & Docker Compose
- Zod para validação
- Jest para testes unitários
- Swagger para documentação da API

## Como Executar o Projeto

### Com Docker

1. Certifique-se de ter o [Docker](https://www.docker.com/) e o [Docker Compose](https://docs.docker.com/compose/) instalados.
2. Clone o repositório:
   ```sh
   git clone https://github.com/Kawamotus/to-do-test.git
   cd to-do-test
   npm i
   ```
3. Execute o comando:
   ```sh
   docker-compose up
   //ou
   docker-compose up -d
   ```
4. A API estará rodando em `http://localhost:3000`

### Sem Docker

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Configure as variáveis de ambiente no arquivo `.env`:
   ```env
   MONGODB_URI='mongodb://localhost:27017/teste-todo'
   JWT_SECRET=sua_chave_secreta
   ```
3. Inicie o servidor:
   ```sh
   npm run dev
   //ou
   npm start
   ```

## Endpoints

A documentação completa pode ser acessada via Swagger em `http://localhost:3000/api-docs`.

## Testes

Para rodar os testes unitários, utilize o comando:

```sh
npm run test
```

## Autor

Desenvolvido por Gustavo Kawamoto.

## Licença

Este projeto está licenciado sob a licença MIT.
