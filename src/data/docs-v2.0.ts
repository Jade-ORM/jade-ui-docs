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

export const docsSectionsV2_0: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    description: "What is Jade and why you should use it.",
    content: [
      {
        type: "paragraph",
        text: "Jade v2 is a Data Mapper ORM for Lua 5.1+. It maps your database tables to Lua objects with a declarative `.jade` schema, Esmeralda DX (generate → migrate dev), typed `J####` errors, and a fluent query builder. Runtime messages are English-only.",
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
    description: "Install Jade 2.0.0 and its requirements.",
    content: [
      { type: "heading", text: "Install Jade 2.0.0", level: 3 },
      {
        type: "code",
        code: `# Latest 2.x (LuaRocks)
luarocks install jade

# Pin the 2.0.0 release
luarocks install jade 2.0.0`,
        language: "bash",
      },
      {
        type: "callout",
        variant: "info",
        text: "Jade v2.0.0 is the current stable baseline (typed J#### errors, English-only runtime, no jade.i18n). Release notes: github.com/Jade-ORM/jade-orm-core/releases/tag/v2.0.0",
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
    description: "Canonical Jade v2 flow with Esmeralda.",
    content: [
      {
        type: "paragraph",
        text: "One schema file drives everything: edit schema/models.jade, generate models + migration, apply with migrate dev, then require the lazy barrel.",
      },
      { type: "heading", text: "1. Initialize project", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `npm install -g @alehandrosv/esmeralda-cli

esmeralda init my-app
cd my-app`,
      },
      {
        type: "list",
        items: [
          "`jade.config.lua` — database connection",
          "`schema/models.jade` — single source of truth",
          "`migrations/` — generated migration files",
          "`esmeralda-state.json` — commitable schema snapshot",
        ],
      },
      { type: "heading", text: "2. Edit schema/models.jade", level: 3 },
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
      { type: "heading", text: "3. Generate models + migration", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `esmeralda generate
# jade/generated/User.lua
# jade/generated/Post.lua
# jade/generated/init.lua   (lazy barrel)
# migrations/<ts>_create_tables.lua
# esmeralda-state.json updated`,
      },
      { type: "heading", text: "4. Apply migrations", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `esmeralda migrate dev
# prefer migrate dev in day-to-day development
# esmeralda migrate also works as root alias`,
      },
      { type: "heading", text: "5. Use models in Lua", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local jade = require("jade")
local config = require("jade.config").load()
jade.configure(config)

local Models = require("jade.generated")
local User = Models.User
local Post = Models.Post

local user = User:create({
  name = "Alice",
  email = "alice@example.com",
})

local admins = User:where(User.role:eq("admin")):get()
local page = User:paginate({ page = 1, per_page = 20 })

user:update({ name = "Alice Silva" })
user:delete()`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "Barrel is lazy: only the models you touch are loaded. Force full enumeration by iterating Models if needed.",
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
    description: "Versioned schema changes via Esmeralda.",
    content: [
      {
        type: "paragraph",
        text: "Migrations are versioned scripts generated from schema/models.jade. Apply with migrate dev; always available with --preview so SQL stays visible.",
      },
      { type: "heading", text: "Day-to-day flow", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `# 1. Edit schema/models.jade
# 2. Emit models + migration
esmeralda generate

# 3. Apply in development
esmeralda migrate dev

# Inspect
esmeralda migrate status
esmeralda generate --preview   # SQL without writing a file`,
      },
      { type: "heading", text: "Rollback", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `esmeralda migrate rollback
esmeralda migrate rollback --steps 3`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "Prefer generate + migrate dev over writing migration files by hand. Use migrate create only for custom SQL bridges.",
      },
    ],
  },
  {
    id: "cli",
    title: "CLI (Esmeralda)",
    description:
      "Public CLI surface for Jade v2 — state file, barrel, migrate dev, experimental pull.",
    content: [
      {
        type: "paragraph",
        text: "Esmeralda is the official CLI for Jade. Keep the surface small: init → generate → migrate dev. Pull is experimental.",
      },
      { type: "heading", text: "Commands", level: 3 },
      {
        type: "table",
        headers: ["Command", "Role"],
        rows: [
          [
            "esmeralda init",
            "Scaffold project, report Lua/Jade/Esmeralda versions, write esmeralda-state.json",
          ],
          [
            "esmeralda generate",
            "Emit jade/generated/*.lua + lazy barrel + migration from .jade",
          ],
          [
            "esmeralda migrate dev",
            "Apply pending migrations (preferred day-to-day entrypoint)",
          ],
          ["esmeralda migrate", "Same as migrate dev (root alias)"],
          ["esmeralda migrate status", "Applied vs pending"],
          ["esmeralda migrate create <name>", "Empty migration file"],
          [
            "esmeralda migrate rollback [--steps N]",
            "Revert last migration(s)",
          ],
          [
            "esmeralda pull",
            "Experimental — introspect DB → .jade + baseline migration",
          ],
        ],
      },
      { type: "heading", text: "State file", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `esmeralda-state.json   # commitable schema snapshot (no leading dot)
# legacy .esmeralda-state.json is migrated on load`,
      },
      { type: "heading", text: "Barrel output", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local Models = require("jade.generated")
local User = Models.User`,
      },
      {
        type: "callout",
        variant: "warning",
        text: "esmeralda pull is experimental until .jade ↔ DB round-trip is stable. Primary path: write .jade, then generate.",
      },
      { type: "heading", text: "Examples", level: 3 },
      {
        type: "code",
        language: "bash",
        code: `esmeralda init my-app
esmeralda generate
esmeralda generate --preview
esmeralda migrate dev
esmeralda migrate status
esmeralda pull -d analytics`,
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
    id: "breaking-changes",
    title: "Breaking Changes (v2)",
    description: "What moved between Jade 1.x and 2.0.",
    content: [
      {
        type: "paragraph",
        text: "Jade v2.0.0 is English-only at runtime, uses typed J#### errors, and standardizes on the Esmeralda DX (one .jade schema, generated barrel).",
      },
      { type: "heading", text: "Removed", level: 3 },
      {
        type: "list",
        items: [
          "**Runtime i18n** — `Jade.i18n` / `locale` configuration removed. Core messages and logs are English. Docs and Linter UI may still translate the interface.",
          "Legacy `CONN_001`-style error codes — replaced by `J####` in `jade.errors`.",
        ],
      },
      { type: "heading", text: "Public API", level: 3 },
      {
        type: "list",
        items: [
          "**`Jade.errors` is public** — codes, `raise`, `build`, `getMessage`, `classifyDriverError`.",
          '**Catch pattern** — `type(err) == "table" and err.code` for typed errors; `err:toJSON()` for structured payloads.',
        ],
      },
      { type: "heading", text: "Canonical consumption", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `-- v1.x (outdated)
-- local entities = jade.loadEntities("schema/models.jade")

-- v2 (canonical)
local Models = require("jade.generated")
local User = Models.User`,
      },
      { type: "heading", text: "Migrations", level: 3 },
      {
        type: "list",
        items: [
          "Migration tracker is **per-migration and portable** (PostgreSQL, MySQL, SQLite). Each migration is recorded inside its own transaction.",
          "Prefer `esmeralda migrate dev` over bare `esmeralda migrate`.",
          "`esmeralda-state.json` is the commitable snapshot (no leading dot).",
          "`esmeralda pull` is experimental (introspection → .jade).",
        ],
      },
      { type: "heading", text: "Plugin authors", level: 3 },
      {
        type: "list",
        items: [
          "`unloadPlugin` actually clears CRUD/query hooks registered by the plugin (no longer a no-op).",
          "`extendEntity` context now receives the real per-plugin install options (previously `{}`).",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not document or rely on runtime locale switching. Site language switcher only affects this documentation UI.",
      },
    ],
  },
  {
    id: "error-codes",
    title: "Error Codes",
    description:
      "Typed J#### catalog from jade.errors (English-only runtime messages).",
    content: [
      {
        type: "paragraph",
        text: "Jade v2 raises typed errors with a stable `J####` code, English message, and structured details. There is no runtime i18n for errors — translate in your app if needed.",
      },
      { type: "heading", text: "Catching errors", level: 3 },
      {
        type: "code",
        language: "lua",
        code: `local jade = require("jade")

-- Prefer a pcall around any operation that can raise a Jade error
local ok, err = pcall(function()
  local user = Models.User:find(999)
  assert(user, "user not found")
  user:update({ email = "invalid" })
end)

if not ok then
  -- Typed Jade errors are tables with .code
  if type(err) == "table" and err.code then
    print(err.code, err.message)
    -- e.g. J1008 / J1016 / J0002
    -- print(err:toJSON())
  else
    error(err) -- non-Jade error
  end
end`,
      },
      {
        type: "callout",
        variant: "info",
        text: "Source of truth: jade/src/jade/errors/init.lua. Driver native errors are classified into J#### via jade.errors.classifyDriverError.",
      },
      { type: "heading", text: "Catalog", level: 3 },
      {
        type: "table",
        headers: ["Code", "Category", "Constant", "Description"],
        rows: [
          [
            "J0001",
            "Connection",
            "AUTHENTICATION_FAILED",
            "Authentication failed against the database server",
          ],
          [
            "J0002",
            "Connection",
            "CONNECTION_REFUSED",
            "Can't reach database server",
          ],
          ["J0003", "Connection", "CONNECTION_TIMEOUT", "Connection timed out"],
          [
            "J0004",
            "Connection",
            "DATABASE_NOT_FOUND",
            "Database does not exist on the server",
          ],
          [
            "J0005",
            "Connection",
            "CONFIG_MISSING",
            "Configuration file not found",
          ],
          ["J0006", "Connection", "CONFIG_INVALID", "Invalid configuration"],
          [
            "J0007",
            "Connection",
            "DRIVER_NOT_FOUND",
            "Database driver not found",
          ],
          [
            "J0008",
            "Connection",
            "DRIVER_NOT_SUPPORTED",
            "Driver not supported for this operation",
          ],
          [
            "J0009",
            "Connection",
            "CONNECTION_POOL_EXHAUSTED",
            "Connection pool exhausted",
          ],
          [
            "J0010",
            "Connection",
            "TLS_ERROR",
            "Error establishing TLS connection",
          ],
          ["J1000", "Query", "QUERY_SYNTAX_ERROR", "Query syntax error"],
          ["J1001", "Query", "QUERY_TIMEOUT", "Query timed out"],
          [
            "J1002",
            "Query",
            "QUERY_TOO_COMPLEX",
            "Query too complex to process",
          ],
          [
            "J1003",
            "Query",
            "COLUMN_NOT_FOUND",
            "Column does not exist in table",
          ],
          [
            "J1004",
            "Query",
            "TABLE_NOT_FOUND",
            "Table does not exist in the database",
          ],
          ["J1005", "Query", "VALUE_TOO_LONG", "Value too long for column"],
          ["J1006", "Query", "TYPE_MISMATCH", "Invalid type for field"],
          [
            "J1007",
            "Query",
            "MISSING_REQUIRED_FIELD",
            "Required field not provided",
          ],
          ["J1008", "Query", "NO_ROWS_FOUND", "No records found"],
          [
            "J1009",
            "Query",
            "MULTIPLE_ROWS_FOUND",
            "Multiple records found when one was expected",
          ],
          ["J1010", "Query", "INSERT_FAILED", "Failed to insert record"],
          ["J1011", "Query", "UPDATE_FAILED", "Failed to update record"],
          ["J1012", "Query", "DELETE_FAILED", "Failed to delete record"],
          ["J1013", "Query", "RAW_QUERY_FAILED", "Raw query failed"],
          ["J1014", "Query", "RESULT_SET_TOO_LARGE", "Result set too large"],
          [
            "J1015",
            "Query",
            "NULL_CONSTRAINT_VIOLATION",
            "NULL constraint violation",
          ],
          [
            "J1016",
            "Query",
            "UNIQUE_CONSTRAINT_VIOLATION",
            "Unique constraint violation",
          ],
          [
            "J1017",
            "Query",
            "FOREIGN_KEY_VIOLATION",
            "Foreign key constraint violation",
          ],
          [
            "J1018",
            "Query",
            "CHECK_CONSTRAINT_VIOLATION",
            "CHECK constraint violation",
          ],
          ["J1019", "Query", "DATA_VALIDATION_ERROR", "Data validation error"],
          [
            "J1020",
            "Query",
            "VALUE_OUT_OF_RANGE",
            "Value out of range for type",
          ],
          [
            "J2000",
            "Migration",
            "MIGRATION_FAILED",
            "Failed to execute migration",
          ],
          [
            "J2001",
            "Migration",
            "MIGRATION_ROLLBACK_FAILED",
            "Failed to rollback migration",
          ],
          [
            "J2002",
            "Migration",
            "MIGRATION_ALREADY_APPLIED",
            "Migration has already been applied",
          ],
          ["J2003", "Migration", "MIGRATION_NOT_FOUND", "Migration not found"],
          [
            "J2004",
            "Migration",
            "MIGRATION_FILE_INVALID",
            "Invalid migration file",
          ],
          [
            "J2005",
            "Migration",
            "MIGRATION_TABLE_NOT_FOUND",
            "Migration tracking table not found",
          ],
          [
            "J2006",
            "Migration",
            "MIGRATION_LOCKED",
            "Migration locked by another operation",
          ],
          [
            "J2007",
            "Migration",
            "MIGRATION_DEPENDENCY_MISSING",
            "Required migration has not been applied",
          ],
          [
            "J2008",
            "Migration",
            "DESTRUCTIVE_MIGRATION",
            "Migration may cause data loss",
          ],
          ["J2009", "Migration", "SCHEMA_INCONSISTENT", "Inconsistent schema"],
          [
            "J2010",
            "Migration",
            "SHADOW_DATABASE_ERROR",
            "Shadow database error",
          ],
          [
            "J3000",
            "Introspection",
            "INTROSPECTION_FAILED",
            "Failed to introspect database",
          ],
          [
            "J3001",
            "Introspection",
            "DATABASE_EMPTY",
            "Introspected database is empty",
          ],
          [
            "J3002",
            "Introspection",
            "SCHEMA_INCONSISTENT_INTROSPECTION",
            "Inconsistent database schema",
          ],
          [
            "J3003",
            "Introspection",
            "UNSUPPORTED_TYPE",
            "Type not supported for introspection",
          ],
          [
            "J3004",
            "Introspection",
            "CONVERSION_FAILED",
            "Failed to convert database schema",
          ],
          [
            "J4004",
            "Integrity",
            "PRIMARY_KEY_VIOLATION",
            "PRIMARY KEY violation",
          ],
          [
            "J4005",
            "Integrity",
            "CONCURRENT_UPDATE",
            "Concurrent update conflict",
          ],
          ["J4006", "Integrity", "TRANSACTION_FAILED", "Transaction failed"],
          ["J4007", "Integrity", "DEADLOCK_DETECTED", "Deadlock detected"],
          [
            "J5000",
            "Security",
            "SQL_INJECTION_DETECTED",
            "SQL injection attempt detected",
          ],
          [
            "J5001",
            "Security",
            "INVALID_IDENTIFIER",
            "Invalid identifier (possible injection)",
          ],
          [
            "J5002",
            "Security",
            "QUERY_TOO_LONG",
            "Query exceeds maximum length",
          ],
          ["J5003", "Security", "TOO_MANY_PARAMETERS", "Too many parameters"],
          ["J5004", "Security", "INVALID_INPUT", "Invalid input"],
          [
            "J5005",
            "Security",
            "INPUT_TOO_LONG",
            "Input exceeds maximum length",
          ],
          ["J5006", "Security", "RATE_LIMIT_EXCEEDED", "Rate limit exceeded"],
          ["J5007", "Security", "UNAUTHORIZED_ACCESS", "Unauthorized access"],
          [
            "J5008",
            "Security",
            "PERMISSION_DENIED",
            "Permission denied for this operation",
          ],
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

jade.syncSchema("schema/models.jade")
local Models = require("jade.generated")
local User = Models.User

-- Test with busted
local busted = require("busted")
describe("User", function()
    it("creates a user", function()
        local user = User:create({ name = "Test" })
        assert.is_not_nil(user.id)
    end)

    it("validates required fields", function()
        assert.has_error(function()
            User:create({})
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
        text: "Jade has a plugin system that lets you add features without modifying the core. Plugins can add entity methods, hooks, and behaviors. Install options now reach extendEntity; unloadPlugin really clears hooks.",
      },
      { type: "heading", text: "Official plugins", level: 3 },
      {
        type: "paragraph",
        text: "Browse and install the official set from Jade-ORM/plugins registry.json (also listed on /plugins in this site). Community plugins self-publish via the Docs portal — no PR to the registry.",
      },
      {
        type: "table",
        headers: ["Plugin", "core_module", "Description"],
        rows: [
          [
            "cache",
            "jade.plugin.cache",
            "In-memory query result cache with TTL",
          ],
          [
            "soft-delete",
            "jade.plugin.soft_delete",
            "Soft delete via entity hooks",
          ],
          [
            "timestamps",
            "jade.plugin.timestamps",
            "Automatic created_at / updated_at",
          ],
          [
            "tenant",
            "jade.plugin.tenant",
            "Automatic tenant_id injection on create",
          ],
          [
            "sql-log",
            "jade.plugin.sql_log",
            "Log SQL queries through jade.log",
          ],
          [
            "optimistic-lock",
            "jade.plugin.optimistic_lock",
            "Optimistic concurrency with version column",
          ],
          ["audit", "jade.plugin.audit", "Audit trail logging for entity CRUD"],
          [
            "encryption",
            "jade.plugin.encryption",
            "Field-level encryption (DB-native or custom)",
          ],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "callbacks is a core-only builtin (wired in Entity.new) — not an official registry plugin.",
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
      {
        type: "link",
        text: "Browse official + community plugins",
        href: "/plugins",
      },
    ],
  },
];
