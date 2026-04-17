-- =============================================================
--  AutoDrive — Script de População do Banco de Dados
--  Senha de todos os usuários: senha123
--  Hash bcrypt (cost 10, prefixo $2a$): $2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti
--
--  Execute com:
--    psql -U postgres -d aluguel_carros -f seed.sql
-- =============================================================

BEGIN;

-- ── Limpar dados existentes (ordem respeita FK) ──────────────
TRUNCATE TABLE contratos_credito, contratos, pedidos, rendimentos,
               clientes, automoveis, agentes
RESTART IDENTITY CASCADE;

-- ─────────────────────────────────────────────────────────────
--  1. AGENTES  (tipo EMPRESA)
-- ─────────────────────────────────────────────────────────────
INSERT INTO agentes (login, senha, razao_social, cnpj, endereco, tipo, created_at, updated_at) VALUES
  ('gestao@autodrive.com.br',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'AutoDrive Locadora de Veículos Ltda.',
   '12345678000190',
   'Av. Paulista, 1000 – Bela Vista, São Paulo – SP, 01310-100',
   'EMPRESA',
   NOW(), NOW()),

  ('filial.campinas@autodrive.com.br',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'AutoDrive Filial Campinas',
   '12345678000272',
   'Rua José Paulino, 500 – Centro, Campinas – SP, 13010-010',
   'EMPRESA',
   NOW(), NOW());

-- ─────────────────────────────────────────────────────────────
--  2. AGENTES  (tipo BANCO)
-- ─────────────────────────────────────────────────────────────
INSERT INTO agentes (login, senha, razao_social, cnpj, endereco, tipo, created_at, updated_at) VALUES
  ('credito@bancoalpha.com.br',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'Banco Alpha S.A.',
   '98765432000155',
   'SCS Qd. 2 Bl. A, Ed. Banco Alpha, Brasília – DF, 70316-900',
   'BANCO',
   NOW(), NOW()),

  ('financiamento@banconovus.com.br',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'Banco Novus Crédito S.A.',
   '55544433000166',
   'Av. Rio Branco, 200 – Centro, Rio de Janeiro – RJ, 20040-001',
   'BANCO',
   NOW(), NOW());

-- ─────────────────────────────────────────────────────────────
--  3. CLIENTES
-- ─────────────────────────────────────────────────────────────
INSERT INTO clientes (nome, cpf, rg, endereco, profissao, email, telefone, login, senha, status, created_at, updated_at) VALUES
  ('Carlos Eduardo Mendes',
   '12345678901', '12.345.678-9',
   'Rua das Acácias, 45 – Jardim Paulista, São Paulo – SP',
   'Engenheiro de Software',
   'carlos.mendes@email.com', '(11) 9 8765-4321',
   'carlos.mendes@email.com',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'ACTIVE', NOW(), NOW()),

  ('Ana Paula Rodrigues',
   '23456789012', '23.456.789-0',
   'Av. Brasil, 1200, Apto 304 – Barra da Tijuca, Rio de Janeiro – RJ',
   'Médica',
   'ana.rodrigues@email.com', '(21) 9 7654-3210',
   'ana.rodrigues@email.com',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'ACTIVE', NOW(), NOW()),

  ('Rafael Souza Lima',
   '34567890123', '34.567.890-1',
   'Rua Sete de Setembro, 320 – Centro, Curitiba – PR',
   'Advogado',
   'rafael.lima@email.com', '(41) 9 6543-2109',
   'rafael.lima@email.com',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'ACTIVE', NOW(), NOW()),

  ('Juliana Ferreira Costa',
   '45678901234', '45.678.901-2',
   'Rua Padre Eustáquio, 88 – Santo Agostinho, Belo Horizonte – MG',
   'Empresária',
   'juliana.costa@email.com', '(31) 9 5432-1098',
   'juliana.costa@email.com',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'ACTIVE', NOW(), NOW()),

  ('Marcos Antônio Vieira',
   '56789012345', '56.789.012-3',
   'Alameda dos Anjos, 760 – Caminho das Árvores, Salvador – BA',
   'Arquiteto',
   'marcos.vieira@email.com', '(71) 9 4321-0987',
   'marcos.vieira@email.com',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'ACTIVE', NOW(), NOW()),

  ('Fernanda Oliveira Santos',
   '67890123456', '67.890.123-4',
   'Rua Coronel Durval de Abreu, 154 – Agronômica, Florianópolis – SC',
   'Dentista',
   'fernanda.santos@email.com', '(48) 9 3210-9876',
   'fernanda.santos@email.com',
   '$2a$10$6HGAfM47msMPlTNydfe/huoJfTyILjOOwDa2LOv7.F1XNWc8mXYti',
   'ACTIVE', NOW(), NOW());

-- ─────────────────────────────────────────────────────────────
--  4. RENDIMENTOS  (até 3 por cliente)
-- ─────────────────────────────────────────────────────────────
-- Carlos
INSERT INTO rendimentos (entidade_empregadora, valor, cliente_id) VALUES
  ('TechBrasil Sistemas', 12500.00, 1),
  ('Consultoria Digital ME', 4000.00, 1);

-- Ana Paula
INSERT INTO rendimentos (entidade_empregadora, valor, cliente_id) VALUES
  ('Hospital São Lucas', 22000.00, 2),
  ('Clínica Vida Saudável', 8500.00, 2);

-- Rafael
INSERT INTO rendimentos (entidade_empregadora, valor, cliente_id) VALUES
  ('Lima & Associados Advocacia', 18000.00, 3);

-- Juliana
INSERT INTO rendimentos (entidade_empregadora, valor, cliente_id) VALUES
  ('J. Costa Comércio Ltda.', 35000.00, 4),
  ('Grupo Invest Imóveis', 5000.00, 4);

-- Marcos
INSERT INTO rendimentos (entidade_empregadora, valor, cliente_id) VALUES
  ('Vieira Arquitetura e Design', 15000.00, 5),
  ('Prefeitura de Salvador', 3200.00, 5),
  ('Editora Construção Modern.', 1800.00, 5);

-- Fernanda
INSERT INTO rendimentos (entidade_empregadora, valor, cliente_id) VALUES
  ('OdontoPlus Clínica', 19500.00, 6),
  ('Unimed Florianópolis', 6000.00, 6);

-- ─────────────────────────────────────────────────────────────
--  5. AUTOMÓVEIS
-- ─────────────────────────────────────────────────────────────
INSERT INTO automoveis (matricula, ano, marca, modelo, placa, created_at, updated_at) VALUES
  ('MAT-001', 2024, 'BMW',        'Série 3 320i Sport',   'ABC1D23', NOW(), NOW()),
  ('MAT-002', 2024, 'Mercedes',   'C 200 Avantgarde',     'DEF2E34', NOW(), NOW()),
  ('MAT-003', 2023, 'Audi',       'A4 2.0 TFSI S Line',   'GHI3F45', NOW(), NOW()),
  ('MAT-004', 2024, 'Porsche',    'Macan S',              'JKL4G56', NOW(), NOW()),
  ('MAT-005', 2023, 'Volvo',      'XC60 T8 Recharge',     'MNO5H67', NOW(), NOW()),
  ('MAT-006', 2024, 'Toyota',     'Corolla Cross XRX',    'PQR6I78', NOW(), NOW()),
  ('MAT-007', 2024, 'Honda',      'HR-V Touring CVT',     'STU7J89', NOW(), NOW()),
  ('MAT-008', 2023, 'Volkswagen', 'Tiguan Allspace R',    'VWX8K90', NOW(), NOW()),
  ('MAT-009', 2024, 'Jeep',       'Compass Limited T270', 'YZA9L01', NOW(), NOW()),
  ('MAT-010', 2024, 'Chevrolet',  'Onix Plus Premier',    'BCD0M12', NOW(), NOW()),
  ('MAT-011', 2023, 'Hyundai',    'HB20 Diamond Plus',    'EFG1N23', NOW(), NOW()),
  ('MAT-012', 2024, 'Renault',    'Kardian E-Tech',       'HIJ2O34', NOW(), NOW());

-- ─────────────────────────────────────────────────────────────
--  6. PEDIDOS
--     Cobrindo todos os StatusPedido:
--     CRIADO | EM_ANALISE | APROVADO | REPROVADO | CANCELADO
-- ─────────────────────────────────────────────────────────────
INSERT INTO pedidos (data_criacao, status, data_atualizacao, cliente_id, automovel_id) VALUES
  -- Carlos: pedido aprovado (BMW)
  ('2026-04-01', 'APROVADO',   '2026-04-03 10:15:00', 1, 1),
  -- Carlos: pedido cancelado (Audi)
  ('2026-04-10', 'CANCELADO',  '2026-04-11 08:30:00', 1, 3),
  -- Ana Paula: pedido em análise (Mercedes)
  ('2026-04-12', 'EM_ANALISE', '2026-04-12 14:00:00', 2, 2),
  -- Ana Paula: pedido criado recente (Porsche)
  ('2026-04-16', 'CRIADO',     '2026-04-16 09:00:00', 2, 4),
  -- Rafael: pedido aprovado (Volvo)
  ('2026-03-20', 'APROVADO',   '2026-03-22 16:45:00', 3, 5),
  -- Rafael: pedido reprovado (Porsche)
  ('2026-04-05', 'REPROVADO',  '2026-04-07 11:00:00', 3, 4),
  -- Juliana: pedido criado (Corolla Cross)
  ('2026-04-15', 'CRIADO',     '2026-04-15 13:20:00', 4, 6),
  -- Juliana: pedido aprovado (Tiguan)
  ('2026-03-10', 'APROVADO',   '2026-03-13 17:00:00', 4, 8),
  -- Marcos: pedido em análise (HR-V)
  ('2026-04-14', 'EM_ANALISE', '2026-04-14 10:05:00', 5, 7),
  -- Fernanda: pedido criado (Compass)
  ('2026-04-16', 'CRIADO',     '2026-04-16 11:00:00', 6, 9);

-- ─────────────────────────────────────────────────────────────
--  7. CONTRATOS  (apenas pedidos APROVADOS)
--     pedido 1 → BMW (cliente Carlos)
--     pedido 5 → Volvo (cliente Rafael)
--     pedido 8 → Tiguan (cliente Juliana)
-- ─────────────────────────────────────────────────────────────
INSERT INTO contratos (data_assinatura, tipo, pedido_id, automovel_id) VALUES
  ('2026-04-03', 'ALUGUEL', 1, 1),
  ('2026-03-22', 'ALUGUEL', 5, 5),
  ('2026-03-13', 'ALUGUEL', 8, 8);

-- ─────────────────────────────────────────────────────────────
--  8. CONTRATOS DE CRÉDITO  (vinculados aos pedidos aprovados)
--     banco_id 3 = Banco Alpha S.A.
--     banco_id 4 = Banco Novus Crédito S.A.
-- ─────────────────────────────────────────────────────────────
INSERT INTO contratos_credito (valor, aprovado, banco_id, pedido_id, created_at) VALUES
  (8500.00,  true, 3, 1, '2026-04-02 15:00:00'),
  (6200.00,  true, 4, 5, '2026-03-21 10:30:00'),
  (9800.00,  true, 3, 8, '2026-03-12 09:45:00');

COMMIT;

-- ─────────────────────────────────────────────────────────────
--  RESUMO DE ACESSO  —  senha de todos: senha123
-- ─────────────────────────────────────────────────────────────
--  CLIENTES:
--    carlos.mendes@email.com    | senha123
--    ana.rodrigues@email.com    | senha123
--    rafael.lima@email.com      | senha123
--    juliana.costa@email.com    | senha123
--    marcos.vieira@email.com    | senha123
--    fernanda.santos@email.com  | senha123
--
--  EMPRESA (agente):
--    gestao@autodrive.com.br              | senha123
--    filial.campinas@autodrive.com.br     | senha123
--
--  BANCO (agente):
--    credito@bancoalpha.com.br            | senha123
--    financiamento@banconovus.com.br      | senha123
-- =============================================================
