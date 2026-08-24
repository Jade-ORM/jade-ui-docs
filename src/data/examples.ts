export interface Example {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

export const examples: Example[] = [
  {
    id: "crud",
    title: "CRUD Operations",
    description: "Create, Read, Update, and Delete records.",
    language: "lua",
    code: `-- CREATE
local user = User:create({
  name = "Lucas",
  email = "lucas@email.com",
  active = true
})

-- READ
local user = User:find(1)
local users = User:where(User.active:eq(true)):get()
local first = User:first()

-- UPDATE
user:update({ name: "Lucas Santos" })
-- or
User:update(1, { name: "Lucas Santos" })

-- DELETE
user:delete()
-- or
User:delete(1)`,
  },
  {
    id: "query-builder",
    title: "Query Builder",
    description: "Build complex queries with chaining.",
    language: "lua",
    code: `-- Complex query with multiple conditions
local users = User:where(User.age:gt(18))
  :where(User.active:eq(true))
  :where(User.role:neq("banned"))
  :orderBy(User.name)
  :limit(10)
  :offset(20)
  :get()

-- Pagination
local page = User:paginate({ page = 2, perPage = 20 })
-- page.items, page.total, page.lastPage

-- Aggregates
local count = User:where(User.active:eq(true)):count()
local avgAge = User:average("age")
local totalViews = Post:sum("views")`,
  },
  {
    id: "relations",
    title: "Relations",
    description: "Work with related entities.",
    language: "lua",
    code: `-- Define relations
User:hasMany(Post)
Post:belongsTo(User)
User:hasOne(Profile)

-- Eager loading (N+1 prevention)
local posts = Post:include("author"):get()
local users = User:include("posts"):include("profile"):get()

-- Lazy loading
local user = User:find(1)
local posts = user.posts:load()`,
  },
  {
    id: "transactions",
    title: "Transactions",
    description: "Atomic operations with automatic rollback.",
    language: "lua",
    code: `-- Transaction with auto-commit/rollback
jade.transaction.run(jade.driver(), function(tx)
  local user = User:create({ name = "Lucas" })
  Post:create({ title = "Hello", author_id = user.id })
  -- If any error occurs, both operations are rolled back
end)

-- With error handling
local ok, err = pcall(function()
  jade.transaction.run(jade.driver(), function(tx)
    User:create({ name = "Lucas" })
    Post:create({ title = "Hello", author_id = 999 })
  end)
end)`,
  },
  {
    id: "encryption",
    title: "Encryption",
    description: "Encrypt sensitive data at rest.",
    language: "lua",
    code: `-- Database-native encryption (PostgreSQL/MySQL)
jade.Encryption.configure({ key = "secret-key" })

local User = jade.Entity("users", {
  email = jade.String(255):encrypted(),
  ssn = jade.String(11):encrypted(),
})

-- Custom encryption with separate files
jade.Encryption.configure({
  key = "secret-key",
  algorithm = "custom",
  encrypt_file = "encryption/encrypt.lua",
  decrypt_file = "encryption/decrypt.lua",
})`,
  },
  {
    id: "validations",
    title: "Validations",
    description: "Validate data before saving.",
    language: "lua",
    code: `-- Define validations
User:validatePresenceOf("name")
User:validatePresenceOf("email")
User:validateUniquenessOf("email")
User:validateLengthOf("name", { min = 2, max = 120 })
User:validateFormatOf("email", { pattern = "^[%w%.]+@[%w%.]+$" })
User:validateInclusionOf("role", { values = {"admin", "user"} })
User:validateNumericalityOf("age", { integer_only = true })

-- Custom validation
User:validateCustom("email", function(value, data)
  return value:match("@example%.com$") ~= nil
end, "Must be from example.com")`,
  },
  {
    id: "callbacks",
    title: "Callbacks",
    description: "Hook into entity lifecycle events.",
    language: "lua",
    code: `-- Before/after hooks
User:beforeCreate(function(instance, data)
  data.created_by = currentUser.id
end)

User:afterCreate(function(instance, data)
  AuditLog:log("User created: " .. instance.name)
end)

User:beforeUpdate(function(instance, data)
  data.updated_at = os.time()
end)

User:afterDelete(function(instance, data)
  Cache:invalidate("user:" .. instance.id)
end)`,
  },
  {
    id: "soft-delete",
    title: "Soft Delete",
    description: "Mark records as deleted without removing them.",
    language: "lua",
    code: `-- Enable soft delete
local User = jade.Entity("users", {
  id = jade.Integer():primaryKey(),
  name = jade.String(120),
}):softDelete()

-- Delete sets deleted_at
User:where(User.id:eq(1)):delete()

-- Query non-deleted (default)
User:get()

-- Include soft-deleted
User:withTrashed():get()

-- Only soft-deleted
User:onlyTrashed():get()

-- Force delete (actually remove)
User:where(User.id:eq(1)):forceDelete()`,
  },
];
