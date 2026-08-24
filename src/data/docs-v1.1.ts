import type { DocSection } from "./docs-v1.3";

export const docsSectionsV1_1: DocSection[] = [
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

-- Read
local user = User:find(1)
local users = User:where(User.active:eq(true)):get()

-- Update
User:update(1, { name = "New Name" })

-- Delete
User:delete(1)`,
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
User:hasAndBelongsToMany(Tag)`,
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
User:where(User.age:gt(18)):where(User.active:eq(true)):get()`,
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
User:average("age")`,
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
        text: "Jade supports database-native encryption (PostgreSQL pgcrypto, MySQL AES_ENCRYPT) and custom encryption with user-provided functions.",
      },
      { type: "heading", text: "Database-Native Encryption", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Configure encryption
jade.Encryption.configure({ key = "my-secret-key" })

-- Mark columns as encrypted
local User = jade.Entity("users", {
  email = jade.String(255):encrypted(),
  ssn = jade.String(11):encrypted(),
})`,
      },
      { type: "heading", text: "Custom Encryption", level: 3 },
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
    ],
  },
  {
    id: "security",
    title: "Security Features",
    description: "Built-in security protections.",
    content: [
      {
        type: "paragraph",
        text: "Jade includes SQL injection protection, input validation, and parameterized queries.",
      },
      { type: "heading", text: "SQL Injection Protection", level: 3 },
      {
        type: "list",
        items: [
          "All identifiers are properly quoted",
          "Parameterized queries with bind parameters",
          "Input validation for column names, LIMIT, OFFSET, ORDER BY",
          "SELECT items validated against whitelist",
        ],
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
        code: `esmeralda generate
esmeralda migrate
esmeralda migrate rollback
esmeralda migrate --preview
esmeralda migrate status`,
      },
    ],
  },
  {
    id: "cli",
    title: "CLI (Esmeralda)",
    description: "Command-line tools for Jade.",
    content: [
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
          ["esmeralda db pull", "Introspect DB and generate entity files"],
          ["esmeralda db push", "Push schema directly to DB"],
          ["esmeralda seed", "Run seed files"],
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
        type: "code",
        language: "lua",
        code: `jade.transaction.run(jade.driver(), function(tx)
  local user = User:create({ name = "Lucas" })
  Post:create({ title = "Hello", author_id = user.id })
end)`,
      },
    ],
  },
  {
    id: "callbacks",
    title: "Callbacks",
    description: "Hooks for entity lifecycle events.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `User:beforeCreate(function(instance, data)
  data.created_by = currentUser.id
end)

User:afterCreate(function(instance, data)
  AuditLog:log("User created: " .. instance.name)
end)`,
      },
    ],
  },
  {
    id: "validations",
    title: "Validations",
    description: "Validate data before saving.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `User:validatePresenceOf("name")
User:validatePresenceOf("email")
User:validateUniquenessOf("email")
User:validateLengthOf("name", { min = 2, max = 120 })
User:validateFormatOf("email", { pattern = "^[%w%.]+@[%w%.]+$" })
User:validateInclusionOf("role", { values = {"admin", "user"} })
User:validateNumericalityOf("age", { integer_only = true })`,
      },
    ],
  },
  {
    id: "soft-delete",
    title: "Soft Delete",
    description: "Mark records as deleted without removing them.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `-- Enable soft delete
local User = jade.Entity("users", { ... }):softDelete()

-- Query non-deleted (default)
User:get()

-- Include soft-deleted
User:withTrashed():get()

-- Only soft-deleted
User:onlyTrashed():get()

-- Force delete
User:where(User.id:eq(1)):forceDelete()`,
      },
    ],
  },
  {
    id: "error-codes",
    title: "Error Codes",
    description: "Structured error handling.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `local ok, err = pcall(function()
  User:create({ email = "invalid" })
end)

if not ok then
  print(err.code)      -- J1016
  print(err.message)   -- "Unique constraint violation"
  print(err:toJSON())  -- { code = "J1016", message = "..." }
end`,
      },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    description: "Test helpers and utilities.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `local jade = require("jade")
local helpers = require("jade.test.helpers")

-- Configure test database
jade.configure({
  database = { driver = "sqlite", database = ":memory:" }
})

-- Create tables
helpers.setup({ User, Post, Comment })

-- Truncate between tests
helpers.truncateAll()

-- Wrap in transaction (auto-rollback)
helpers.transaction(function()
  local user = User:create({ name = "Test" })
  assert(user.id ~= nil)
end)`,
      },
    ],
  },
];
