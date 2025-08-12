-- ========================================
-- SEEDS: 001_roles_and_categories
-- DESCRIPTION: Dados iniciais para roles e categorias globais
-- DATE: 2025-08-12
-- ========================================

USE luis9046_controle_financeiro;

-- ========================================
-- ROLES (Perfis de Usuário)
-- ========================================

INSERT INTO roles (id, name, description) VALUES 
('3e1e1e1e-1111-4111-8111-111111111111', 'admin', 'Administrador do sistema com acesso total'),
('3e1e1e1e-1111-4111-8111-111111111112', 'user', 'Usuário comum com acesso às próprias funcionalidades');

-- ========================================
-- CATEGORIAS GLOBAIS (user_id = NULL)
-- ========================================

-- Todas as categorias em um único INSERT para reduzir duplicação
INSERT INTO categories (id, user_id, name) VALUES 
-- Categorias de Receita
('4c4c4c4c-2222-4222-8222-222222222001', NULL, 'Salário'),
('4c4c4c4c-2222-4222-8222-222222222002', NULL, 'Freelancer'),
('4c4c4c4c-2222-4222-8222-222222222003', NULL, 'Investimentos'),
('4c4c4c4c-2222-4222-8222-222222222004', NULL, 'Vendas'),
('4c4c4c4c-2222-4222-8222-222222222005', NULL, 'Aluguel Recebido'),
('4c4c4c4c-2222-4222-8222-222222222006', NULL, 'Bonificação'),
('4c4c4c4c-2222-4222-8222-222222222007', NULL, 'Restituição IR'),
('4c4c4c4c-2222-4222-8222-222222222008', NULL, 'Outros Recebimentos'),

-- Categorias de Despesa - Essenciais
('4c4c4c4c-2222-4222-8222-222222222101', NULL, 'Alimentação'),
('4c4c4c4c-2222-4222-8222-222222222102', NULL, 'Moradia'),
('4c4c4c4c-2222-4222-8222-222222222103', NULL, 'Transporte'),
('4c4c4c4c-2222-4222-8222-222222222104', NULL, 'Saúde'),
('4c4c4c4c-2222-4222-8222-222222222105', NULL, 'Educação'),
('4c4c4c4c-2222-4222-8222-222222222106', NULL, 'Vestuário'),
('4c4c4c4c-2222-4222-8222-222222222107', NULL, 'Higiene e Beleza'),

-- Categorias de Despesa - Contas Fixas
('4c4c4c4c-2222-4222-8222-222222222201', NULL, 'Energia Elétrica'),
('4c4c4c4c-2222-4222-8222-222222222202', NULL, 'Água'),
('4c4c4c4c-2222-4222-8222-222222222203', NULL, 'Internet'),
('4c4c4c4c-2222-4222-8222-222222222204', NULL, 'Telefone'),
('4c4c4c4c-2222-4222-8222-222222222205', NULL, 'TV/Streaming'),
('4c4c4c4c-2222-4222-8222-222222222206', NULL, 'Seguro Saúde'),
('4c4c4c4c-2222-4222-8222-222222222207', NULL, 'Seguro Veículo'),
('4c4c4c4c-2222-4222-8222-222222222208', NULL, 'IPTU'),
('4c4c4c4c-2222-4222-8222-222222222209', NULL, 'Condomínio'),
('4c4c4c4c-2222-4222-8222-222222222210', NULL, 'Financiamento'),

-- Categorias de Despesa - Lazer e Lifestyle
('4c4c4c4c-2222-4222-8222-222222222301', NULL, 'Entretenimento'),
('4c4c4c4c-2222-4222-8222-222222222302', NULL, 'Viagens'),
('4c4c4c4c-2222-4222-8222-222222222303', NULL, 'Restaurantes'),
('4c4c4c4c-2222-4222-8222-222222222304', NULL, 'Esportes'),
('4c4c4c4c-2222-4222-8222-222222222305', NULL, 'Hobbies'),
('4c4c4c4c-2222-4222-8222-222222222306', NULL, 'Presentes'),
('4c4c4c4c-2222-4222-8222-222222222307', NULL, 'Pet/Animais'),

-- Categorias de Despesa - Financeiro
('4c4c4c4c-2222-4222-8222-222222222401', NULL, 'Cartão de Crédito'),
('4c4c4c4c-2222-4222-8222-222222222402', NULL, 'Empréstimos'),
('4c4c4c4c-2222-4222-8222-222222222403', NULL, 'Investimentos'),
('4c4c4c4c-2222-4222-8222-222222222404', NULL, 'Taxas Bancárias'),
('4c4c4c4c-2222-4222-8222-222222222405', NULL, 'Impostos'),
('4c4c4c4c-2222-4222-8222-222222222406', NULL, 'Poupança'),
('4c4c4c4c-2222-4222-8222-222222222407', NULL, 'Reserva Emergência'),

-- Categorias Gerais
('4c4c4c4c-2222-4222-8222-222222222501', NULL, 'Casa e Decoração'),
('4c4c4c4c-2222-4222-8222-222222222502', NULL, 'Tecnologia'),
('4c4c4c4c-2222-4222-8222-222222222503', NULL, 'Doações'),
('4c4c4c4c-2222-4222-8222-222222222504', NULL, 'Emergências'),
('4c4c4c4c-2222-4222-8222-222222222505', NULL, 'Outros');

-- ========================================
-- USUÁRIO ADMIN PADRÃO (OPCIONAL)
-- ========================================

-- Senha: admin123 (hash bcrypt com salt rounds = 10)
INSERT INTO users (id, name, email, password_hash, role_id) VALUES 
('5d5d5d5d-3333-4333-8333-333333333333', 
 'Administrador', 
 'admin@controle-financeiro.com', 
 '$2b$10$rGVvFr.9fJ1Kz.9Qv.9Qv.9Qv.9Qv.9Qv.9Qv.9Qv.9Qv.9Qv.9Qv.',
 '3e1e1e1e-1111-4111-8111-111111111111');

-- ========================================
-- CONTA PADRÃO PARA ADMIN (OPCIONAL)  
-- ========================================

INSERT INTO accounts (id, user_id, name, type, initial_balance) VALUES 
('6e6e6e6e-4444-4444-8444-444444444444',
 '5d5d5d5d-3333-4333-8333-333333333333',
 'Conta Principal',
 'CORRENTE',
 0.00);

-- ========================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ========================================

SELECT 'ROLES INSERIDOS:' as info;
SELECT id, name, description FROM roles;

SELECT 'CATEGORIAS INSERIDAS:' as info;
SELECT COUNT(*) as total_categorias FROM categories WHERE user_id IS NULL;

SELECT 'USUÁRIO ADMIN:' as info;
SELECT id, name, email, role_id FROM users WHERE email = 'admin@controle-financeiro.com';

SELECT 'SETUP COMPLETO!' as status;
