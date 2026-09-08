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
        text: "Jade is a Data Mapper ORM for Lua 5.1+ inspired by Prisma. It maps your database tables to Lua objects with a declarative schema, automatic migrations, and a fluent query builder.",
      },
      {
        type: "paragraph",
        text: "Unlike traditional ORMs, Jade doesn't hide SQL. Every query is transparent and auditable. You define your schema once in a .jade file, and Jade handles the rest: entities, tables, relations, validations, and migrations.",
      },
      { type: "heading", text: "Why Jade?", level: 3 },
      {
        type: "list",
        items: [
          "**Declarative schema** — Define your database in a single .jade file. No manual entity definitions.",
          "**Automatic migrations** — Schema changes become versioned migration files.",
          "**Fluent query builder** — Chain where, orderBy, limit, paginate. No string concatenation.",
          "**Relations** — belongsTo, hasMany, hasOne, hasAndBelongsToMany with eager loading.",
          "**Multi-database** — PostgreSQL, MySQL, MariaDB, SQLite, OpenResty.",
          "**Security** — SQL injection prevention, input validation, parameterized queries.",
          "**LuaLS support** — Full autocomplete and type checking in editors.",
        ],
      },
      { type: "heading", text: "Supported Lua Versions", level: 3 },
      {
        type: "table",
        headers: ["Version", "Status"],
        rows: [
          ["Lua 5.1", "Supported"],
          ["Lua 5.2", "Supported"],
          ["Lua 5.3", "Supported"],
          ["Lua 5.4", "Supported"],
          ["LuaJIT", "Supported"],
        ],
      },
    ],
  },
  {
    id: "installation",
    title: "Installation",
    description: "How to install Jade and its requirements.",
    content: [
      { type: "heading", text: "Install Jade", level: 3 },
      {
        type: "code",
        code: "luarocks install jade",
        language: "bash",
      },
      { type: "heading", text: "Install Database Driver", level: 3 },
      {
        type: "paragraph",
        text: "Jade needs a database driver. Install the one for your database:",
      },
      {
        type: "code",
        code: `# PostgreSQL
luarocks install luapgsql

# MySQL / MariaDB
luarocks install luasql-mysql

# SQLite
luarocks install luasql-sqlite3`,
        language: "bash",
      },
      { type: "heading", text: "Install Esmeralda CLI (Optional)", level: 3 },
      {
        type: "paragraph",
        text: "Esmeralda is the command-line tool for Jade. It handles migrations, schema generation, and database introspection.",
      },
      {
        type: "code",
        code: "npm install -g @alehandrosv/esmeralda-cli",
        language: "bash",
      },
      {
        type: "callout",
        variant: "tip",
        text: "The CLI is optional but recommended. You can use Jade without it by managing migrations manually.",
      },
    ],
  },
  {
    id: "quick-start",
    title: "Quick Start",
    description: "Get up and running with Jade in 5 minutes.",
    content: [
      { type: "heading", text: "1. Initialize Project", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Create project with Esmeralda CLI
esmeralda init my-app --template api-rest
cd my-app

# Or manually: create jade.config.lua and schema/models.jade`,
      },
      { type: "heading", text: "2. Configure Database", level: 3 },
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
  },
}`,
      },
      { type: "heading", text: "3. Define Schema", level: 3 },
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
      {
        type: "callout",
        variant: "info",
        text: "The .jade file is the standard way to define schemas. Jade auto-generates the id (primary key), created_at, and updated_at fields by default.",
      },
      { type: "heading", text: "4. Sync Database", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Create tables from .jade schema
esmeralda db sync

# Or generate a migration file
esmeralda generate
esmeralda migrate`,
      },
      { type: "heading", text: "5. Use in Code", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local jade = require("jade")
local config = require("jade.config").load()

-- Configure and load entities
jade.configure(config)
local entities = jade.loadEntities("schema/models.jade")
local User = entities.User
local Post = entities.Post

-- Create
local user = User:create({
  name = "Alice",
  email = "alice@example.com",
  password = "secret123",
})

-- Read
local admins = User:where(User.role:eq("admin")):get()
local page = User:paginate({ page = 1, per_page = 20 })

-- Update
user:update({ name = "Alice Silva" })

-- Delete
user:delete()`,
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
        text: "The .jade file is a declarative schema definition. You describe what your database looks like, and Jade creates it. One file, one source of truth.",
      },
      { type: "heading", text: "File Structure", level: 3 },
      {
        type: "code",
        language: "text",
        title: "schema/models.jade",
        code: `-- Comments start with --

model User {
    -- Options (optional)
    table = "users"              -- custom table name
    timestamps = true            -- created_at + updated_at (default: true)
    id = CUID()                  -- primary key type (default: Integer)

    -- Fields
    name = String(120)!          -- NOT NULL
    email = String(255)!         -- NOT NULL
    bio = Text()?                -- nullable
    role = String(20)!.default("user")
    active = Boolean().default(true)
    avatar = String(255)         -- optional by default

    -- Relations
    posts = hasMany(Post)
    profile = hasOne(Profile)
}`,
      },
      { type: "heading", text: "Field Types", level: 3 },
      {
        type: "table",
        headers: ["Jade Type", "PostgreSQL", "MySQL", "SQLite", "Description"],
        rows: [
          [
            "String(n)",
            "VARCHAR(n)",
            "VARCHAR(n)",
            "TEXT",
            "String with max length",
          ],
          ["Text()", "TEXT", "TEXT", "TEXT", "Unlimited text"],
          ["Integer()", "INTEGER", "INT", "INTEGER", "Whole number"],
          ["BigInt()", "BIGINT", "BIGINT", "INTEGER", "Large integer"],
          ["Float()", "DOUBLE PRECISION", "DOUBLE", "REAL", "Floating point"],
          [
            "Decimal(p,s)",
            "DECIMAL(p,s)",
            "DECIMAL(p,s)",
            "REAL",
            "Exact decimal",
          ],
          ["Boolean()", "BOOLEAN", "TINYINT(1)", "INTEGER", "True/false"],
          ["Timestamp()", "TIMESTAMPTZ", "DATETIME", "TEXT", "Date and time"],
          ["Date()", "DATE", "DATE", "TEXT", "Date only"],
          ["UUID()", "UUID", "CHAR(36)", "TEXT", "Unique identifier"],
          [
            "CUID()",
            "VARCHAR(25)",
            "VARCHAR(25)",
            "TEXT",
            "Collision-resistant ID",
          ],
          ["NanoID()", "VARCHAR(21)", "VARCHAR(21)", "TEXT", "Short unique ID"],
          ["JSON()", "JSONB", "JSON", "TEXT", "JSON data"],
        ],
      },
      { type: "heading", text: "Modifiers", level: 3 },
      {
        type: "table",
        headers: ["Syntax", "Meaning", "Example"],
        rows: [
          ["`!`", "Required (NOT NULL)", "`name = String(120)!`"],
          ["`?`", "Optional (nullable)", "`bio = Text()?`"],
          [
            "`.default(val)`",
            "Default value",
            '`role = String(20)!.default("user")`',
          ],
          [
            "`.defaultNow()`",
            "Default to current timestamp",
            "`created_at = Timestamp().defaultNow()`",
          ],
        ],
      },
      {
        type: "callout",
        variant: "tip",
        text: "Fields are optional by default (nullable) unless you add the ! modifier. The id, created_at, and updated_at fields are added automatically.",
      },
      { type: "heading", text: "Relations", level: 3 },
      {
        type: "code",
        language: "text",
        code: `model User {
    -- One user has many posts
    posts = hasMany(Post)

    -- One user has one profile
    profile = hasOne(Profile)
}

model Post {
    -- Each post belongs to one user
    -- Creates user_id foreign key automatically
    author = belongsTo(User)
}`,
      },
      {
        type: "paragraph",
        text: "Jade infers the foreign key name from the relation: belongsTo(User) creates user_id. You can override this with options in Lua code if needed.",
      },
      { type: "heading", text: "Model Options", level: 3 },
      {
        type: "table",
        headers: ["Option", "Default", "Description"],
        rows: [
          ['table = "name"', "Pluralized model name", "Custom table name"],
          [
            "timestamps = true",
            "true",
            "Add created_at and updated_at columns",
          ],
          ["id = CUID()", "Integer auto-increment", "Custom primary key type"],
          ["id = false", "N/A", "Disable automatic primary key"],
        ],
      },
      { type: "heading", text: "Loading the Schema", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local jade = require("jade")

-- Load entities (returns table of Entity objects)
local entities = jade.loadEntities("schema/models.jade")
local User = entities.User
local Post = entities.Post

-- Load and create tables in database
jade.syncSchema("schema/models.jade")

-- Just parse the schema (returns raw model data)
local schema = jade.loadSchema("schema/models.jade")`,
      },
      { type: "heading", text: "Migration Workflow", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Generate migration from .jade changes
esmeralda generate

# Run pending migrations
esmeralda migrate

# Preview changes without applying
esmeralda generate --preview

# Compare schema with database
esmeralda db diff`,
      },
      {
        type: "callout",
        variant: "warning",
        text: "esmeralda db sync creates tables directly without migration files. Use it only in development. For production, always use migrations.",
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    description: "How to configure Jade for different environments.",
    content: [
      {
        type: "paragraph",
        text: "Jade reads its configuration from jade.config.lua. You can have different configs per environment.",
      },
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
    pool = {
        max_size = 10,       -- max connections
        min_size = 2,        -- min idle connections
        idle_timeout = 300,  -- seconds before closing idle
    },
    logging = {
        level = "info",      -- debug | info | warn | error
        sql = false,         -- log SQL queries
    },
}`,
      },
      { type: "heading", text: "Environment Variables", level: 3 },
      {
        type: "table",
        headers: ["Variable", "Default", "Description"],
        rows: [
          ["JADE_ENV", "development", "Current environment"],
          ["DB_DRIVER", "postgresql", "Database driver"],
          ["DB_HOST", "localhost", "Database host"],
          ["DB_PORT", "5432", "Database port"],
          ["DB_NAME", "-", "Database name"],
          ["DB_USER", "-", "Database user"],
          ["DB_PASSWORD", "-", "Database password"],
          ["DB_SSL", "false", "Enable SSL"],
        ],
      },
      { type: "heading", text: "Multi-Database", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local jade = require("jade")

-- Register multiple databases
jade.database.register("primary", { driver = "postgresql", database = "main" })
jade.database.register("analytics", { driver = "mysql", database = "stats" })

-- Use specific database
local User = jade.Entity("users", { ... })
local db = jade.database.connect("analytics")
User:configure(db)`,
      },
    ],
  },
  {
    id: "column-types",
    title: "Column Types",
    description: "All available column types and their SQL equivalents.",
    content: [
      {
        type: "paragraph",
        text: "Column types define how Jade maps Lua values to database columns. Each type has equivalents in all supported databases.",
      },
      {
        type: "table",
        headers: ["Jade Type", "PostgreSQL", "MySQL", "SQLite", "Lua Type"],
        rows: [
          ["String(n)", "VARCHAR(n)", "VARCHAR(n)", "TEXT", "string"],
          ["Text()", "TEXT", "TEXT", "TEXT", "string"],
          ["Integer()", "INTEGER", "INT", "INTEGER", "number"],
          ["BigInt()", "BIGINT", "BIGINT", "INTEGER", "number"],
          ["Float()", "DOUBLE PRECISION", "DOUBLE", "REAL", "number"],
          ["Decimal(p,s)", "DECIMAL(p,s)", "DECIMAL(p,s)", "REAL", "number"],
          ["Boolean()", "BOOLEAN", "TINYINT(1)", "INTEGER", "boolean"],
          [
            "Timestamp()",
            "TIMESTAMPTZ",
            "DATETIME",
            "TEXT",
            "string (ISO 8601)",
          ],
          ["Date()", "DATE", "DATE", "TEXT", "string (YYYY-MM-DD)"],
          ["UUID()", "UUID", "CHAR(36)", "TEXT", "string"],
          ["CUID()", "VARCHAR(25)", "VARCHAR(25)", "TEXT", "string"],
          ["NanoID()", "VARCHAR(21)", "VARCHAR(21)", "TEXT", "string"],
          ["JSON()", "JSONB", "JSON", "TEXT", "table"],
        ],
      },
      { type: "heading", text: "Usage in .jade", level: 3 },
      {
        type: "code",
        language: "text",
        code: `model Product {
    name = String(200)!          -- VARCHAR(200) NOT NULL
    description = Text()         -- TEXT (nullable)
    price = Decimal(10,2)!       -- DECIMAL(10,2) NOT NULL
    quantity = Integer()!.default(0)
    metadata = JSON()            -- JSONB
    sku = String(50)!@unique     -- VARCHAR(50) NOT NULL UNIQUE
}`,
      },
    ],
  },
  {
    id: "column-modifiers",
    title: "Column Modifiers",
    description: "Methods to customize column behavior in Lua code.",
    content: [
      {
        type: "paragraph",
        text: "When defining entities in Lua (legacy approach), you use modifier methods to add constraints. In .jade files, use the syntax shortcuts instead.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- In .jade files:
-- name = String(120)!              → notNull()
-- email = String(255)!@unique      → unique()
-- role = String(20)!.default("user") → default("user")

-- In Lua code (legacy):
Jade.String(120):notNull()
Jade.String(255):unique()
Jade.String(20):default("user")
Jade.Timestamp():defaultNow()
Jade.Integer():primaryKey()
Jade.Integer():autoIncrement()
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
        type: "paragraph",
        text: "Relations define how entities are connected. Jade supports four types: belongsTo, hasMany, hasOne, and hasAndBelongsToMany.",
      },
      { type: "heading", text: "Relation Types", level: 3 },
      {
        type: "table",
        headers: ["Type", "Description", "Foreign Key", "Example"],
        rows: [
          [
            "belongsTo",
            "Many-to-one (FK on this table)",
            "user_id on posts",
            "Post belongs to User",
          ],
          [
            "hasMany",
            "One-to-many (FK on other table)",
            "user_id on posts",
            "User has many Posts",
          ],
          [
            "hasOne",
            "One-to-one (FK on other table)",
            "user_id on profiles",
            "User has one Profile",
          ],
          [
            "hasAndBelongsToMany",
            "Many-to-many (pivot table)",
            "pivot table",
            "User has many Roles",
          ],
        ],
      },
      { type: "heading", text: "In .jade Files", level: 3 },
      {
        type: "code",
        language: "text",
        code: `model User {
    name = String(120)!
    posts = hasMany(Post)
    profile = hasOne(Profile)
}

model Post {
    title = String(255)!
    author = belongsTo(User)    -- creates user_id FK
}`,
      },
      { type: "heading", text: "In Lua Code", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local User = jade.Entity("users", { ... })
local Post = jade.Entity("posts", { ... })

User:hasMany(Post, { foreign_key = "user_id" })
Post:belongsTo(User, { foreign_key = "user_id" })
User:hasOne(Profile, { foreign_key = "user_id" })
User:hasAndBelongsToMany(Role, {
    join_table = "user_roles",
    source_foreign_key = "user_id",
    target_foreign_key = "role_id",
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
end

-- Multiple relations
local users = User:include("Posts"):include("Profile"):get()`,
      },
    ],
  },
  {
    id: "nested-creates",
    title: "Nested Creates",
    description: "Create related records in a single operation.",
    content: [
      {
        type: "paragraph",
        text: "Nested creates let you create parent and child records together. Jade handles the foreign key assignment automatically.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- Create user with posts in one call
local user = User:create({
    name = "Alice",
    email = "alice@example.com",
    posts = {
        { create = { title = "First Post", body = "Hello!" } },
        { create = { title = "Second Post", body = "World!" } },
    },
})

-- Connect existing record
local post = Post:create({
    title = "My Post",
    author = { connect = { id = 1 } },
})

-- Connect or create
local post = Post:create({
    title = "My Post",
    author = {
        connectOrCreate = {
            where = { email = "alice@example.com" },
            create = { name = "Alice", email = "alice@example.com" },
        },
    },
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
        type: "paragraph",
        text: "The query builder lets you construct SQL queries using method chaining. Every method returns the query object, so you can chain as many as you need.",
      },
      { type: "heading", text: "Where Clauses", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Equality
User:where(User.role:eq("admin")):get()

-- Comparison
User:where(User.age:gt(18)):get()
User:where(User.age:gte(18)):get()
User:where(User.age:lt(65)):get()
User:where(User.age:lte(65)):get()

-- Pattern matching
User:where(User.name:like("%Alice%")):get()

-- List
User:where(User.id:inList({1, 2, 3})):get()

-- Null check
User:where(User.deleted_at:isNull()):get()

-- Range
User:where(User.age:between(18, 65)):get()`,
      },
      { type: "heading", text: "Logical Operators", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- AND (multiple where calls)
User:where(User.active:eq(true))
    :where(User.role:eq("admin"))
    :get()

-- OR
User:where(User.role:eq("admin"):bor(User.role:eq("moderator")))
    :get()

-- Complex AND/OR
User:where(
    User.active:eq(true):band(
        User.role:eq("admin"):bor(User.role:eq("mod"))
    )
):get()`,
      },
      { type: "heading", text: "Sorting and Pagination", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Order by
User:orderBy("name", "ASC"):get()
User:orderBy("created_at", "DESC"):get()

-- Limit and offset
User:limit(10):offset(20):get()

-- Chained query
local results = User:where(User.active:eq(true))
    :orderBy("name", "ASC")
    :limit(10)
    :offset(0)
    :get()`,
      },
      { type: "heading", text: "Aggregations", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local count = User:count()
local total = Post:sum("views")
local avg = Post:average("rating")
local min = Post:min("price")
local max = Post:max("price")

-- With filter
local activeCount = User:where(User.active:eq(true)):count()`,
      },
      { type: "heading", text: "Pagination", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local page = User:paginate({ page = 1, per_page = 20 })

-- Returns:
-- {
--   data = { ... },        -- records for this page
--   total = 100,           -- total records
--   page = 1,              -- current page
--   per_page = 20,         -- items per page
--   total_pages = 5,       -- total pages
--   has_next = true,       -- has next page
--   has_prev = false,      -- has previous page
-- }`,
      },
    ],
  },
  {
    id: "encryption",
    title: "Encryption",
    description: "Encrypt sensitive data at the field level.",
    content: [
      {
        type: "paragraph",
        text: "Jade supports field-level encryption. You can use database-native encryption (AES) or custom encryption functions.",
      },
      { type: "heading", text: "Database-Native (AES)", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `jade.configure({
    encryption = {
        key = "your-secret-key",
        algorithm = "aes",
    },
})

-- Mark column as encrypted
local User = jade.Entity("users", {
    email = Jade.String(255):encrypted(),
    ssn = Jade.String(20):encrypted(),
})`,
      },
      { type: "heading", text: "Custom Encryption", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `jade.configure({
    encryption = {
        algorithm = "custom",
        encrypt_fn = function(value, key)
            return my_encrypt(value, key)
        end,
        decrypt_fn = function(encrypted, key)
            return my_decrypt(encrypted, key)
        end,
    },
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
        type: "paragraph",
        text: "Jade has multiple layers of security built into the core. These protections are always active and don't require configuration.",
      },
      { type: "heading", text: "SQL Injection Prevention", level: 3 },
      {
        type: "list",
        items: [
          "All queries use parameterized statements (prepared statements)",
          "Raw SQL is validated for dangerous patterns (UNION, DROP, DELETE, etc.)",
          "Identifier validation for table and column names",
          "Input sanitization for all user-provided values",
        ],
      },
      { type: "heading", text: "Input Validation", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Define validations
User:validatePresenceOf("name")
User:validatePresenceOf("email")
User:validateUniquenessOf("email")
User:validateLengthOf("name", { min = 2, max = 120 })
User:validateFormatOf("email", { pattern = "^[%w]+@[%w]+%.[%a]+$" })`,
      },
      { type: "heading", text: "Query Limits", level: 3 },
      {
        type: "table",
        headers: ["Protection", "Default", "Description"],
        rows: [
          ["Max query length", "10000 chars", "Prevents oversized queries"],
          ["Max parameters", "100", "Prevents parameter flooding"],
          ["Max string length", "10000 chars", "Prevents buffer overflow"],
          ["Max IN items", "1000", "Prevents IN clause abuse"],
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
        type: "paragraph",
        text: "Migrations are versioned scripts that change your database schema. They can be applied (up) or reverted (down), ensuring your database stays in sync across environments.",
      },
      { type: "heading", text: "Migration Commands", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Generate migration from .jade schema changes
esmeralda generate

# Run all pending migrations
esmeralda migrate

# Rollback last migration
esmeralda migrate rollback

# Rollback last 3 migrations
esmeralda migrate rollback --steps 3

# Check migration status
esmeralda migrate status`,
      },
      { type: "heading", text: "Migration File Structure", level: 3 },
      {
        type: "code",
        language: "lua",
        title: "migrations/20260908120000_create_users.lua",
        code: `local jade = require("jade")

local M = {}

function M.up()
    jade.createTable("users", function(t)
        t:integer("id"):primaryKey()
        t:string("name", 120):notNull()
        t:string("email", 255):notNull():unique()
        t:string("role", 20):default("user")
        t:boolean("active"):default(true)
        t:timestamp("created_at"):defaultNow()
        t:timestamp("updated_at"):defaultNow()
    end)
end

function M.down()
    jade.dropTable("users")
end

return M`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "With .jade files, use esmeralda generate to automatically create migrations from schema changes. No need to write migration files manually.",
      },
    ],
  },
  {
    id: "cli",
    title: "CLI (Esmeralda)",
    description: "Command-line tools for Jade ORM.",
    content: [
      {
        type: "paragraph",
        text: "Esmeralda is the CLI for Jade. It handles project initialization, schema generation, migrations, and database operations.",
      },
      { type: "heading", text: "Project Setup", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Initialize new project
esmeralda init my-app

# With template
esmeralda init my-app --template api-rest`,
      },
      { type: "heading", text: "Schema Management", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Generate migration from .jade changes (standard)
esmeralda generate

# Preview migration without creating file
esmeralda generate --preview

# Generate from specific .jade file
esmeralda generate -f schema/custom.jade

# Legacy: generate from schema/*.lua files
esmeralda generate:legacy`,
      },
      {
        type: "callout",
        variant: "info",
        text: "esmeralda generate reads .jade files (standard). esmeralda generate:legacy reads schema/*.lua files (deprecated).",
      },
      { type: "heading", text: "Database Operations", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Sync database with schema (development only)
esmeralda db sync

# Compare schema with database
esmeralda db diff

# Introspect database and generate entities
esmeralda db pull
esmeralda db pull --full          # with relations, validations, scopes
esmeralda db pull --relations     # only relations
esmeralda db pull -t users        # specific table`,
      },
      { type: "heading", text: "Migrations", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Run pending migrations
esmeralda migrate

# Create empty migration file
esmeralda migrate create add_avatar

# Rollback
esmeralda migrate rollback

# Status
esmeralda migrate status`,
      },
    ],
  },
  {
    id: "db-pull",
    title: "Database Introspection",
    description: "Generate entity files from existing databases.",
    content: [
      {
        type: "paragraph",
        text: "If you have an existing database, esmeralda db pull can introspect it and generate Jade entity files. It detects relations, validations, scopes, and patterns automatically.",
      },
      {
        type: "code",
        language: "bash",
        code: `# Basic: generate entity files
esmeralda db pull

# Full: include relations, validations, scopes, soft delete
esmeralda db pull --full

# Filter: only specific features
esmeralda db pull --relations
esmeralda db pull --scopes

# Target: specific table
esmeralda db pull -t users`,
      },
      { type: "heading", text: "What Gets Generated", level: 3 },
      {
        type: "table",
        headers: ["Feature", "Flag", "What It Does"],
        rows: [
          ["Relations", "--relations", "belongsTo, hasMany from foreign keys"],
          [
            "Validations",
            "--full",
            "validatePresenceOf for NOT NULL, validateUniquenessOf for UNIQUE",
          ],
          [
            "Scopes",
            "--scopes",
            "Suggested scopes for boolean, status, role columns",
          ],
          [
            "Soft Delete",
            "--scopes",
            "softDelete() when deleted_at column exists",
          ],
          ["Timestamps", "--full", "defaultNow() for created_at/updated_at"],
        ],
      },
      { type: "heading", text: "Example Output", level: 3 },
      {
        type: "code",
        language: "lua",
        title: "Generated: schema/users.lua",
        code: `local Jade = require("jade")

return Jade.Entity("users", {
    id = Jade.Integer():primaryKey():notNull(),
    email = Jade.String(255):notNull():unique(),
    name = Jade.String(120):notNull(),
    active = Jade.Boolean():default(true),
    role = Jade.String(50):default("user"),
    created_at = Jade.Timestamp():defaultNow(),
})

-- Suggested scopes
-- Users:scope("active", { active = true })
-- Users:scope("admin", { role = "admin" })`,
      },
    ],
  },
  {
    id: "transactions",
    title: "Transactions",
    description: "Execute multiple operations atomically.",
    content: [
      {
        type: "paragraph",
        text: "Transactions ensure that a group of operations either all succeed or all fail. If any error occurs inside a transaction, everything is rolled back.",
      },
      {
        type: "code",
        language: "lua",
        code: `jade.transaction.run(jade.driver(), function(tx)
    local user = User:create({ name = "Alice" })
    Post:create({ title = "Post", author_id = user.id })
    -- If any error occurs, everything is rolled back
end)`,
      },
      {
        type: "callout",
        variant: "warning",
        text: "Transactions require a database driver that supports them. SQLite transactions work in WAL mode. PostgreSQL and MySQL support transactions natively.",
      },
    ],
  },
  {
    id: "callbacks",
    title: "Callbacks",
    description: "Hook into entity lifecycle events.",
    content: [
      {
        type: "paragraph",
        text: "Callbacks let you run code before or after create, update, and delete operations. Use them for data normalization, audit logging, or side effects.",
      },
      { type: "heading", text: "Available Callbacks", level: 3 },
      {
        type: "table",
        headers: ["Callback", "When It Runs", "Receives"],
        rows: [
          ["beforeCreate", "Before INSERT", "data table"],
          ["afterCreate", "After INSERT", "instance, data"],
          ["beforeUpdate", "Before UPDATE", "data table"],
          ["afterUpdate", "After UPDATE", "instance, data"],
          ["beforeDelete", "Before DELETE", "data table"],
          ["afterDelete", "After DELETE", "instance, data"],
          ["beforeSave", "Before INSERT or UPDATE", "data table"],
          ["afterSave", "After INSERT or UPDATE", "instance, data"],
        ],
      },
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
        type: "paragraph",
        text: "Validations run before create and update operations. If validation fails, the operation is aborted with an error.",
      },
      { type: "heading", text: "Available Validations", level: 3 },
      {
        type: "table",
        headers: ["Method", "Validates", "Options"],
        rows: [
          ["validatePresenceOf", "Field is not nil/empty", "-"],
          ["validateUniquenessOf", "Value is unique in table", "-"],
          ["validateLengthOf", "String length", "min, max"],
          ["validateFormatOf", "Pattern match", "pattern (Lua pattern)"],
          ["validateInclusionOf", "Value in list", "list of allowed values"],
          ["validateNumericalityOf", "Value is a number", "min, max"],
        ],
      },
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
        type: "paragraph",
        text: "Soft delete marks records with a deleted_at timestamp instead of removing them from the database. This is useful for data recovery and audit trails.",
      },
      { type: "heading", text: "Enable Soft Delete", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `User:softDelete()

-- Or with options
User:softDelete({ column = "deleted_at", cascade = true })`,
      },
      { type: "heading", text: "Using Soft Delete", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- Soft delete (sets deleted_at)
User:delete(1)

-- Query without deleted records (default)
local users = User:all()

-- Include deleted records
local all = User:withTrashed():get()

-- Only deleted records
local trashed = User:onlyTrashed():get()

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
      { type: "heading", text: "Features", level: 3 },
      {
        type: "list",
        items: [
          "Syntax highlighting for .jade files",
          "Auto-completion for column types and modifiers",
          "Diagnostics for invalid types and missing modifiers",
          "Hover documentation for Jade types",
          "Cross-file validation for relation targets",
          "Auto-relation detection from foreign key names",
        ],
      },
      { type: "heading", text: "Installation", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# Install from VS Code Marketplace
# Search for "Jade Linter" in Extensions`,
      },
    ],
  },
  {
    id: "luals",
    title: "LuaLS Integration",
    description: "Autocomplete and type checking with Lua Language Server.",
    content: [
      {
        type: "paragraph",
        text: "Jade provides complete type definitions for the Lua Language Server (LuaLS), enabling autocomplete, type checking, and hover documentation in editors like VS Code, Neovim, and others.",
      },
      { type: "heading", text: "Setup", level: 3 },
      {
        type: "code",
        language: "json",
        title: ".luarc.json",
        code: `{
  "runtime": { "version": "Lua 5.1" },
  "workspace": { "library": ["src/jade/types"] },
  "completion": { "callSnippet": "Replace" }
}`,
      },
      { type: "heading", text: "What You Get", level: 3 },
      {
        type: "list",
        items: [
          "Autocomplete for all Jade methods (Entity, Query, Instance, Column)",
          "Type checking for method chaining",
          "Hover documentation showing method signatures",
          "Go-to-definition for Jade types and methods",
          "Diagnostics for invalid type usage",
        ],
      },
      {
        type: "code",
        language: "lua",
        code: `local Jade = require("jade")

-- Autocomplete works for:
Jade.String()    -- Shows: Jade.Column
Jade.Integer()   -- Shows: Jade.Column
Jade.Entity(...) -- Shows: Jade.Entity

local User = Jade.Entity("users", { ... })

-- Autocomplete for Query methods
User:where(...)  -- Shows available conditions
User:find(1)     -- Shows return type

-- Autocomplete for Instance methods
local user = User:find(1)
user:save()      -- Shows: Jade.Instance
user:update({})  -- Shows parameters`,
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
        headers: ["Code", "Category", "Description"],
        rows: [
          ["CONN_001", "Connection", "Connection failed"],
          ["CONN_002", "Connection", "Connection timeout"],
          ["QUERY_001", "Query", "Invalid query"],
          ["QUERY_002", "Query", "Query timeout"],
          ["MIGRATE_001", "Migration", "Migration failed"],
          ["SEC_001", "Security", "SQL injection detected"],
          ["SEC_002", "Security", "Invalid identifier"],
          ["VALID_001", "Validation", "Required field missing"],
          ["VALID_002", "Validation", "Unique constraint violated"],
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
        type: "paragraph",
        text: "For testing, use SQLite with an in-memory database. It's fast, requires no setup, and supports all Jade features.",
      },
      {
        type: "code",
        language: "lua",
        code: `-- test setup
local jade = require("jade")
jade.configure({
    database = { driver = "sqlite", database = ":memory:" }
})

local entities = jade.loadEntities("schema/models.jade")
jade.syncSchema("schema/models.jade")

-- Test with busted
local busted = require("busted")
describe("User", function()
    it("creates a user", function()
        local user = entities.User:create({ name = "Test" })
        assert.is_not_nil(user.id)
    end)

    it("validates required fields", function()
        assert.has_error(function()
            entities.User:create({})
        end)
    end)
end)`,
      },
    ],
  },
  {
    id: "plugins",
    title: "Plugins",
    description: "Extend Jade with plugins.",
    content: [
      {
        type: "paragraph",
        text: "Jade has a plugin system that lets you add features without modifying the core. Plugins can add entity methods, hooks, and behaviors.",
      },
      { type: "heading", text: "Built-in Plugins", level: 3 },
      {
        type: "table",
        headers: ["Plugin", "Description"],
        rows: [
          ["soft-delete", "Soft delete with deleted_at"],
          ["audit", "Audit logging for changes"],
          ["cache", "Query result caching"],
          ["encryption", "Field-level encryption"],
          ["optimistic-lock", "Optimistic locking with version"],
        ],
      },
      {
        type: "code",
        language: "lua",
        code: `-- Use a plugin
jade.use(require("jade.plugin.soft_delete"))
jade.use(require("jade.plugin.cache"), { ttl = 300 })

-- Or configure in jade.config.lua
return {
    database = { ... },
    plugins = {
        { name = "soft-delete" },
        { name = "cache", ttl = 300 },
        { name = "audit" },
    },
}`,
      },
    ],
  },
];
