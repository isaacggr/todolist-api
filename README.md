# 📝 TodoList - Gerenciador de Tarefas

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-brightgreen)
![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

Um aplicativo completo para gerenciamento de tarefas com backend em Spring Boot e frontend responsivo, permitindo organizar suas atividades de forma eficiente com autenticação segura e interface intuitiva.

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-orange" alt="Java 17">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.4-brightgreen" alt="Spring Boot">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-green" alt="MongoDB Atlas">
  <img src="https://img.shields.io/badge/HTML-5-red" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS-3-blue" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES6-yellow" alt="JavaScript">
</p>

## 📋 Índice

-  [Visão Geral](#-visão-geral)
-  [Funcionalidades](#-funcionalidades)
-  [Tecnologias](#-tecnologias-utilizadas)
-  [Instalação e Execução](#-instalação-e-execução)
-  [Estrutura do Projeto](#-estrutura-do-projeto)
-  [API Endpoints](#-api-endpoints)
-  [Interface Web](#-interface-web)
-  [Segurança](#-segurança)
-  [Contribuição](#-contribuição)
-  [Próximos Passos](#-próximos-passos)
-  [Licença](#-licença)
-  [Autor](#-autor)

## 🌟 Visão Geral

O TodoList é uma aplicação web completa para gerenciamento de tarefas, permitindo que os usuários organizem suas atividades por prioridade e prazo. O sistema possui autenticação segura, interface responsiva e intuitiva, e uma API RESTful robusta construída com Spring Boot. O projeto implementa boas práticas de desenvolvimento como tratamento adequado de exceções, validações de dados e uma arquitetura organizada.

## ✅ Funcionalidades

-  **Usuários**:

   -  Cadastro de novos usuários com validação de dados
   -  Autenticação segura via Basic Auth
   -  Perfil personalizado com histórico de atividades
   -  Proteção contra usuários duplicados

-  **Tarefas**:

   -  Criação de tarefas com título, descrição e prioridade
   -  Definição de prazos (data inicial e final) com validação automática
   -  Listagem filtrada por usuário autenticado
   -  Atualização de detalhes e status
   -  Organização por prioridade (ALTA, MÉDIA, BAIXA)
   -  Validação de datas e campos obrigatórios

-  **Interface**:
   -  Design responsivo e moderno utilizando Flexbox e Grid
   -  Animações e transições suaves para melhor experiência do usuário
   -  Dashboard intuitivo para gerenciamento de tarefas
   -  Notificações de feedback para ações do usuário
   -  Componentes personalizados e reutilizáveis
   -  Efeitos visuais como glassmorphism e cards elevados

## 🚀 Tecnologias Utilizadas

### Backend

-  Java 17
-  Spring Boot 3.4.4
-  Spring Data MongoDB
-  Spring Security
-  Spring MVC para REST API
-  Lombok para redução de boilerplate
-  Maven para gerenciamento de dependências
-  BCrypt para criptografia de senhas
-  Tratamento global de exceções

### Frontend

-  HTML5 semântico
-  CSS3 (Animações, Flexbox, Grid, Variáveis CSS)
-  JavaScript ES6+ com Fetch API
-  Web Components para organização modular
-  Design responsivo com media queries
-  Animações e transições personalizadas

### Banco de Dados

-  MongoDB Atlas (Cloud)
-  Índices otimizados para consultas frequentes

### Ferramentas

-  VS Code para frontend
-  IntelliJ IDEA para desenvolvimento Java
-  Git/GitHub para controle de versão
-  API DOG para testes de API
-  Maven para build e dependências

## 🛠️ Instalação e Execução

### Pré-requisitos

-  Java 17 ou superior
-  Maven 3.8+
-  MongoDB Atlas (ou MongoDB local na porta 27017)
-  Navegador moderno (Chrome, Firefox, Edge)
-  Git

### Configuração

1. **Clone o repositório**:

```bash
git clone https://github.com/seu-usuario/todolist.git
cd todolist
```

2. **Configure o MongoDB**:

Edite o arquivo `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=sua-string-de-conexao-mongodb
spring.data.mongodb.database=todolist
api.security.token.secret=seu-segredo-para-tokens
```

3. **Compilação e execução**:

```bash
mvn clean install
mvn spring-boot:run
```

4. **Acesse a aplicação**:

Abra o navegador e acesse: `http://localhost:8080`

### Execução com Docker (opcional)

Se preferir usar Docker:

```bash
docker build -t todolist-app .
docker run -p 8080:8080 todolist-app
```

## 📂 Estrutura do Projeto

```
src/
├── main/
│   ├── java/com/isaacggr/todolist/
│   │   ├── config/         # Configurações do Spring e CORS
│   │   ├── errors/         # Tratamento global de exceções
│   │   ├── filter/         # Filtros de autenticação
│   │   ├── task/           # Controladores e modelos de tarefas
│   │   ├── user/           # Controladores e modelos de usuários
│   │   ├── utils/          # Classes utilitárias e helpers
│   │   └── TodolistApplication.java  # Classe principal
│   │
│   └── resources/
│       ├── static/         # Arquivos frontend (HTML, CSS, JS)
│       │   ├── index.html  # Página principal
│       │   ├── script.js   # Lógica JavaScript
│       │   └── style.css   # Estilos e animações
│       └── application.properties    # Configurações da aplicação
└── test/                   # Testes unitários e de integração
```

## 📌 API Endpoints

### Autenticação

Todas as rotas de tarefas requerem autenticação via Basic Auth.

### Usuários

-  **POST `/users/`** - Criar novo usuário

   Corpo da requisição:

   ```json
   {
      "name": "Seu Nome",
      "username": "seu.usuario",
      "password": "sua-senha"
   }
   ```

   Resposta (201 Created):

   ```json
   {
      "id": "user-uuid",
      "name": "Seu Nome",
      "username": "seu.usuario",
      "createdAt": "2025-04-20T14:30:00"
   }
   ```

   Possíveis erros:

   -  400 Bad Request - Dados inválidos ou incompletos
   -  409 Conflict - Nome de usuário já existe

### Tarefas

-  **POST `/tasks/`** - Criar nova tarefa

   Corpo da requisição:

   ```json
   {
      "title": "Título da Tarefa",
      "description": "Descrição detalhada da tarefa",
      "priority": "ALTA",
      "startAt": "2025-04-20T10:00:00",
      "endAt": "2025-04-20T18:00:00"
   }
   ```

   Resposta (201 Created):

   ```json
   {
      "id": "task-uuid",
      "title": "Título da Tarefa",
      "description": "Descrição detalhada da tarefa",
      "priority": "ALTA",
      "startAt": "2025-04-20T10:00:00",
      "endAt": "2025-04-20T18:00:00",
      "createdAt": "2025-04-18T14:30:00",
      "userId": "user-uuid"
   }
   ```

-  **GET `/tasks/`** - Listar tarefas do usuário autenticado

   Resposta (200 OK):

   ```json
   [
      {
         "id": "task-uuid-1",
         "title": "Título da Tarefa 1",
         "description": "Descrição detalhada da tarefa 1",
         "priority": "ALTA",
         "startAt": "2025-04-20T10:00:00",
         "endAt": "2025-04-20T18:00:00",
         "createdAt": "2025-04-18T14:30:00"
      },
      {
         "id": "task-uuid-2",
         "title": "Título da Tarefa 2",
         "description": "Descrição detalhada da tarefa 2",
         "priority": "MÉDIA",
         "startAt": "2025-04-21T09:00:00",
         "endAt": "2025-04-21T17:00:00",
         "createdAt": "2025-04-18T15:45:00"
      }
   ]
   ```

-  **GET `/tasks/{id}`** - Buscar tarefa específica

   Resposta (200 OK):

   ```json
   {
      "id": "task-uuid",
      "title": "Título da Tarefa",
      "description": "Descrição detalhada da tarefa",
      "priority": "ALTA",
      "startAt": "2025-04-20T10:00:00",
      "endAt": "2025-04-20T18:00:00",
      "createdAt": "2025-04-18T14:30:00",
      "userId": "user-uuid"
   }
   ```

-  **PUT `/tasks/{id}`** - Atualizar tarefa existente

   Corpo da requisição:

   ```json
   {
      "title": "Título Atualizado",
      "description": "Descrição atualizada da tarefa",
      "priority": "MÉDIA"
   }
   ```

   Resposta (200 OK):

   ```json
   {
      "id": "task-uuid",
      "title": "Título Atualizado",
      "description": "Descrição atualizada da tarefa",
      "priority": "MÉDIA",
      "startAt": "2025-04-20T10:00:00",
      "endAt": "2025-04-20T18:00:00",
      "createdAt": "2025-04-18T14:30:00",
      "updatedAt": "2025-04-19T09:15:00"
   }
   ```

-  **DELETE `/tasks/{id}`** - Excluir tarefa

   Resposta (204 No Content)

Códigos de Erro Comuns:

-  400 Bad Request - Dados inválidos
-  401 Unauthorized - Usuário não autenticado
-  403 Forbidden - Usuário sem permissão para acessar a tarefa
-  404 Not Found - Tarefa não encontrada
-  500 Internal Server Error - Erro do servidor

## 🖥️ Interface Web

A interface do usuário foi desenvolvida com foco em:

-  **Design Responsivo**: Adaptável para dispositivos móveis e desktop
-  **UX Intuitiva**: Fluxos simples para cadastro, login e gerenciamento de tarefas
-  **Animações Suaves**: Efeitos de transição e feedback visual para melhor experiência
-  **Acessibilidade**: Elementos semânticos e navegação por teclado

### Páginas Principais:

-  Login e Cadastro com validações em tempo real
-  Dashboard com visão geral das tarefas
-  Criação/Edição de Tarefas com formulários intuitivos
-  Perfil do Usuário (em desenvolvimento)

## 🔐 Segurança

-  **Autenticação**: Basic Auth implementado via filtro personalizado
-  **Criptografia**: Senhas protegidas com BCrypt (nunca armazenadas em texto puro)
-  **Validação**: Dados validados tanto no cliente quanto no servidor
-  **Propriedade**: Usuários só podem manipular suas próprias tarefas
-  **Proteção contra Ataques**:
   -  XSS: Sanitização de inputs e escape de caracteres
   -  CSRF: Proteção contra requisições forjadas
   -  Injeção: Validação rigorosa de dados de entrada
-  **Headers de Segurança**: Implementados para proteção adicional

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 🔮 Próximos Passos

-  [ ] Implementação de modo escuro completo (estrutura CSS já preparada)
-  [ ] Sistema de notificações para tarefas com prazo próximo
-  [ ] Compartilhamento de tarefas entre usuários
-  [ ] Funcionalidade de repetição para tarefas recorrentes
-  [ ] Aplicativo mobile com React Native

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Isaac Gregorio**

[![GitHub](https://img.shields.io/badge/GitHub-isaacggr-black?logo=github)](https://github.com/isaacggr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Isaac%20Gregorio-blue?logo=linkedin)](https://www.linkedin.com/in/isaac-gregorio-5a5571197/)

---

⌨️ com ❤️ por [Isaac Gregorio](https://www.linkedin.com/in/isaac-gregorio-5a5571197/) | Powered by [Rocketseat](https://rocketseat.com.br/) 🚀

_Última atualização: 20 de abril de 2025_
