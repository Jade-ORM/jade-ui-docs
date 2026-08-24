import type { DocSection } from "./docs-v1.3";

export const docsSectionsPtBr: DocSection[] = [
  {
    id: "introduction",
    title: "Introdução",
    description: "O que é Jade e por que você deveria usá-lo.",
    content: [
      {
        type: "paragraph",
        text: "Jade é um ORM para Lua que mapeia suas tabelas de banco de dados para objetos Lua. Você define seu schema em código, e Jade cuida das migrations, queries e validação de dados.",
      },
      {
        type: "paragraph",
        text: "Diferente de alguns ORMs, Jade não esconde o SQL. Toda query é transparente. Você sempre pode ver o que está sendo executado contra seu banco de dados.",
      },
      { type: "heading", text: "Princípios de Design", level: 3 },
      {
        type: "list",
        items: [
          "**Schema é a verdade.** A estrutura do seu banco é definida em código Lua.",
          "**SQL é visível.** Toda operação pode ser auditada.",
          "**Migrations são determinísticas.** Sem alterações surpresa no schema.",
          "**Você tem controle.** Sem magia, sem comportamento oculto.",
        ],
      },
    ],
  },
  {
    id: "installation",
    title: "Instalação",
    description: "Como instalar Jade e seus requisitos.",
    content: [
      { type: "heading", text: "Via LuaRocks", level: 3 },
      { type: "code", code: "luarocks install jade", language: "bash" },
      { type: "heading", text: "Requisitos", level: 3 },
      {
        type: "list",
        items: [
          "Lua 5.1, 5.2, 5.3, 5.4, ou LuaJIT",
          "PostgreSQL (via luapgsql ou pgmoon)",
          "MySQL (via luasql-mysql)",
          "SQLite (via luasql-sqlite3)",
        ],
      },
      { type: "heading", text: "Instalar CLI Esmeralda", level: 3 },
      {
        type: "code",
        code: "npm install -g @alehandrosv/esmeralda-cli",
        language: "bash",
      },
      {
        type: "callout",
        variant: "tip",
        text: "O CLI é opcional mas recomendado para migrations e gerenciamento de schema.",
      },
    ],
  },
  {
    id: "quick-start",
    title: "Início Rápido",
    description: "Comece a usar o Jade em 3 passos.",
    content: [
      { type: "heading", text: "1. Configurar o Banco de Dados", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local jade = require("jade")

jade.configure({
  database = {
    driver = "postgresql",
    host = "localhost",
    port = 5432,
    database = "myapp",
    user = "postgres",
    password = "secret"
  }
})`,
      },
      { type: "heading", text: "2. Definir uma Entidade", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local User = jade.Entity("users", {
  id = jade.Integer():primaryKey(),
  name = jade.String(120),
  email = jade.String():unique(),
  active = jade.Boolean():default(true),
  created_at = jade.Timestamp():defaultNow()
})`,
      },
      { type: "heading", text: "3. Usar Operações CRUD", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Criar
local user = User:create({ name = "Lucas", email = "lucas@email.com" })

-- Ler (polimórfico)
local user = User:find(1)                                    -- por ID
local users = User:find({ where = { active = true } })      -- com condições
local admin = User:findFirst({ where = { role = "admin" } }) -- buscar primeiro

-- Atualizar (polimórfico)
User:update(1, { name = "Novo Nome" })                       -- por ID
User:update({ where = { role = "user" }, data = { role = "admin" } }) -- com condições

-- Deletar (polimórfico)
User:delete(1)                                               -- por ID
User:delete({ where = { active = false } })                  -- com condições`,
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuração",
    description: "Todas as opções de configuração do Jade.",
    content: [
      { type: "heading", text: "Configuração Básica", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `jade.configure({
  database = {
    driver = "postgresql",  -- "postgresql", "mysql", ou "sqlite"
    host = "localhost",
    port = 5432,
    database = "myapp",
    user = "postgres",
    password = "secret"
  }
})`,
      },
      { type: "heading", text: "Usando uma URL", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- PostgreSQL
jade.configure({ url = "postgresql://user:pass@localhost:5432/myapp" })

-- MySQL
jade.configure({ url = "mysql://user:pass@localhost:3306/myapp" })

-- SQLite
jade.configure({ url = "sqlite:///path/to/database.db" })`,
      },
      { type: "heading", text: "Configuração por Ambiente", level: 3 },
      {
        type: "paragraph",
        text: "Jade suporta arquivos de configuração específicos por ambiente:",
      },
      {
        type: "code",
        language: "lua",
        code: `-- jade.config.lua (base)
return {
  database = {
    driver = "postgresql",
    host = "localhost",
    database = "myapp"
  }
}

-- jade.config.production.lua (override)
return {
  database = {
    host = "\${DB_HOST}",
    password = "\${DB_PASSWORD}"
  }
}`,
      },
      {
        type: "callout",
        variant: "info",
        text: 'Defina a variável de ambiente JADE_ENV para selecionar o arquivo de configuração. O padrão é "development".',
      },
    ],
  },
  {
    id: "schema",
    title: "Visão Geral do Schema",
    description: "Como definir o schema do seu banco de dados com Jade.",
    content: [
      {
        type: "paragraph",
        text: "Jade usa um sistema de schema declarativo. Você define entidades com suas colunas e tipos, e Jade cuida do resto.",
      },
      {
        type: "code",
        language: "lua",
        code: `local User = jade.Entity("users", {
  id = jade.Integer():primaryKey(),
  name = jade.String(120),
  email = jade.String(255):unique(),
  age = jade.Integer(),
  active = jade.Boolean():default(true),
  created_at = jade.Timestamp():defaultNow()
})`,
      },
      { type: "heading", text: "Opções de Entidade", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Nome de tabela customizado
local User = jade.Entity("app_users", { ... })

-- Com atribuição de banco de dados
local Log = jade.Entity("logs", {}, { database = "analytics" })

-- Com soft delete
local User = jade.Entity("users", { ... }):softDelete()`,
      },
    ],
  },
  {
    id: "column-types",
    title: "Tipos de Coluna",
    description: "Todos os tipos de coluna disponíveis no Jade.",
    content: [
      {
        type: "table",
        headers: ["Tipo", "Lua", "PostgreSQL", "MySQL", "SQLite"],
        rows: [
          [
            "String",
            "jade.String(255)",
            "VARCHAR(255)",
            "VARCHAR(255)",
            "TEXT",
          ],
          ["Text", "jade.Text()", "TEXT", "TEXT", "TEXT"],
          ["Integer", "jade.Integer()", "INTEGER", "INTEGER", "INTEGER"],
          ["BigInt", "jade.BigInt()", "BIGINT", "BIGINT", "INTEGER"],
          ["Float", "jade.Float()", "DOUBLE PRECISION", "DOUBLE", "REAL"],
          [
            "Decimal",
            "jade.Decimal(10,2)",
            "NUMERIC(10,2)",
            "DECIMAL(10,2)",
            "REAL",
          ],
          ["Boolean", "jade.Boolean()", "BOOLEAN", "TINYINT(1)", "INTEGER"],
          ["Timestamp", "jade.Timestamp()", "TIMESTAMPTZ", "TIMESTAMP", "TEXT"],
          ["Date", "jade.Date()", "DATE", "DATE", "TEXT"],
          ["UUID", "jade.UUID()", "UUID", "VARCHAR(36)", "TEXT"],
          ["JSON", "jade.JSON()", "JSONB", "JSON", "TEXT"],
          ["Enum", 'jade.Enum("a","b")', "TEXT + CHECK", "TEXT", "TEXT"],
        ],
      },
    ],
  },
  {
    id: "column-modifiers",
    title: "Modificadores de Coluna",
    description: "Modificadores que podem ser encadeados nos tipos de coluna.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `jade.Integer():primaryKey()     -- PRIMARY KEY
jade.String():unique()          -- UNIQUE
jade.String():notNull()         -- NOT NULL
jade.Boolean():default(true)    -- DEFAULT true
jade.Timestamp():defaultNow()   -- DEFAULT CURRENT_TIMESTAMP
jade.String():encrypted()       -- Coluna encriptada`,
      },
      { type: "heading", text: "Modificador de Encriptação", level: 3 },
      {
        type: "paragraph",
        text: "O modificador :encrypted() marca uma coluna para encriptação. Requer que jade.Encryption.configure() seja chamado primeiro.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Configure a encriptação primeiro
jade.Encryption.configure({ key = "secret-key" })

-- Depois use :encrypted() nas colunas
local User = jade.Entity("users", {
  email = jade.String(255):encrypted(),
  ssn = jade.String(11):encrypted(),
})`,
      },
      {
        type: "link",
        text: "Saiba mais sobre Encriptação →",
        href: "/docs/encryption",
      },
    ],
  },
  {
    id: "relations",
    title: "Relações",
    description: "Defina relacionamentos entre entidades.",
    content: [
      { type: "heading", text: "Tipos de Relação", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- belongsTo (chave estrangeira nesta entidade)
Post:belongsTo(User)

-- hasOne (chave estrangeira na outra entidade)
User:hasOne(Profile)

-- hasMany (chave estrangeira na outra entidade)
User:hasMany(Post)

-- hasAndBelongsToMany (tabela pivô)
User:hasAndBelongsToMany(Tag)

-- hasManyThrough (via entidade intermediária)
User:hasAndBelongsToMany(Post, Comment)`,
      },
      { type: "heading", text: "Eager Loading", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Carregar posts com seu autor
local posts = Post:include("author"):get()

-- Múltiplas relações
local users = User:include("posts"):include("profile"):get()`,
      },
      { type: "heading", text: "Lazy Loading", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local user = User:find(1)
local posts = user.posts:load()  -- Carrega sob demanda`,
      },
    ],
  },
  {
    id: "query-builder",
    title: "Query Builder",
    description: "Construa queries com uma API encadeável.",
    content: [
      { type: "heading", text: "Condições Where", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Condições simples
User:where(User.age:eq(18)):get()
User:where(User.name:like("%Lucas%")):get()

-- Múltiplas condições (AND)
User:where(User.age:gt(18)):where(User.active:eq(true)):get()

-- Usando operadores
User:where(User.age:gt(18)):get()
User:where(User.age:ge(18)):where(User.age:le(65)):get()`,
      },
      { type: "heading", text: "Ordenação, Limite, Offset", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `User:orderBy(User.name):get()
User:orderBy(User.name, "DESC"):get()
User:limit(10):offset(20):get()`,
      },
      { type: "heading", text: "Agregações", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `User:count()
User:where(User.active:eq(true)):count()
User:sum("views")
User:average("age")
User:min("age")
User:max("age")`,
      },
      { type: "heading", text: "Paginação", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local page = User:paginate({ page = 2, perPage = 20 })
-- Retorna: { items = {...}, total = 100, page = 2, perPage = 20, lastPage = 5 }`,
      },
    ],
  },
  {
    id: "encryption",
    title: "Encriptação",
    description: "Encripte dados sensíveis no seu banco de dados.",
    content: [
      {
        type: "paragraph",
        text: "Jade suporta dois modos de encriptação: nativo do banco (recomendado para produção) e customizado (para lógica fornecida pelo usuário).",
      },
      { type: "heading", text: "Encriptação Nativa do Banco (AES)", level: 3 },
      {
        type: "paragraph",
        text: "Usa as funções de encriptação integradas do banco de dados. Requer PostgreSQL com extensão pgcrypto ou MySQL.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Configurar encriptação com uma chave secreta
jade.Encryption.configure({ key = "minha-chave-secreta" })

-- PostgreSQL: instale a extensão pgcrypto primeiro
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Marcar colunas como encriptadas
local User = jade.Entity("users", {
  id = jade.Integer():primaryKey(),
  name = jade.String(120),
  email = jade.String(255):encrypted(),
  ssn = jade.String(11):encrypted(),
})

-- Valores são encriptados no banco de dados (não em Lua)
-- PostgreSQL: pgp_sym_encrypt(column, key)
-- MySQL: AES_ENCRYPT(column, key)
-- A desencriptação acontece automaticamente no SELECT`,
      },
      {
        type: "heading",
        text: "Encriptação Customizada (Funções do Usuário)",
        level: 3,
      },
      { type: "heading", text: "Opção 1: Funções Inline", level: 4 },
      {
        type: "code",
        language: "lua",
        code: `jade.Encryption.configure({
  key = "minha-chave-secreta",
  algorithm = "custom",
  encrypt_fn = function(value, key)
    -- sua lógica de encriptação aqui
    return valor_encriptado
  end,
  decrypt_fn = function(encrypted, key)
    -- sua lógica de desencriptação aqui
    return valor_original
  end,
})`,
      },
      { type: "heading", text: "Opção 2: Arquivos Separados", level: 4 },
      {
        type: "code",
        language: "lua",
        code: `jade.Encryption.configure({
  key = "minha-chave-secreta",
  algorithm = "custom",
  encrypt_file = "encryption/encrypt.lua",
  decrypt_file = "encryption/decrypt.lua",
})`,
      },
      {
        type: "paragraph",
        text: "Os arquivos de encriptação devem retornar uma função:",
      },
      { type: "heading", text: "encryption/encrypt.lua", level: 4 },
      {
        type: "code",
        language: "lua",
        code: `return function(value, key)
  local result = {}
  for i = 1, #value do
    local byte = string.byte(value, i)
    local key_byte = string.byte(key, (i - 1) % #key + 1)
    result[i] = string.char((byte + key_byte) % 256)
  end
  return table.concat(result)
end`,
      },
      { type: "heading", text: "Opções de Configuração", level: 3 },
      {
        type: "table",
        headers: ["Opção", "Tipo", "Descrição"],
        rows: [
          ["key", "string", "Chave de encriptação (obrigatório)"],
          [
            "algorithm",
            '"aes" | "custom"',
            '"aes" para nativo do banco, "custom" para funções Lua',
          ],
          [
            "database_encrypted",
            "boolean",
            "Encriptar TODAS as colunas em TODAS as entidades",
          ],
          ["fields", "table", "Encriptar campos específicos por entidade"],
          [
            "encrypt_fn",
            "function",
            "Função de encriptação customizada (inline)",
          ],
          [
            "decrypt_fn",
            "function",
            "Função de desencriptação customizada (inline)",
          ],
          [
            "encrypt_file",
            "string",
            "Função de encriptação customizada (de arquivo)",
          ],
          [
            "decrypt_file",
            "string",
            "Função de desencriptação customizada (de arquivo)",
          ],
        ],
      },
    ],
  },
  {
    id: "security",
    title: "Recursos de Segurança",
    description: "Proteções de segurança integradas.",
    content: [
      {
        type: "paragraph",
        text: "Jade inclui vários recursos de segurança para proteger sua aplicação contra vulnerabilidades comuns.",
      },
      { type: "heading", text: "Proteção contra SQL Injection", level: 3 },
      {
        type: "list",
        items: [
          "Todos os nomes de colunas e tabelas são citados com escaping de identificadores",
          "Queries parametrizadas com parâmetros de ligação (?)",
          "Validação de entrada para nomes de colunas, LIMIT, OFFSET, ORDER BY",
          "Itens SELECT são validados contra uma whitelist de funções SQL",
          "Nomes de tabelas JOIN são validados",
        ],
      },
      { type: "heading", text: "Validação de Entrada", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- O módulo de segurança valida:
-- - Nomes de colunas (apenas alfanuméricos + underscore)
-- - LIMIT/OFFSET (inteiros não-negativos)
-- - Direção do ORDER BY (apenas ASC/DESC)
-- - Nomes de tabelas JOIN
-- - Itens SELECT (funções SQL whitelistadas)
-- - Tamanho da query (máx 100KB)
-- - Contagem de parâmetros (máx 1000)`,
      },
      { type: "heading", text: "Citação de Identificadores", level: 3 },
      {
        type: "paragraph",
        text: "Todos os identificadores (nomes de tabelas, nomes de colunas) são citados corretamente:",
      },
      {
        type: "code",
        language: "lua",
        code: `-- PostgreSQL: aspas duplas
"users", "email", "my-table"

-- MySQL/SQLite: backticks
\`users\`, \`email\`, \`my-table\``,
      },
    ],
  },
  {
    id: "migrations",
    title: "Migrations",
    description: "Gerencie as alterações do schema do seu banco de dados.",
    content: [
      {
        type: "paragraph",
        text: "Jade gera automaticamente migrations a partir das alterações do seu schema.",
      },
      { type: "heading", text: "Comandos CLI", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Gerar migration a partir do diff do schema
esmeralda generate

# Executar migrations pendentes
esmeralda migrate

# Reverter última migration
esmeralda migrate rollback

# Visualizar SQL sem executar
esmeralda migrate --preview

# Verificar status das migrations
esmeralda migrate status`,
      },
      { type: "heading", text: "Arquivos de Migration", level: 3 },
      {
        type: "paragraph",
        text: "Os arquivos de migration são armazenados no diretório migrations/:",
      },
      {
        type: "code",
        language: "lua",
        code: `-- migrations/20260715120000_create_users.lua
local jade = require("jade")

local M = {}

function M.up()
    jade.createTable("users", {
        id = jade.Integer():primaryKey(),
        name = jade.String(120):notNull(),
        email = jade.String(255):unique():notNull(),
    })
end

function M.down()
    jade.dropTable("users")
end

return M`,
      },
    ],
  },
  {
    id: "cli",
    title: "CLI (Esmeralda)",
    description: "Ferramentas de linha de comando para Jade.",
    content: [
      {
        type: "paragraph",
        text: "Esmeralda é a ferramenta CLI para Jade. Ela cuida de migrations, geração de schema e operações de banco de dados.",
      },
      { type: "heading", text: "Instalação", level: 3 },
      {
        type: "code",
        code: "npm install -g @alehandrosv/esmeralda-cli",
        language: "bash",
      },
      { type: "heading", text: "Comandos", level: 3 },
      {
        type: "table",
        headers: ["Comando", "Descrição"],
        rows: [
          ["esmeralda init", "Scaffolding de um novo projeto Jade"],
          ["esmeralda generate", "Gerar migration a partir do diff do schema"],
          ["esmeralda migrate", "Executar migrations pendentes"],
          [
            "esmeralda migrate create <name>",
            "Criar arquivo de migration vazio",
          ],
          ["esmeralda migrate rollback", "Reverter últimas N migrations"],
          ["esmeralda migrate status", "Mostrar status das migrations"],
          ["esmeralda db pull", "Introspectar DB → gerar arquivos de entidade"],
          ["esmeralda db push", "Enviar schema diretamente para o DB"],
          ["esmeralda seed", "Executar arquivos de seed"],
        ],
      },
      { type: "heading", text: "Opções", level: 3 },
      {
        type: "table",
        headers: ["Opção", "Descrição"],
        rows: [
          ["--config <path>", "Caminho para jade.config.lua"],
          ["--preview", "Mostrar SQL sem executar"],
          ["--verbose", "Mostrar saída detalhada"],
        ],
      },
    ],
  },
  {
    id: "transactions",
    title: "Transações",
    description: "Encapsule múltiplas operações atomicamente.",
    content: [
      {
        type: "paragraph",
        text: "Encapsule múltiplas operações em uma transação. Se qualquer operação falhar, todas as alterações são revertidas.",
      },
      {
        type: "code",
        language: "lua",
        code: `jade.transaction.run(jade.driver(), function(tx)
  local user = User:create({ name = "Lucas" })
  Post:create({ title = "Hello", author_id = user.id })
end)
-- Auto-commit se não houver erro, rollback se houver erro`,
      },
      { type: "heading", text: "Tratamento de Erros", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local ok, err = pcall(function()
  jade.transaction.run(jade.driver(), function(tx)
    local user = User:create({ name = "Lucas" })
    -- Se isso falhar, o primeiro create é revertido
    Post:create({ title = "Hello", author_id = 999 })
  end)
end)

if not ok then
  print("Transação falhou: " .. tostring(err))
end`,
      },
    ],
  },
  {
    id: "callbacks",
    title: "Callbacks",
    description: "Hooks para eventos do ciclo de vida da entidade.",
    content: [
      {
        type: "paragraph",
        text: "Jade fornece callbacks before/after/around para operações de entidade.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Registrar callbacks em uma entidade
User:beforeCreate(function(instance, data)
  -- Executa antes do INSERT
  data.created_by = currentUser.id
end)

User:afterCreate(function(instance, data)
  -- Executa após o INSERT
  AuditLog:log("Usuário criado: " .. instance.name)
end)

User:beforeUpdate(function(instance, data)
  -- Executa antes do UPDATE
  data.updated_at = os.time()
end)

User:afterDelete(function(instance, data)
  -- Executa após o DELETE
  Cache:invalidate("user:" .. instance.id)
end)

-- Around callbacks (envolvem a operação)
User:aroundSave(function(instance, data, fn)
  -- Executa antes
  local result = fn()  -- Executa a operação
  -- Executa depois
  return result
end)`,
      },
      { type: "heading", text: "Callbacks Disponíveis", level: 3 },
      {
        type: "list",
        items: [
          "beforeCreate, afterCreate",
          "beforeUpdate, afterUpdate",
          "beforeDelete, afterDelete",
          "beforeSave, afterSave",
          "aroundSave, aroundCreate, aroundUpdate, aroundDelete",
        ],
      },
    ],
  },
  {
    id: "validations",
    title: "Validações",
    description: "Valide dados antes de salvar.",
    content: [
      {
        type: "paragraph",
        text: "Jade fornece validações integradas que executam automaticamente antes de operações de create/update.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Definir validações em uma entidade
User:validatePresenceOf("name")
User:validatePresenceOf("email")
User:validateUniquenessOf("email")
User:validateLengthOf("name", { min = 2, max = 120 })
User:validateFormatOf("email", { pattern = "^[%w%.]+@[%w%.]+$" })
User:validateInclusionOf("role", { values = {"admin", "user", "moderator"} })
User:validateNumericalityOf("age", { integer_only = true })

-- Validação customizada
User:validateCustom("email", function(value, data)
  return value:match("@example%.com$") ~= nil
end, "Email deve ser do example.com")`,
      },
      { type: "heading", text: "Escopos de Validação", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Validar apenas em ações específicas
User:validatePresenceOf("password", { on = "create" })
User:validatePresenceOf("current_password", { on = "update" })
User:validatePresenceOf("name", { on = {"create", "update"} })`,
      },
    ],
  },
  {
    id: "soft-delete",
    title: "Soft Delete",
    description: "Marque registros como deletados sem removê-los.",
    content: [
      {
        type: "paragraph",
        text: "Soft delete marca registros como deletados em vez de removê-los. A coluna deleted_at é definida com o timestamp atual.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Habilitar soft delete em uma entidade
local User = jade.Entity("users", {
  id = jade.Integer():primaryKey(),
  name = jade.String(120),
}):softDelete()

-- Delete normal define deleted_at
User:where(User.id:eq(1)):delete()
-- UPDATE users SET deleted_at = NOW() WHERE id = 1

-- Consultar apenas registros não-deletados (padrão)
User:get()
-- SELECT * FROM users WHERE deleted_at IS NULL

-- Incluir registros soft-deletados
User:withTrashed():get()

-- Apenas registros soft-deletados
User:onlyTrashed():get()

-- Force delete (remover de verdade)
User:where(User.id:eq(1)):forceDelete()`,
      },
    ],
  },
  {
    id: "error-codes",
    title: "Códigos de Erro",
    description: "Tratamento de erros estruturado com códigos de erro.",
    content: [
      {
        type: "paragraph",
        text: "Jade usa códigos de erro estruturados para tratamento de erros previsível:",
      },
      {
        type: "code",
        language: "lua",
        code: `local errors = require("jade.errors")

local ok, err = pcall(function()
  User:create({ email = "invalid" })
end)

if not ok then
  print(err.code)      -- J1016
  print(err.message)   -- "Violação de constraint unique"
  print(err:toJSON())  -- { code = "J1016", message = "...", ... }
end`,
      },
      { type: "heading", text: "Faixas de Códigos de Erro", level: 3 },
      {
        type: "table",
        headers: ["Faixa", "Categoria"],
        rows: [
          ["J0xxx", "Erros de conexão"],
          ["J1xxx", "Erros de query"],
          ["J2xxx", "Erros de migration"],
          ["J3xxx", "Erros de introspecção"],
          ["J4xxx", "Erros de integridade"],
          ["J5xxx", "Erros de segurança"],
        ],
      },
    ],
  },
  {
    id: "testing",
    title: "Testes",
    description: "Helpers e utilitários para testes.",
    content: [
      {
        type: "paragraph",
        text: "Jade fornece helpers de teste para escrever testes unitários e de integração.",
      },
      { type: "heading", text: "Configuração", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- No seu helper de teste
local jade = require("jade")
local helpers = require("jade.test.helpers")

-- Configurar banco de dados de teste
jade.configure({
  database = {
    driver = "sqlite",
    database = ":memory:"
  }
})

-- Criar tabelas
helpers.setup({ User, Post, Comment })`,
      },
      { type: "heading", text: "Truncamento", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Truncar todas as tabelas entre testes
helpers.truncateAll()

-- Ou truncar tabelas específicas
helpers.truncate({ "users", "posts" })`,
      },
      { type: "heading", text: "Envolvimento com Transação", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Envolver cada teste em uma transação (auto-rollback)
helpers.transaction(function()
  local user = User:create({ name = "Teste" })
  assert(user.id ~= nil)
  -- A transação é revertida automaticamente
end)`,
      },
    ],
  },
  {
    id: "nested-creates",
    title: "Nested Creates",
    description:
      "Crie registros relacionados inline com connect, create e connectOrCreate.",
    content: [
      {
        type: "paragraph",
        text: "Jade suporta criar registros relacionados inline ao chamar create() ou update(). Em vez de criar cada registro manualmente e vinculá-los com foreign keys, você pode usar instruções aninhadas.",
      },
      {
        type: "heading",
        text: "Connect — Referenciar um registro existente",
        level: 3,
      },
      {
        type: "paragraph",
        text: "Use connect para vincular a um registro existente pelos seus campos únicos:",
      },
      {
        type: "code",
        language: "lua",
        title: "Connect por ID",
        code: `local post = Post:create({
    title = "Meu Primeiro Post",
    user = { connect = { id = 1 } },
})`,
      },
      {
        type: "code",
        language: "lua",
        title: "Connect por campo único",
        code: `local post = Post:create({
    title = "Meu Primeiro Post",
    user = { connect = { email = "alice@exemplo.com" } },
})`,
      },
      {
        type: "code",
        language: "lua",
        title: "Shorthand",
        code: `-- { id = N } é equivalente a { connect = { id = N } }
local post = Post:create({
    title = "Meu Primeiro Post",
    user = { id = 1 },
})`,
      },
      {
        type: "heading",
        text: "Create — Criar um novo registro relacionado",
        level: 3,
      },
      {
        type: "paragraph",
        text: "Use create para criar um novo registro relacionado inline. O pai e o filho são criados juntos:",
      },
      {
        type: "code",
        language: "lua",
        title: "Create com novo usuário",
        code: `local post = Post:create({
    title = "Meu Primeiro Post",
    user = {
        create = { name = "Alice", email = "alice@exemplo.com" },
    },
})`,
      },
      {
        type: "heading",
        text: "ConnectOrCreate — Encontrar ou criar",
        level: 3,
      },
      {
        type: "paragraph",
        text: "Use connectOrCreate para encontrar um registro existente que corresponda ao where, ou criá-lo se não for encontrado:",
      },
      {
        type: "code",
        language: "lua",
        title: "Connect ou create",
        code: `local post = Post:create({
    title = "Meu Primeiro Post",
    user = {
        connectOrCreate = {
            where = { email = "alice@exemplo.com" },
            create = { name = "Alice", email = "alice@exemplo.com" },
        },
    },
})`,
      },
      { type: "heading", text: "HasMany — Criar múltiplos filhos", level: 3 },
      {
        type: "paragraph",
        text: "Para relações hasMany, passe um array de operações para criar múltiplos registros filhos de uma vez:",
      },
      {
        type: "code",
        language: "lua",
        title: "Criar usuário com posts",
        code: `local user = User:create({
    name = "Alice",
    email = "alice@exemplo.com",
    posts = {
        { create = { title = "Primeiro Post" } },
        { create = { title = "Segundo Post" } },
        { create = { title = "Terceiro Post" } },
    },
})`,
      },
      { type: "heading", text: "Update com relações aninhadas", level: 3 },
      {
        type: "paragraph",
        text: "Relações aninhadas também funcionam com update(). Você pode alterar para qual registro uma relação aponta:",
      },
      {
        type: "code",
        language: "lua",
        title: "Reatribuir post para outro usuário",
        code: `local post = Post:find(1)
post:update({
    title = "Título Atualizado",
    user = { connect = { id = 2 } },
})`,
      },
      { type: "heading", text: "Métodos do Proxy", level: 3 },
      {
        type: "paragraph",
        text: "Após carregar uma relação, você pode usar métodos do proxy para criar, conectar ou desconectar registros relacionados:",
      },
      {
        type: "code",
        language: "lua",
        title: "Proxy create, connect, disconnect",
        code: `local user = User:find(1)

-- Criar um post para este usuário
user.posts:create({ title = "Novo Post" })

-- Conectar um post existente
user.posts:connect(5)

-- Desconectar um post
user.posts:disconnect(5)`,
      },
      {
        type: "callout",
        variant: "info",
        text: "Ordem de execução: relações belongsTo são resolvidas primeiro (para obter o FK), depois o registro principal é criado, e por último os filhos hasMany/hasOne/hasAndBelongsToMany.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Se um nested create falhar na validação, toda a operação é revertida. Nenhum dado parcial é salvo.",
      },
    ],
  },
  {
    id: "linter",
    title: "Linter (VS Code)",
    description:
      "Suporte a IDE, validação em tempo real e detecção automática de relacionamentos para arquivos de schema Jade.",
    content: [
      {
        type: "paragraph",
        text: "O Jade tem uma extensão oficial do VS Code que fornece validação de schema em tempo real, auto-completion e detecção automática de relacionamentos. Funciona com qualquer arquivo .lua contendo código de schema Jade.",
      },
      { type: "heading", text: "Instalação", level: 3 },
      {
        type: "list",
        items: [
          "Abra o VS Code",
          "Pressione Ctrl+Shift+X para abrir Extensões",
          'Pesquise "Jade Linter"',
          "Clique em Instalar",
        ],
      },
      { type: "heading", text: "Funcionalidades", level: 3 },
      {
        type: "list",
        items: [
          "**Syntax Highlighting** — Tipos e modificadores Jade destacados em arquivos .lua",
          "**Auto-Completion** — Sugestões para tipos (jade.), modificadores (:primaryKey(), :foreignKey()), nomes de tabelas e modelos",
          "**Linting** — Detecção de erros em tempo real para tipos inválidos, modificadores ausentes e referências quebradas",
          "**Detecção Automática de Relações** — Infere relações belongsTo a partir de :foreignKey() e convenções de nomenclatura _id",
          "**Hover** — Documentação ao passar o mouse sobre tipos, modificadores, relações e campos FK",
          "**Validação Cross-File** — Valida referências entre todos os arquivos de schema no workspace",
          "**Formatação** — Formatação automática de arquivos de schema ao salvar",
        ],
      },
      { type: "heading", text: "Detecção Automática de Relações", level: 3 },
      {
        type: "paragraph",
        text: "O linter detecta automaticamente relacionamentos entre entidades de duas formas:",
      },
      {
        type: "heading",
        text: "Modificador :foreignKey() explícito",
        level: 4,
      },
      {
        type: "paragraph",
        text: 'Quando um campo tem :foreignKey("table", "column"), o linter infere uma relação belongsTo:',
      },
      {
        type: "code",
        language: "lua",
        title: "foreignKey explícito",
        code: `local jade = require("jade")

local User = jade.Entity("users", {
    id = jade.Integer():primaryKey(),
    name = jade.String(120):notNull(),
})

local Post = jade.Entity("posts", {
    id = jade.Integer():primaryKey(),
    title = jade.String(255):notNull(),
    user_id = jade.Integer():foreignKey("users", "id"),
    -- Linter infere: Post belongsTo User (via user_id)
})`,
      },
      { type: "heading", text: "Convenção de nomenclatura _id", level: 4 },
      {
        type: "paragraph",
        text: "Quando um campo termina com _id e a tabela alvo existe no schema, o linter infere belongsTo automaticamente:",
      },
      {
        type: "code",
        language: "lua",
        title: "Detecção por convenção",
        code: `local User = jade.Entity("users", {
    id = jade.Integer():primaryKey(),
})

local Post = jade.Entity("posts", {
    id = jade.Integer():primaryKey(),
    user_id = jade.Integer():notNull(),
    -- Linter infere: Post belongsTo User
    -- (pois a tabela "users" existe no schema)
})`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "Tipos FK suportados: Integer, BigInt, UUID, CUID, NanoID. O linter verifica se a tabela alvo existe antes de inferir a relação.",
      },
      { type: "heading", text: "Diagnósticos", level: 3 },
      {
        type: "table",
        headers: ["Nível", "Exemplo"],
        rows: [
          [
            "Erro",
            "Tipo inválido (jade.Foo()), modificador desconhecido (:bar()), referência a model inexistente",
          ],
          ["Aviso", "String sem tamanho, created_at sem defaultNow()"],
          [
            "Informação",
            "Primary key automática em id, relação belongsTo inferida",
          ],
        ],
      },
      { type: "heading", text: "Hover", level: 3 },
      {
        type: "paragraph",
        text: "Ao passar o mouse sobre tipos, mostra o equivalente SQL e os modificadores disponíveis. Ao passar sobre um campo *_id, mostra a relação inferida:",
      },
      {
        type: "code",
        language: "text",
        title: "Hover em campo FK",
        code: `**user_id** (ForeignKey)
Infere: belongsTo → User`,
      },
      { type: "heading", text: "Configuração", level: 3 },
      {
        type: "table",
        headers: ["Setting", "Padrão", "Descrição"],
        rows: [
          [
            "jade.schema.path",
            "schema/init.lua",
            "Caminho para o arquivo de schema",
          ],
          ["jade.linting.enabled", "true", "Habilitar linting"],
          ["jade.completion.enabled", "true", "Habilitar auto-completion"],
          ["jade.formatting.enabled", "true", "Habilitar formatação"],
          ["jade.formatting.formatOnSave", "false", "Formatar ao salvar"],
        ],
      },
    ],
  },
];
