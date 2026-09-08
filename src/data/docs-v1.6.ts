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

export const docsSectionsV1_6: DocSection[] = [
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
      {
        type: "callout",
        variant: "tip",
        text: "Starting with v1.6, the recommended way to define schemas is using .jade files. See Declarative Schema for details.",
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
      { type: "heading", text: "2. Define Schema (.jade file)", level: 3 },
      {
        type: "code",
        language: "text",
        title: "schema/models.jade",
        code: `model User {
    name = String(120)!
    email = String(255)!
    role = String(20)!.default("user")
    active = Boolean().default(true)
    posts = hasMany(Post)
}

model Post {
    title = String(255)!
    body = Text()!
    published = Boolean().default(false)
    author = belongsTo(User)
}`,
      },
      { type: "heading", text: "3. Load and Use", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Load entities from .jade file
local entities = jade.loadEntities("schema/models.jade")
local User = entities.User
local Post = entities.Post

-- Sync tables to database
jade.syncSchema("schema/models.jade")

-- Create a user
local user = User:create({
  name = "Alice",
  email = "alice@example.com",
  password = "secret123"
})

-- Query with filters
local admins = User:where(User.role:eq("admin")):get()

-- Pagination
local page = User:paginate({ page = 1, per_page = 20 })`,
      },
    ],
  },
  {
    id: "declarative-schema",
    title: "Declarative Schema",
    description: "Define your database schema using .jade files.",
    content: [
      {
        type: "paragraph",
        text: "Starting with v1.6, the recommended way to define schemas is using .jade files. This is a declarative approach where you define your models once, and Jade generates entities and tables automatically.",
      },
      {
        type: "callout",
        variant: "info",
        text: "The .jade file is the standard way to define schemas in Jade. The older approach of defining entities in Lua code is still supported but not recommended for new projects.",
      },
      { type: "heading", text: "Basic Syntax", level: 3 },
      {
        type: "code",
        language: "text",
        title: "schema/models.jade",
        code: `model User {
    table = "users"                     -- custom table name (optional)
    timestamps = true                   -- created_at, updated_at (default: true)
    id = CUID()                         -- custom primary key type (default: Integer)

    name = String(120)!                 -- NOT NULL
    email = String(255)!                -- NOT NULL
    bio = Text()?                       -- nullable (optional)
    role = String(20)!.default("user")  -- NOT NULL with default
    active = Boolean().default(true)    -- default value
    score = Decimal(10,2)               -- decimal with precision
    data = JSON()                       -- JSON field
}`,
      },
      { type: "heading", text: "Field Types", level: 3 },
      {
        type: "table",
        headers: ["Type", "SQL Equivalent", "Description"],
        rows: [
          ["String(n)", "VARCHAR(n)", "String with max length"],
          ["Text()", "TEXT", "Unlimited text"],
          ["Integer()", "INTEGER", "Whole number"],
          ["BigInt()", "BIGINT", "Large integer"],
          ["Float()", "DOUBLE PRECISION", "Floating point"],
          ["Decimal(p,s)", "DECIMAL(p,s)", "Exact decimal"],
          ["Boolean()", "BOOLEAN", "True/false"],
          ["Timestamp()", "TIMESTAMP", "Date and time"],
          ["Date()", "DATE", "Date only"],
          ["UUID()", "UUID", "Universally unique ID"],
          ["JSON()", "JSONB", "JSON data"],
          ["CUID()", "VARCHAR(25)", "Collision-resistant unique ID"],
          ["NanoID()", "VARCHAR(21)", "Short unique ID"],
          ["Enum(...)", "VARCHAR", "Enumeration of values"],
        ],
      },
      { type: "heading", text: "Modifiers", level: 3 },
      {
        type: "table",
        headers: ["Modifier", "Description", "Example"],
        rows: [
          ["!", "Required (NOT NULL)", "name = String(120)!"],
          ["?", "Optional (nullable)", "bio = Text()?"],
          [
            ".default(val)",
            "Default value",
            'role = String(20)!.default("user")',
          ],
          [
            ".defaultNow()",
            "Default to current timestamp",
            "created_at = Timestamp().defaultNow()",
          ],
        ],
      },
      { type: "heading", text: "Relations", level: 3 },
      {
        type: "code",
        language: "text",
        code: `model User {
    -- One-to-many: user has many posts
    posts = hasMany(Post)

    -- One-to-one: user has one profile
    profile = hasOne(Profile)
}

model Post {
    -- Many-to-one: post belongs to a user
    -- Automatically creates user_id foreign key
    author = belongsTo(User)
}`,
      },
      { type: "heading", text: "Options", level: 3 },
      {
        type: "table",
        headers: ["Option", "Default", "Description"],
        rows: [
          ['table = "name"', "Pluralized model name", "Custom table name"],
          ["timestamps = true", "true", "Add created_at and updated_at"],
          ["id = CUID()", "Integer auto-increment", "Custom primary key type"],
          ["id = false", "N/A", "Disable auto primary key"],
        ],
      },
      { type: "heading", text: "Loading Schema", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local jade = require("jade")

-- Load entities (returns table of Entity objects)
local entities = jade.loadEntities("schema/models.jade")
local User = entities.User
local Post = entities.Post

-- Or load and sync tables to database
jade.syncSchema("schema/models.jade")

-- Or just parse the schema (returns raw model data)
local schema = jade.loadSchema("schema/models.jade")`,
      },
      { type: "heading", text: "Migration Workflow", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Generate migration from .jade schema diff
esmeralda generate

# Run pending migrations
esmeralda migrate

# Or sync directly (dev only, skip migrations)
esmeralda db sync

# Compare schema with database
esmeralda db diff`,
      },
      {
        type: "callout",
        variant: "warning",
        text: "esmeralda db sync is for development only. It refuses to run in production. Use migrations for production deployments.",
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    description: "How to configure Jade for your environment.",
    content: [
      {
        type: "code",
        language: "lua",
        title: "jade.config.lua",
        code: `return {
    database = {
        driver = "postgresql",
        host = "localhost",
        port = 5432,
        database = "myapp",
        user = "postgres",
        password = "secret",
        ssl = false,
    },
    -- Connection pool (optional)
    pool = {
        max_size = 10,
        min_size = 2,
        idle_timeout = 300,
    },
    -- Logging (optional)
    logging = {
        level = "info",
        sql = false,
    },
    -- Encryption (optional)
    encryption = {
        key = "your-secret-key",
        algorithm = "aes",
    },
}`,
      },
    ],
  },
  {
    id: "column-types",
    title: "Column Types",
    description: "All available column types and their SQL equivalents.",
    content: [
      {
        type: "table",
        headers: ["Jade Type", "PostgreSQL", "MySQL", "SQLite"],
        rows: [
          ["String(n)", "VARCHAR(n)", "VARCHAR(n)", "TEXT"],
          ["Text()", "TEXT", "TEXT", "TEXT"],
          ["Integer()", "INTEGER", "INT", "INTEGER"],
          ["BigInt()", "BIGINT", "BIGINT", "INTEGER"],
          ["Float()", "DOUBLE PRECISION", "DOUBLE", "REAL"],
          ["Decimal(p,s)", "DECIMAL(p,s)", "DECIMAL(p,s)", "REAL"],
          ["Boolean()", "BOOLEAN", "TINYINT(1)", "INTEGER"],
          ["Timestamp()", "TIMESTAMPTZ", "DATETIME", "TEXT"],
          ["Date()", "DATE", "DATE", "TEXT"],
          ["UUID()", "UUID", "CHAR(36)", "TEXT"],
          ["JSON()", "JSONB", "JSON", "TEXT"],
        ],
      },
    ],
  },
  {
    id: "column-modifiers",
    title: "Column Modifiers",
    description: "Methods to customize column behavior.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `-- Primary key (also sets NOT NULL)
Jade.Integer():primaryKey()

-- Auto-increment
Jade.Integer():primaryKey():autoIncrement()

-- NOT NULL
Jade.String(120):notNull()

-- UNIQUE constraint
Jade.String(255):unique()

-- Default value
Jade.String(20):default("user")

-- Default to current timestamp
Jade.Timestamp():defaultNow()

-- Foreign key reference
Jade.Integer():references("users", "id")

-- Encrypted column
Jade.String(255):encrypted()`,
      },
    ],
  },
  {
    id: "relations",
    title: "Relations",
    description: "Define relationships between entities.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `local User = jade.Entity("users", { ... })
local Post = jade.Entity("posts", { ... })

-- One-to-many: User has many Posts
User:hasMany(Post, { foreign_key = "user_id" })

-- Many-to-one: Post belongs to User
Post:belongsTo(User, { foreign_key = "user_id" })

-- One-to-one: User has one Profile
User:hasOne(Profile, { foreign_key = "user_id" })

-- Many-to-many via pivot table
User:hasAndBelongsToMany(Role, {
    join_table = "user_roles",
    source_foreign_key = "user_id",
    target_foreign_key = "role_id"
})`,
      },
      { type: "heading", text: "Eager Loading", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Load posts with their authors (avoids N+1 queries)
local posts = Post:include("User"):get()
for _, post in ipairs(posts) do
    print(post.title .. " by " .. post.User.name)
end`,
      },
    ],
  },
  {
    id: "nested-creates",
    title: "Nested Creates",
    description: "Create related records in a single operation.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `-- Create user with posts
local user = User:create({
    name = "Alice",
    email = "alice@example.com",
    posts = {
        { create = { title = "First Post", body = "Hello!" } },
        { create = { title = "Second Post", body = "World!" } },
    }
})

-- Connect existing record
local post = Post:create({
    title = "My Post",
    author = { connect = { id = 1 } }
})`,
      },
    ],
  },
  {
    id: "query-builder",
    title: "Query Builder",
    description: "Build complex queries with a fluent API.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `-- Where clauses
User:where(User.active:eq(true)):get()
User:where(User.name:like("%Alice%")):get()
User:where(User.id:inList({1, 2, 3})):get()

-- Chaining
User:where(User.role:eq("admin"))
    :orderBy("name", "ASC")
    :limit(10)
    :offset(20)
    :get()

-- Aggregations
local count = User:count()
local total = Post:sum("views")
local avg = Post:average("rating")

-- Pagination
local page = User:paginate({ page = 1, per_page = 20 })`,
      },
    ],
  },
  {
    id: "encryption",
    title: "Encryption",
    description: "Encrypt sensitive data at the field level.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `-- Database-native encryption (AES)
jade.configure({
    encryption = {
        key = "your-secret-key",
        algorithm = "aes"
    }
})

-- Custom encryption functions
jade.configure({
    encryption = {
        algorithm = "custom",
        encrypt_fn = function(value, key)
            return my_encrypt(value, key)
        end,
        decrypt_fn = function(encrypted, key)
            return my_decrypt(encrypted, key)
        end
    }
})`,
      },
    ],
  },
  {
    id: "security",
    title: "Security Features",
    description: "Built-in protection against common vulnerabilities.",
    content: [
      {
        type: "list",
        items: [
          "SQL injection prevention via prepared statements",
          "Input validation and sanitization",
          "Query length and parameter limits",
          "Rate limiting for API endpoints",
          "Identifier validation for table/column names",
        ],
      },
    ],
  },
  {
    id: "migrations",
    title: "Migrations",
    description: "Manage database schema changes over time.",
    content: [
      {
        type: "code",
        language: "bash",
        code: `# Create a new migration
esmeralda migrate create add_avatar

# Run pending migrations
esmeralda migrate

# Rollback last migration
esmeralda migrate rollback

# Check migration status
esmeralda migrate status`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "With .jade files, you can use esmeralda generate to automatically create migrations from schema changes.",
      },
    ],
  },
  {
    id: "cli",
    title: "CLI (Esmeralda)",
    description: "Command-line tools for Jade ORM.",
    content: [
      {
        type: "code",
        language: "bash",
        code: `# Initialize a new project
esmeralda init my-app --template api-rest

# Generate schema files from .jade
esmeralda schema-generate

# Generate migration from schema diff
esmeralda generate

# Run migrations
esmeralda migrate

# Sync database (development only)
esmeralda db sync

# Compare schema with database
esmeralda db diff

# Introspect database and generate entities
esmeralda db pull --full`,
      },
    ],
  },
  {
    id: "db-pull",
    title: "Database Introspection",
    description: "Generate entity files from existing databases.",
    content: [
      {
        type: "code",
        language: "bash",
        code: `# Basic introspection
esmeralda db pull

# With relations, validations, scopes
esmeralda db pull --full

# Only relations
esmeralda db pull --relations

# Specific table
esmeralda db pull -t users`,
      },
    ],
  },
  {
    id: "transactions",
    title: "Transactions",
    description: "Execute multiple operations atomically.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `jade.transaction.run(jade.driver(), function(tx)
    local user = User:create({ name = "Alice" })
    Post:create({ title = "Post", author_id = user.id })
    -- If any error occurs, everything is rolled back
end)`,
      },
    ],
  },
  {
    id: "callbacks",
    title: "Callbacks",
    description: "Hook into entity lifecycle events.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `User:beforeCreate(function(data)
    data.created_at = os.date("!%Y-%m-%dT%H:%M:%SZ")
end)

User:afterCreate(function(instance)
    print("User created: " .. instance.name)
end)

User:beforeUpdate(function(data)
    data.updated_at = os.date("!%Y-%m-%dT%H:%M:%SZ")
end)`,
      },
    ],
  },
  {
    id: "validations",
    title: "Validations",
    description: "Validate data before saving to database.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `User:validatePresenceOf("name")
User:validatePresenceOf("email")
User:validateUniquenessOf("email")
User:validateLengthOf("name", { min = 2, max = 120 })
User:validateFormatOf("email", { pattern = "^[%w]+@[%w]+%.[%a]+$" })
User:validateNumericalityOf("age", { min = 0, max = 150 })
User:validateInclusionOf("role", { "user", "admin", "moderator" })`,
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
User:softDelete()

-- Soft delete (sets deleted_at)
User:delete(1)

-- Query without deleted records (default)
User:all()

-- Include deleted records
User:withTrashed():get()

-- Only deleted records
User:onlyTrashed():get()

-- Restore deleted record
User:restore({ id = 1 })`,
      },
    ],
  },
  {
    id: "linter",
    title: "Linter (VS Code)",
    description: "VS Code extension for Jade ORM.",
    content: [
      {
        type: "paragraph",
        text: "The Jade Linter provides syntax highlighting, auto-completion, and diagnostics for .jade files and Jade Lua code in VS Code.",
      },
      {
        type: "list",
        items: [
          "Syntax highlighting for .jade files",
          "Auto-completion for column types and modifiers",
          "Diagnostics for invalid types and missing modifiers",
          "Hover documentation for Jade types",
        ],
      },
    ],
  },
  {
    id: "luals",
    title: "LuaLS Integration",
    description: "Autocomplete and type checking with Lua Language Server.",
    content: [
      {
        type: "code",
        language: "json",
        title: ".luarc.json",
        code: `{
  "runtime": { "version": "Lua 5.1" },
  "workspace": { "library": ["src/jade/types"] }
}`,
      },
      {
        type: "list",
        items: [
          "Autocomplete for all Jade methods",
          "Type checking for method chaining",
          "Hover documentation",
          "Go-to-definition",
        ],
      },
    ],
  },
  {
    id: "error-codes",
    title: "Error Codes",
    description: "Reference for all Jade error codes.",
    content: [
      {
        type: "table",
        headers: ["Code", "Description"],
        rows: [
          ["CONN_001", "Connection failed"],
          ["CONN_002", "Connection timeout"],
          ["QUERY_001", "Invalid query"],
          ["QUERY_002", "Query timeout"],
          ["MIGRATE_001", "Migration failed"],
          ["SEC_001", "SQL injection detected"],
          ["SEC_002", "Invalid identifier"],
        ],
      },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    description: "How to test Jade applications.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `-- Use in-memory SQLite for tests
jade.configure({
    database = { driver = "sqlite", database = ":memory:" }
})

-- Run tests
local busted = require("busted")
describe("User", function()
    it("creates a user", function()
        local user = User:create({ name = "Test" })
        assert.is_not_nil(user.id)
    end)
end)`,
      },
    ],
  },
];
