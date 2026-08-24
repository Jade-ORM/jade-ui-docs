import type { DocSection } from "./docs-v1.3";

export const docsSectionsV1_0: DocSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    description: "What is Jade and why you should use it.",
    content: [
      {
        type: "paragraph",
        text: "Jade is a Lua ORM that maps your database tables to Lua objects.",
      },
      {
        type: "list",
        items: [
          "**Schema is truth.** Your database structure is defined in Lua code.",
          "**SQL is visible.** Every operation can be audited.",
          "**Migrations are deterministic.** No surprise schema changes.",
        ],
      },
    ],
  },
  {
    id: "installation",
    title: "Installation",
    description: "How to install Jade.",
    content: [
      { type: "heading", text: "Via LuaRocks", level: 3 },
      { type: "code", code: "luarocks install jade", language: "bash" },
      { type: "heading", text: "Requirements", level: 3 },
      {
        type: "list",
        items: [
          "Lua 5.1, 5.2, 5.3, 5.4, or LuaJIT",
          "PostgreSQL (other drivers coming soon)",
        ],
      },
    ],
  },
  {
    id: "quick-start",
    title: "Quick Start",
    description: "Get up and running with Jade.",
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
    database = "myapp"
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
user:update({ name = "New Name" })

-- Delete
user:delete()`,
      },
    ],
  },
  {
    id: "schema",
    title: "Schema",
    description: "Column types and modifiers.",
    content: [
      {
        type: "code",
        language: "lua",
        code: `jade.String(120)      -- VARCHAR(120)
jade.Text()           -- TEXT
jade.Integer()        -- INTEGER
jade.Float()          -- FLOAT
jade.Decimal(10, 2)   -- DECIMAL(10,2)
jade.Boolean()        -- BOOLEAN
jade.Timestamp()      -- TIMESTAMPTZ
jade.Date()           -- DATE
jade.UUID()           -- UUID`,
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
        code: `Post:belongsTo(User)
User:hasMany(Post)

-- Eager loading
local posts = Post:include("author"):get()`,
      },
    ],
  },
  {
    id: "migrations",
    title: "Migrations",
    description: "Manage your database schema changes.",
    content: [
      {
        type: "code",
        language: "bash",
        code: `esmeralda generate
esmeralda migrate
esmeralda migrate rollback`,
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
  print(err.code)    -- J1016
  print(err.message)
end`,
      },
    ],
  },
];
