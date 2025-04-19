# API de Gerenciamento de Tarefas (Todo List)

Este é um projeto de API RESTful para gerenciamento de tarefas (Todo List) desenvolvido com Spring Boot e MongoDB Atlas.

## 🚀 Tecnologias Utilizadas

-  Java 17
-  Spring Boot 3.4.4
-  MongoDB Atlas
-  Spring Data MongoDB
-  Spring Security (BCrypt)
-  Lombok
-  Maven

## 📋 Funcionalidades

-  Cadastro de usuários
-  Autenticação de usuários
-  Criação de tarefas
-  Listagem de tarefas por usuário
-  Atualização de tarefas
-  Validação de datas e campos obrigatórios

## 🛠️ Como Executar

### Pré-requisitos

-  Java 17+
-  Maven
-  MongoDB Atlas (ou MongoDB local)

### Configuração

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/todolist-java-spring-boot.git
```

2. Configure o MongoDB no arquivo `application.properties`:

```properties
spring.data.mongodb.uri=sua-string-de-conexao-mongodb
spring.data.mongodb.database=todolist
```

3. Execute o projeto:

```bash
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`

## 📌 Endpoints

### Usuários

-  **POST /users/** - Criar novo usuário

```json
{
   "name": "Seu Nome",
   "username": "seu.usuario",
   "password": "sua-senha"
}
```

### Tarefas

-  **POST /tasks/** - Criar nova tarefa

```json
{
   "title": "Título da Tarefa",
   "description": "Descrição da tarefa",
   "priority": "ALTA",
   "startAt": "2025-04-20T10:00:00",
   "endAt": "2025-04-20T18:00:00"
}
```

-  **GET /tasks/** - Listar tarefas do usuário
-  **PUT /tasks/{id}** - Atualizar tarefa

⚠️ As rotas de tarefas requerem autenticação Basic Auth com username e senha.

## 🔐 Segurança

-  As senhas são criptografadas usando BCrypt
-  Autenticação usando Basic Auth
-  Validação de propriedade das tarefas

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Isaac Gregorio

## 🙏 Agradecimentos

Projeto inicial desenvolvido durante o minicurso de Java Spring Boot da [Rocketseat](https://rocketseat.com.br/), posteriormente adaptado para usar MongoDB Atlas.

---

⌨️ com ❤️ por [Isaac Gregorio](https://github.com/seu-usuario) | Powered by [Rocketseat](https://rocketseat.com.br/) 🚀
