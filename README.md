# Desafio Fullstack - Mini Kanban

Sistema Kanban para gerenciamento de tarefas desenvolvido com React (frontend) e Go (backend).

## 🚀 Funcionalidades

✅ Três colunas fixas: A Fazer, Em Progresso e Concluídas
✅ Criar tarefas com título obrigatório e descrição opcional
✅ Editar e mover tarefas entre colunas
✅ Excluir tarefas
✅ Feedbacks visuais básicos (loading/erro)
✅ Persistência de dados em arquivo JSON
✅ Comunicação entre frontend e backend via API REST

## 🛠 Tecnologias
Frontend: React, CSS3, HTML5
Backend: Go (Golang), CORS configurado para permitir acesso do frontend
Persistência: Armazenamento em arquivo tasks.json

## 📦 Como Executar

### Backend (Go)
```
cd backend
go mod tidy
go run main.go models.go handlers.go
```

Servidor rodará em http://localhost:8080

### Frontend (React)

```
cd frontend
npm install
npm start
```
Aplicação rodará em http://localhost:3000

⚠️ Certifique-se de que o backend esteja rodando antes de iniciar o frontend.

## 🏗 Decisões Técnicas
Componentização para reutilização (Column, NewTaskForm)
API RESTful com endpoints convencionais
Validações no backend
Estrutura modular no Go com arquivos separados (models, handlers, storage, main) para manter o código limpo e organizado.
Persistência em JSON como alternativa simples a bancos relacionais
Interface minimalista, priorizando clareza e funcionalidade.

## 🔮 Melhorias Futuras
Banco de dados
Autenticação de usuários
Drag and Drop para reorganizar tarefas.
Testes automatizados (unitários e de integração).
Containerização com Docker para facilitar o deploy.
Melhorias visuais (animações, responsividade).
Deploy em ambiente online (Vercel, Render, etc.).

## 📋 Limitações Conhecidas
Sem autenticação ou controle de usuários: qualquer pessoa pode criar, editar e excluir tarefas.
Ausência de drag and drop: o movimento entre colunas é feito por botões ou seletores, não por arrastar e soltar.
Interface simples: o foco foi a funcionalidade principal, sem uso de bibliotecas de design mais avançadas.
Validações básicas: apenas o título é obrigatório, sem verificação de comprimento ou caracteres especiais.
Persistência local: as tarefas são salvas apenas no arquivo tasks.json, sem banco de dados.
Sem deploy público: o projeto roda apenas em ambiente local (localhost).

💻 Projeto do desafio técnico da Veritas Consultoria Empresarial
