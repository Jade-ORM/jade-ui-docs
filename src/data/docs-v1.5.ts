export type DocContent =
  | { type: "paragraph"; text: string }
  | { type: "html"; html: string }
  | { type: "heading"; text: string; level: 2 | 3 | 4 }
  | { type: "code"; code: string; language: string; title?: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; variant: "info" | "warning" | "tip"; text: string }
  | { type: "link"; text: string; href: string };

export interface DocSection {
  id: string;
  title: string;
  description?: string;
  content: DocContent[];
}

export const docsSectionsV1_5: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    description: "What is Jade and why you should use it.",
    content: [
      {
        type: "paragraph",
        text: "Jade is a Lua ORM that maps your database tables to Lua objects. You define your schema in code, and Jade handles migrations, queries, and data validation.",
      },
      {
        type: "paragraph",
        text: "Unlike some ORMs, Jade doesn't hide SQL. Every query is transparent. You can always see what's being executed against your database.",
      },
      { type: "heading", text: "Design Principles", level: 3 },
      {
        type: "list",
        items: [
          "**Schema is truth.** Your database structure is defined in Lua code.",
          "**SQL is visible.** Every operation can be audited.",
          "**Migrations are deterministic.** No surprise schema changes.",
          "**You have control.** No magic, no hidden behavior.",
        ],
      },
    ],
  },
  {
    id: "installation",
    title: "Installation",
    description: "How to install Jade and its requirements.",
    content: [
      { type: "heading", text: "Via LuaRocks", level: 3 },
      { type: "code", code: "luarocks install jade", language: "bash" },
      { type: "heading", text: "Requirements", level: 3 },
      {
        type: "list",
        items: [
          "Lua 5.1, 5.2, 5.3, 5.4, or LuaJIT",
          "PostgreSQL (via luapgsql or pgmoon)",
          "MySQL (via luasql-mysql)",
          "SQLite (via luasql-sqlite3)",
        ],
      },
      { type: "heading", text: "Install Esmeralda CLI", level: 3 },
      {
        type: "code",
        code: "npm install -g @alehandrosv/esmeralda-cli",
        language: "bash",
      },
      {
        type: "callout",
        variant: "tip",
        text: "The CLI is optional but recommended for migrations and schema management.",
      },
    ],
  },
  {
    id: "quick-start",
    title: "Quick Start",
    description: "Get up and running with Jade in 3 steps.",
    content: [
      { type: "heading", text: "1. Configure the Database", level: 3 },
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
      { type: "heading", text: "2. Define an Entity", level: 3 },
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
      { type: "heading", text: "3. Use CRUD Operations", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Create
local user = User:create({ name = "Lucas", email = "lucas@email.com" })

-- Read (polymorphic)
local user = User:find(1)                                    -- by ID
local users = User:find({ where = { active = true } })      -- with conditions
local admin = User:findFirst({ where = { role = "admin" } }) -- find first

-- Update (polymorphic)
User:update(1, { name = "New Name" })                        -- by ID
User:update({ where = { role = "user" }, data = { role = "admin" } }) -- with conditions

-- Delete (polymorphic)
User:delete(1)                                               -- by ID
User:delete({ where = { active = false } })                  -- with conditions`,
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    description: "All configuration options for Jade.",
    content: [
      { type: "heading", text: "Basic Configuration", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `jade.configure({
  database = {
    driver = "postgresql",  -- "postgresql", "mysql", or "sqlite"
    host = "localhost",
    port = 5432,
    database = "myapp",
    user = "postgres",
    password = "secret"
  }
})`,
      },
      { type: "heading", text: "Using a URL", level: 3 },
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
      { type: "heading", text: "Environment Config", level: 3 },
      {
        type: "paragraph",
        text: "Jade supports environment-specific configuration files:",
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
        text: 'Set the JADE_ENV environment variable to select the config file. Defaults to "development".',
      },
    ],
  },
  {
    id: "schema",
    title: "Schema Overview",
    description: "How to define your database schema with Jade.",
    content: [
      {
        type: "paragraph",
        text: "Jade uses a declarative schema system. You define entities with their columns and types, and Jade handles the rest.",
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
      { type: "heading", text: "Entity Options", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Custom table name
local User = jade.Entity("app_users", { ... })

-- With database assignment
local Log = jade.Entity("logs", {}, { database = "analytics" })

-- With soft delete
local User = jade.Entity("users", { ... }):softDelete()`,
      },
    ],
  },
  {
    id: "column-types",
    title: "Column Types",
    description: "All available column types in Jade.",
    content: [
      {
        type: "table",
        headers: ["Type", "Lua", "PostgreSQL", "MySQL", "SQLite"],
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
    title: "Column Modifiers",
    description: "Modifiers you can chain on column types.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `jade.Integer():primaryKey()     -- PRIMARY KEY
jade.String():unique()          -- UNIQUE
jade.String():notNull()         -- NOT NULL
jade.Boolean():default(true)    -- DEFAULT true
jade.Timestamp():defaultNow()   -- DEFAULT CURRENT_TIMESTAMP
jade.String():encrypted()       -- Encrypted column`,
      },
      { type: "heading", text: "Encryption Modifier", level: 3 },
      {
        type: "paragraph",
        text: "The :encrypted() modifier marks a column for encryption. Requires Jade.Encryption.configure() to be called first.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Configure encryption first
jade.Encryption.configure({ key = "secret-key" })

-- Then use :encrypted() on columns
local User = jade.Entity("users", {
  email = jade.String(255):encrypted(),
  ssn = jade.String(11):encrypted(),
})`,
      },
      {
        type: "link",
        text: "Learn more about Encryption →",
        href: "/docs/encryption",
      },
    ],
  },
  {
    id: "relations",
    title: "Relations",
    description: "Define relationships between entities.",
    content: [
      { type: "heading", text: "Relation Types", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- belongsTo (foreign key on this entity)
Post:belongsTo(User)

-- hasOne (foreign key on the other entity)
User:hasOne(Profile)

-- hasMany (foreign key on the other entity)
User:hasMany(Post)

-- hasAndBelongsToMany (pivot table)
User:hasAndBelongsToMany(Tag)

-- hasManyThrough (via intermediate entity)
User:hasAndBelongsToMany(Post, Comment)`,
      },
      { type: "heading", text: "Eager Loading", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Load posts with their author
local posts = Post:include("author"):get()

-- Multiple relations
local users = User:include("posts"):include("profile"):get()`,
      },
      { type: "heading", text: "Lazy Loading", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local user = User:find(1)
local posts = user.posts:load()  -- Loads on demand`,
      },
    ],
  },
  {
    id: "query-builder",
    title: "Query Builder",
    description: "Build queries with a chainable API.",
    content: [
      { type: "heading", text: "Where Conditions", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Simple conditions
User:where(User.age:eq(18)):get()
User:where(User.name:like("%Lucas%")):get()

-- Multiple conditions (AND)
User:where(User.age:gt(18)):where(User.active:eq(true)):get()

-- Using operators
User:where(User.age:gt(18)):get()
User:where(User.age:ge(18)):where(User.age:le(65)):get()`,
      },
      { type: "heading", text: "Ordering, Limit, Offset", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `User:orderBy(User.name):get()
User:orderBy(User.name, "DESC"):get()
User:limit(10):offset(20):get()`,
      },
      { type: "heading", text: "Aggregates", level: 3 },
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
      { type: "heading", text: "Pagination", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local page = User:paginate({ page = 2, perPage = 20 })
-- Returns: { items = {...}, total = 100, page = 2, perPage = 20, lastPage = 5 }`,
      },
    ],
  },
  {
    id: "encryption",
    title: "Encryption",
    description: "Encrypt sensitive data in your database.",
    content: [
      {
        type: "paragraph",
        text: "Jade supports two encryption modes: database-native (recommended for production) and custom (for user-provided logic).",
      },
      { type: "heading", text: "Database-Native Encryption (AES)", level: 3 },
      {
        type: "paragraph",
        text: "Uses the database's built-in encryption functions. Requires PostgreSQL with pgcrypto extension or MySQL.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Configure encryption with a secret key
jade.Encryption.configure({ key = "my-secret-key" })

-- PostgreSQL: install pgcrypto extension first
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Mark columns as encrypted
local User = jade.Entity("users", {
  id = jade.Integer():primaryKey(),
  name = jade.String(120),
  email = jade.String(255):encrypted(),
  ssn = jade.String(11):encrypted(),
})

-- Values are encrypted in the database (not in Lua)
-- PostgreSQL: pgp_sym_encrypt/column, key
-- MySQL: AES_ENCRYPT(column, key)
-- Decryption happens automatically on SELECT`,
      },
      {
        type: "heading",
        text: "Custom Encryption (User-Provided Functions)",
        level: 3,
      },
      { type: "heading", text: "Option 1: Inline Functions", level: 4 },
      {
        type: "code",
        language: "lua",
        code: `jade.Encryption.configure({
  key = "my-secret-key",
  algorithm = "custom",
  encrypt_fn = function(value, key)
    -- your encryption logic here
    return encrypted_value
  end,
  decrypt_fn = function(encrypted, key)
    -- your decryption logic here
    return original_value
  end,
})`,
      },
      { type: "heading", text: "Option 2: Separate Files", level: 4 },
      {
        type: "code",
        language: "lua",
        code: `jade.Encryption.configure({
  key = "my-secret-key",
  algorithm = "custom",
  encrypt_file = "encryption/encrypt.lua",
  decrypt_file = "encryption/decrypt.lua",
})`,
      },
      {
        type: "paragraph",
        text: "The encryption files must return a function:",
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
      { type: "heading", text: "Configuration Options", level: 3 },
      {
        type: "table",
        headers: ["Option", "Type", "Description"],
        rows: [
          ["key", "string", "Encryption key (required)"],
          [
            "algorithm",
            '"aes" | "custom"',
            '"aes" for DB-native, "custom" for Lua functions',
          ],
          [
            "database_encrypted",
            "boolean",
            "Encrypt ALL columns in ALL entities",
          ],
          ["fields", "table", "Encrypt specific fields per entity"],
          ["encrypt_fn", "function", "Custom encrypt function (inline)"],
          ["decrypt_fn", "function", "Custom decrypt function (inline)"],
          ["encrypt_file", "string", "Custom encrypt function (from file)"],
          ["decrypt_file", "string", "Custom decrypt function (from file)"],
        ],
      },
    ],
  },
  {
    id: "security",
    title: "Security Features",
    description: "Built-in security protections.",
    content: [
      {
        type: "paragraph",
        text: "Jade includes several security features to protect your application from common vulnerabilities.",
      },
      { type: "heading", text: "SQL Injection Protection", level: 3 },
      {
        type: "list",
        items: [
          "All column and table names are quoted with identifier escaping",
          "Parameterized queries with bind parameters (?)",
          "Input validation for column names, LIMIT, OFFSET, ORDER BY",
          "SELECT items are validated against a whitelist of SQL functions",
          "JOIN table names are validated",
        ],
      },
      { type: "heading", text: "Input Validation", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Security module validates:
-- - Column names (alphanumeric + underscore only)
-- - LIMIT/OFFSET (non-negative integers)
-- - ORDER BY direction (ASC/DESC only)
-- - JOIN table names
-- - SELECT items (whitelisted SQL functions)
-- - Query length (max 100KB)
-- - Parameter count (max 1000)`,
      },
      { type: "heading", text: "Identifier Quoting", level: 3 },
      {
        type: "paragraph",
        text: "All identifiers (table names, column names) are properly quoted:",
      },
      {
        type: "code",
        language: "lua",
        code: `-- PostgreSQL: double quotes
"users", "email", "my-table"

-- MySQL/SQLite: backticks
\`users\`, \`email\`, \`my-table\``,
      },
    ],
  },
  {
    id: "migrations",
    title: "Migrations",
    description: "Manage your database schema changes.",
    content: [
      {
        type: "paragraph",
        text: "Jade automatically generates migrations from your schema changes.",
      },
      { type: "heading", text: "CLI Commands", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Generate migration from schema diff
esmeralda generate

# Run pending migrations
esmeralda migrate

# Rollback last migration
esmeralda migrate rollback

# Preview SQL without executing
esmeralda migrate --preview

# Check migration status
esmeralda migrate status`,
      },
      { type: "heading", text: "Migration Files", level: 3 },
      {
        type: "paragraph",
        text: "Migration files are stored in the migrations/ directory:",
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
    description: "Command-line tools for Jade.",
    content: [
      {
        type: "paragraph",
        text: "Esmeralda is the CLI tool for Jade. It handles migrations, schema generation, and database operations.",
      },
      { type: "heading", text: "Installation", level: 3 },
      {
        type: "code",
        code: "npm install -g @alehandrosv/esmeralda-cli",
        language: "bash",
      },
      { type: "heading", text: "Commands", level: 3 },
      {
        type: "table",
        headers: ["Command", "Description"],
        rows: [
          ["esmeralda init", "Scaffold a new Jade project"],
          ["esmeralda generate", "Generate migration from schema diff"],
          ["esmeralda migrate", "Run pending migrations"],
          ["esmeralda migrate create <name>", "Create empty migration file"],
          ["esmeralda migrate rollback", "Rollback last N migrations"],
          ["esmeralda migrate status", "Show migration status"],
          ["esmeralda db pull", "Introspect DB → generate entity files"],
          ["esmeralda db push", "Push schema directly to DB"],
          ["esmeralda seed", "Run seed files"],
        ],
      },
      { type: "heading", text: "Options", level: 3 },
      {
        type: "table",
        headers: ["Option", "Description"],
        rows: [
          ["--config <path>", "Path to jade.config.lua"],
          ["--preview", "Show SQL without executing"],
          ["--verbose", "Show detailed output"],
        ],
      },
    ],
  },
  {
    id: "transactions",
    title: "Transactions",
    description: "Wrap multiple operations atomically.",
    content: [
      {
        type: "paragraph",
        text: "Wrap multiple operations in a transaction. If any operation fails, all changes are rolled back.",
      },
      {
        type: "code",
        language: "lua",
        code: `jade.transaction.run(jade.driver(), function(tx)
  local user = User:create({ name = "Lucas" })
  Post:create({ title = "Hello", author_id = user.id })
end)
-- Auto-commit if no error, rollback if error`,
      },
      { type: "heading", text: "Error Handling", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local ok, err = pcall(function()
  jade.transaction.run(jade.driver(), function(tx)
    local user = User:create({ name = "Lucas" })
    -- If this fails, the first create is rolled back
    Post:create({ title = "Hello", author_id = 999 })
  end)
end)

if not ok then
  print("Transaction failed: " .. tostring(err))
end`,
      },
    ],
  },
  {
    id: "callbacks",
    title: "Callbacks",
    description: "Hooks for entity lifecycle events.",
    content: [
      {
        type: "paragraph",
        text: "Jade provides before/after/around callbacks for entity operations.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Register callbacks on an entity
User:beforeCreate(function(instance, data)
  -- Runs before INSERT
  data.created_by = currentUser.id
end)

User:afterCreate(function(instance, data)
  -- Runs after INSERT
  AuditLog:log("User created: " .. instance.name)
end)

User:beforeUpdate(function(instance, data)
  -- Runs before UPDATE
  data.updated_at = os.time()
end)

User:afterDelete(function(instance, data)
  -- Runs after DELETE
  Cache:invalidate("user:" .. instance.id)
end)

-- Around callbacks (wrap the operation)
User:aroundSave(function(instance, data, fn)
  -- Runs before
  local result = fn()  -- Execute the operation
  -- Runs after
  return result
end)`,
      },
      { type: "heading", text: "Available Callbacks", level: 3 },
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
    title: "Validations",
    description: "Validate data before saving.",
    content: [
      {
        type: "paragraph",
        text: "Jade provides built-in validations that run automatically before create/update operations.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Define validations on an entity
User:validatePresenceOf("name")
User:validatePresenceOf("email")
User:validateUniquenessOf("email")
User:validateLengthOf("name", { min = 2, max = 120 })
User:validateFormatOf("email", { pattern = "^[%w%.]+@[%w%.]+$" })
User:validateInclusionOf("role", { values = {"admin", "user", "moderator"} })
User:validateNumericalityOf("age", { integer_only = true })

-- Custom validation
User:validateCustom("email", function(value, data)
  return value:match("@example%.com$") ~= nil
end, "Email must be from example.com")`,
      },
      { type: "heading", text: "Validation Scopes", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Only validate on specific actions
User:validatePresenceOf("password", { on = "create" })
User:validatePresenceOf("current_password", { on = "update" })
User:validatePresenceOf("name", { on = {"create", "update"} })`,
      },
    ],
  },
  {
    id: "soft-delete",
    title: "Soft Delete",
    description: "Mark records as deleted without removing them.",
    content: [
      {
        type: "paragraph",
        text: "Soft delete marks records as deleted instead of removing them. The deleted_at column is set to the current timestamp.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Enable soft delete on an entity
local User = jade.Entity("users", {
  id = jade.Integer():primaryKey(),
  name = jade.String(120),
}):softDelete()

-- Normal delete sets deleted_at
User:where(User.id:eq(1)):delete()
-- UPDATE users SET deleted_at = NOW() WHERE id = 1

-- Query only non-deleted records (default)
User:get()
-- SELECT * FROM users WHERE deleted_at IS NULL

-- Include soft-deleted records
User:withTrashed():get()

-- Only soft-deleted records
User:onlyTrashed():get()

-- Force delete (actually remove)
User:where(User.id:eq(1)):forceDelete()`,
      },
    ],
  },
  {
    id: "error-codes",
    title: "Error Codes",
    description: "Structured error handling with error codes.",
    content: [
      {
        type: "paragraph",
        text: "Jade uses structured error codes for predictable error handling:",
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
  print(err.message)   -- "Unique constraint violation"
  print(err:toJSON())  -- { code = "J1016", message = "...", ... }
end`,
      },
      { type: "heading", text: "Error Code Ranges", level: 3 },
      {
        type: "table",
        headers: ["Range", "Category"],
        rows: [
          ["J0xxx", "Connection errors"],
          ["J1xxx", "Query errors"],
          ["J2xxx", "Migration errors"],
          ["J3xxx", "Introspection errors"],
          ["J4xxx", "Integrity errors"],
          ["J5xxx", "Security errors"],
        ],
      },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    description: "Test helpers and utilities.",
    content: [
      {
        type: "paragraph",
        text: "Jade provides test helpers for writing unit and integration tests.",
      },
      { type: "heading", text: "Setup", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- In your test helper
local jade = require("jade")
local helpers = require("jade.test.helpers")

-- Configure test database
jade.configure({
  database = {
    driver = "sqlite",
    database = ":memory:"
  }
})

-- Create tables
helpers.setup({ User, Post, Comment })`,
      },
      { type: "heading", text: "Truncation", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Truncate all tables between tests
helpers.truncateAll()

-- Or truncate specific tables
helpers.truncate({ "users", "posts" })`,
      },
      { type: "heading", text: "Transaction Wrapping", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Wrap each test in a transaction (auto-rollback)
helpers.transaction(function()
  local user = User:create({ name = "Test" })
  assert(user.id ~= nil)
  -- Transaction is rolled back automatically
end)`,
      },
    ],
  },
  {
    id: "nested-creates",
    title: "Nested Creates",
    description:
      "Create related records inline with connect, create, and connectOrCreate.",
    content: [
      {
        type: "paragraph",
        text: "Jade supports creating related records inline when calling create() or update(). Instead of manually creating each record and linking them with foreign keys, you can use nested instructions.",
      },
      {
        type: "heading",
        text: "Connect — Reference an existing record",
        level: 3,
      },
      {
        type: "paragraph",
        text: "Use connect to link to an existing record by its unique fields:",
      },
      {
        type: "code",
        language: "lua",
        title: "Connect by ID",
        code: `local post = Post:create({
    title = "My First Post",
    user = { connect = { id = 1 } },
})`,
      },
      {
        type: "code",
        language: "lua",
        title: "Connect by unique field",
        code: `local post = Post:create({
    title = "My First Post",
    user = { connect = { email = "alice@example.com" } },
})`,
      },
      {
        type: "code",
        language: "lua",
        title: "Shorthand",
        code: `-- { id = N } is equivalent to { connect = { id = N } }
local post = Post:create({
    title = "My First Post",
    user = { id = 1 },
})`,
      },
      {
        type: "heading",
        text: "Create — Create a new related record",
        level: 3,
      },
      {
        type: "paragraph",
        text: "Use create to create a new related record inline. The parent and child are created together:",
      },
      {
        type: "code",
        language: "lua",
        title: "Create with new user",
        code: `local post = Post:create({
    title = "My First Post",
    user = {
        create = { name = "Alice", email = "alice@example.com" },
    },
})`,
      },
      { type: "heading", text: "ConnectOrCreate — Find or create", level: 3 },
      {
        type: "paragraph",
        text: "Use connectOrCreate to find an existing record matching the where clause, or create it if not found:",
      },
      {
        type: "code",
        language: "lua",
        title: "Connect or create",
        code: `local post = Post:create({
    title = "My First Post",
    user = {
        connectOrCreate = {
            where = { email = "alice@example.com" },
            create = { name = "Alice", email = "alice@example.com" },
        },
    },
})`,
      },
      { type: "heading", text: "HasMany — Create multiple children", level: 3 },
      {
        type: "paragraph",
        text: "For hasMany relations, pass an array of operations to create multiple child records at once:",
      },
      {
        type: "code",
        language: "lua",
        title: "Create user with posts",
        code: `local user = User:create({
    name = "Alice",
    email = "alice@example.com",
    posts = {
        { create = { title = "First Post" } },
        { create = { title = "Second Post" } },
        { create = { title = "Third Post" } },
    },
})`,
      },
      { type: "heading", text: "Update with nested relations", level: 3 },
      {
        type: "paragraph",
        text: "Nested relations also work with update(). You can change which record a relation points to:",
      },
      {
        type: "code",
        language: "lua",
        title: "Reassign post to another user",
        code: `local post = Post:find(1)
post:update({
    title = "Updated Title",
    user = { connect = { id = 2 } },
})`,
      },
      { type: "heading", text: "Proxy methods", level: 3 },
      {
        type: "paragraph",
        text: "After loading a relation, you can use proxy methods to create, connect, or disconnect related records:",
      },
      {
        type: "code",
        language: "lua",
        title: "Proxy create, connect, disconnect",
        code: `local user = User:find(1)

-- Create a post for this user
user.posts:create({ title = "New Post" })

-- Connect an existing post
user.posts:connect(5)

-- Disconnect a post
user.posts:disconnect(5)`,
      },
      {
        type: "callout",
        variant: "info",
        text: "Execution order: belongsTo relations are resolved first (to get the FK), then the main record is created, then hasMany/hasOne/hasAndBelongsToMany children.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "If a nested create fails validation, the entire operation is rolled back. No partial data is saved.",
      },
    ],
  },
  {
    id: "linter",
    title: "Linter (VS Code)",
    description:
      "IDE support, real-time validation, and auto-relation detection for Jade schema files.",
    content: [
      {
        type: "paragraph",
        text: "Jade has an official VS Code extension that provides real-time schema validation, auto-completion, and automatic relation detection. It works with any .lua file containing Jade schema code.",
      },
      { type: "heading", text: "Installation", level: 3 },
      {
        type: "list",
        items: [
          "Open VS Code",
          "Press Ctrl+Shift+X to open Extensions",
          'Search for "Jade Linter"',
          "Click Install",
        ],
      },
      { type: "heading", text: "Features", level: 3 },
      {
        type: "list",
        items: [
          "**Syntax Highlighting** — Jade types and modifiers highlighted in .lua files",
          "**Auto-Completion** — Suggestions for types (jade.), modifiers (:primaryKey(), :foreignKey()), table names, and model names",
          "**Linting** — Real-time error detection for invalid types, missing modifiers, and broken references",
          "**Auto-Relation Detection** — Infers belongsTo relations from :foreignKey() and _id naming conventions",
          "**Hover** — Documentation on hover for types, modifiers, relations, and FK fields",
          "**Cross-File Validation** — Validates references across all schema files in the workspace",
          "**Formatting** — Auto-format schema files on save",
        ],
      },
      { type: "heading", text: "Auto-Relation Detection", level: 3 },
      {
        type: "paragraph",
        text: "The linter automatically detects relationships between entities in two ways:",
      },
      { type: "heading", text: "Explicit :foreignKey() modifier", level: 4 },
      {
        type: "paragraph",
        text: 'When a field has :foreignKey("table", "column"), the linter infers a belongsTo relation:',
      },
      {
        type: "code",
        language: "lua",
        title: "Explicit foreignKey",
        code: `local jade = require("jade")

local User = jade.Entity("users", {
    id = jade.Integer():primaryKey(),
    name = jade.String(120):notNull(),
})

local Post = jade.Entity("posts", {
    id = jade.Integer():primaryKey(),
    title = jade.String(255):notNull(),
    user_id = jade.Integer():foreignKey("users", "id"),
    -- Linter infers: Post belongsTo User (via user_id)
})`,
      },
      { type: "heading", text: "_id naming convention", level: 4 },
      {
        type: "paragraph",
        text: "When a field ends with _id and the target table exists in the schema, the linter infers belongsTo automatically:",
      },
      {
        type: "code",
        language: "lua",
        title: "Convention-based detection",
        code: `local User = jade.Entity("users", {
    id = jade.Integer():primaryKey(),
})

local Post = jade.Entity("posts", {
    id = jade.Integer():primaryKey(),
    user_id = jade.Integer():notNull(),
    -- Linter infers: Post belongsTo User
    -- (because "users" table exists in the schema)
})`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "Supported FK types: Integer, BigInt, UUID, CUID, NanoID. The linter checks if the target table exists before inferring the relation.",
      },
      { type: "heading", text: "Diagnostics", level: 3 },
      {
        type: "table",
        headers: ["Level", "Example"],
        rows: [
          [
            "Error",
            "Invalid type (jade.Foo()), unknown modifier (:bar()), missing model reference",
          ],
          ["Warning", "String without length, created_at without defaultNow()"],
          [
            "Information",
            "Auto primary key on id, inferred belongsTo relation",
          ],
        ],
      },
      { type: "heading", text: "Hover", level: 3 },
      {
        type: "paragraph",
        text: "Hovering over types shows the SQL equivalent and available modifiers. Hovering over a *_id field shows the inferred relation:",
      },
      {
        type: "code",
        language: "text",
        title: "Hover on FK field",
        code: `**user_id** (ForeignKey)
Infers: belongsTo → User`,
      },
      { type: "heading", text: "Configuration", level: 3 },
      {
        type: "table",
        headers: ["Setting", "Default", "Description"],
        rows: [
          ["jade.schema.path", "schema/init.lua", "Path to schema file"],
          ["jade.linting.enabled", "true", "Enable linting"],
          ["jade.completion.enabled", "true", "Enable auto-completion"],
          ["jade.formatting.enabled", "true", "Enable formatting"],
          ["jade.formatting.formatOnSave", "false", "Format on save"],
        ],
      },
    ],
  },
];
