# 📚 DOCUMENTAÇÃO DO PROJETO

## 📁 Estrutura Organizada

### 🗄️ **database/** - Banco de Dados
- `schema.sql` - Script SQL para criação das tabelas MySQL
- `schema.dbml` - Diagrama do banco em formato DBML
- `schema.md` - Documentação textual do schema

### 📮 **postman/** - Testes da API
- `collection.json` - Collection completa para testes no Postman
- Inclui todos os endpoints com autenticação automática

### 🌐 **api/** - Documentação da API
- `swagger.md` - Guia do Swagger UI
- Documentação interativa disponível em `/api/docs`

## 🚀 Como usar cada pasta:

### **Database:**
```bash
# Executar o schema no MySQL
mysql -u usuario -p < docs/database/schema.sql
```

### **Postman:**
1. Abrir Postman
2. Import → Upload Files
3. Selecionar `docs/postman/collection.json`
4. Executar testes sequencialmente

### **API:**
- Acessar: http://localhost:3001/api/docs
- Testar endpoints interativamente
- Ver documentação completa

## 📋 Arquivos na raiz da API:

### **Guias principais:**
- `GUIA_PRODUCAO.md` - Setup e execução
- `README.md` - Visão geral do projeto

### **Configuração:**
- `.env` - Variáveis de ambiente (não commitado)
- `.env.example` - Template das variáveis
- `package.json` - Dependências e scripts
- `tsconfig.json` - Configuração TypeScript

**Estrutura limpa e organizada! 🎯**
