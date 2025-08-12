# 📚 Documentação - API Controle Financeiro

## 📁 **Estrutura da Documentação**

```
docs/
├── README.md                    # 📖 Este arquivo - Índice geral
├── api/                         # 🔌 Documentação da API
│   ├── swagger.json            # Swagger/OpenAPI spec
│   └── endpoints.md            # Documentação detalhada dos endpoints
├── database/                    # 🗄️ Documentação do Banco
│   ├── README.md               # Overview do schema
│   ├── migrations/             # Scripts de migração
│   │   └── 001_initial_schema.sql
│   └── seeds/                  # Dados iniciais
│       └── 001_roles_and_categories.sql
├── architecture/               # 🏗️ Documentação da Arquitetura
│   ├── README.md               # Hexagonal Architecture
│   ├── diagrams/               # Diagramas UML/ER
│   └── patterns.md             # Design Patterns aplicados
└── postman/                    # 📮 Coleções do Postman
    ├── collection.json         # Coleção principal
    └── environment.json        # Variáveis de ambiente
```

---

## 🚀 **Quick Start**

### **1. 📖 Leia Primeiro**
- [🏗️ Arquitetura do Sistema](./architecture/README.md)
- [🗄️ Schema do Banco de Dados](./database/README.md)

### **2. 🛠️ Setup Local**
```bash
# 1. Configure o banco
mysql -u root -p < docs/database/migrations/001_initial_schema.sql
mysql -u root -p luis9046_controle_financeiro < docs/database/seeds/001_roles_and_categories.sql

# 2. Configure .env
cp .env.example .env
# Edite as variáveis conforme necessário

# 3. Instale e execute
npm install
npm run dev
```

### **3. 🔍 Teste a API**
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health
- **Postman**: Importe `docs/postman/collection.json`

---

## 📋 **Documentação por Área**

### **🔌 API Documentation**
- **[Swagger/OpenAPI](http://localhost:3000/api-docs)** - Documentação interativa
- **[Endpoints Guide](./api/endpoints.md)** - Guia detalhado de uso
- **[Postman Collection](./postman/)** - Coleção para testes

### **🗄️ Database Documentation**
- **[Schema Overview](./database/README.md)** - Estrutura completa do banco
- **[Migrations](./database/migrations/)** - Versionamento do schema
- **[Seeds](./database/seeds/)** - Dados iniciais e de teste

### **🏗️ Architecture Documentation**
- **[Hexagonal Architecture](./architecture/README.md)** - Visão geral da arquitetura
- **[Design Patterns](./architecture/patterns.md)** - Patterns implementados
- **[Diagrams](./architecture/diagrams/)** - Diagramas UML e ER

---

## 🎯 **Para Desenvolvedores**

### **📝 Novos Recursos**
1. **Use Cases**: Implemente em `src/application/usecases/`
2. **Entities**: Defina em `src/domain/entities/`
3. **Repositories**: Interface em `domain/ports/`, implementação em `infrastructure/persistence/`
4. **Controllers**: Adicione em `src/infrastructure/web/controllers/`

### **🧪 Testes**
```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes E2E (futuro)
npm run test:e2e
```

### **📊 Qualidade de Código**
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatação
npm run format
```

---

## 🔄 **Versionamento**

### **API Versioning**
- Atual: `v1` (prefix: `/api/`)
- Futuro: `v2` quando necessário
- Backward compatibility mantida

### **Database Migrations**
- Numeração sequencial: `001_`, `002_`, etc.
- Sempre incluir rollback (comentado)
- Testar em ambiente de desenvolvimento primeiro

---

## 📞 **Suporte**

### **🐛 Reportar Bugs**
1. Verifique [Issues existentes](https://github.com/Projetos-com-Pieri-Tech/controle-financeiro/issues)
2. Crie nova issue com template
3. Inclua logs e steps para reproduzir

### **💡 Novas Features**
1. Discuta via [Discussions](https://github.com/Projetos-com-Pieri-Tech/controle-financeiro/discussions)
2. Crie RFC (Request for Comments)
3. Implemente seguindo a arquitetura

### **📚 Contribuição**
1. Fork o projeto
2. Crie branch feature: `git checkout -b feat/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feat/nova-funcionalidade`
5. Abra Pull Request

---

## 📈 **Roadmap**

### **🎯 Próximas Implementações**
- [ ] **Frontend Angular** - Interface completa
- [ ] **Testes Automatizados** - Cobertura 80%+
- [ ] **CI/CD Pipeline** - GitHub Actions
- [ ] **Docker Support** - Containerização
- [ ] **API Rate Limiting** - Por usuário
- [ ] **Audit Log** - Log de todas as operações
- [ ] **Backup Automatizado** - Backup diário
- [ ] **Monitoring** - Métricas e alertas

### **🚀 Features Futuras**
- [ ] **Relatórios Avançados** - Gráficos e dashboards
- [ ] **Importação Bancária** - OFX/CSV
- [ ] **Orçamentos** - Planejamento mensal
- [ ] **Metas Financeiras** - Objetivos e tracking
- [ ] **Notificações** - Email e push
- [ ] **API Mobile** - Endpoints otimizados
- [ ] **Multi-tenancy** - Suporte a empresas
- [ ] **Integração PIX** - Pagamentos instantâneos

---

## 📄 **Licença**

Este projeto está sob a licença **ISC**. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

---

<div align="center">

**🏗️ Documentação mantida pela equipe Pieri Tech**

[![GitHub](https://img.shields.io/badge/GitHub-Pieri%20Tech-blue?logo=github)](https://github.com/Projetos-com-Pieri-Tech)

</div>
