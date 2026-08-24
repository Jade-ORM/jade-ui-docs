export interface ApiMethod {
  name: string;
  signature: string;
  description: string;
  returns: string;
  example: string;
}

export interface ApiOperator {
  name: string;
  symbol: string;
  description: string;
  example: string;
}

export const entityMethods: ApiMethod[] = [
  {
    name: "find",
    signature: "Entity:find(id | options)",
    description: "Find records. Polymorphic: by ID or with options.",
    returns: "Instance | Instance[] | nil",
    example: `-- By ID
local user = User:find(1)

-- With options
local users = User:find({ where = { active = true } })
local filtered = User:find({ where = { role = "admin" }, orderBy = { name = "asc" }, limit = 10 })`,
  },
  {
    name: "findFirst",
    signature: "Entity:findFirst(options)",
    description: "Find the first matching record.",
    returns: "Instance | nil",
    example: `local admin = User:findFirst({ where = { role = "admin" } })`,
  },
  {
    name: "findFirstOrThrow",
    signature: "Entity:findFirstOrThrow(options)",
    description: "Find the first matching record or throw an error.",
    returns: "Instance",
    example: `local admin = User:findFirstOrThrow({ where = { role = "admin" } })`,
  },
  {
    name: "findUnique",
    signature: "Entity:findUnique(options)",
    description: "Find a record by a unique field.",
    returns: "Instance | nil",
    example: `local user = User:findUnique({ where = { email = "lucas@email.com" } })`,
  },
  {
    name: "findUniqueOrThrow",
    signature: "Entity:findUniqueOrThrow(options)",
    description: "Find a record by a unique field or throw an error.",
    returns: "Instance",
    example: `local user = User:findUniqueOrThrow({ where = { email = "lucas@email.com" } })`,
  },
  {
    name: "first",
    signature: "Entity:first()",
    description: "Get the first record (ordered by primary key).",
    returns: "Instance | nil",
    example: `local user = User:first()`,
  },
  {
    name: "where",
    signature: "Entity:where(condition)",
    description: "Filter records by condition.",
    returns: "Query",
    example: `local users = User:where(User.age:gt(18)):get()`,
  },
  {
    name: "get",
    signature: "Entity:get()",
    description: "Execute the query and return all matching records.",
    returns: "Instance[]",
    example: `local users = User:where(User.active:eq(true)):get()`,
  },
  {
    name: "create",
    signature: "Entity:create(data)",
    description: "Insert a new record and return the instance.",
    returns: "Instance",
    example: `local user = User:create({ name = "Lucas", email = "lucas@email.com" })`,
  },
  {
    name: "update",
    signature: "Entity:update(id | options, data?)",
    description: "Update records. Polymorphic: by ID or with conditions.",
    returns: "Instance | number",
    example: `-- By ID
User:update(1, { name = "New Name" })

-- With conditions
User:update({ where = { role = "user" }, data = { role = "admin" } })`,
  },
  {
    name: "delete",
    signature: "Entity:delete(id | options)",
    description: "Delete records. Polymorphic: by ID or with conditions.",
    returns: "Instance | number",
    example: `-- By ID
User:delete(1)

-- With conditions
User:delete({ where = { active = false } })`,
  },
  {
    name: "count",
    signature: "Entity:count(options?)",
    description: "Count records, optionally with conditions.",
    returns: "number",
    example: `local total = User:count()
local admins = User:count({ where = { role = "admin" } })`,
  },
  {
    name: "exists",
    signature: "Entity:exists(options?)",
    description: "Check if any records match, optionally with conditions.",
    returns: "boolean",
    example: `User:exists({ where = { email = "lucas@email.com" } })`,
  },
  {
    name: "sum",
    signature: "Entity:sum(column)",
    description: "Sum a numeric column.",
    returns: "number",
    example: `local total = Post:sum("views")`,
  },
  {
    name: "average",
    signature: "Entity:average(column)",
    description: "Calculate the average of a numeric column.",
    returns: "number",
    example: `local avg = User:average("age")`,
  },
  {
    name: "min",
    signature: "Entity:min(column)",
    description: "Get the minimum value of a column.",
    returns: "number",
    example: `local youngest = User:min("age")`,
  },
  {
    name: "max",
    signature: "Entity:max(column)",
    description: "Get the maximum value of a column.",
    returns: "number",
    example: `local oldest = User:max("age")`,
  },
  {
    name: "paginate",
    signature: "Entity:paginate(options)",
    description: "Paginate results with page and perPage.",
    returns: "{ items, total, page, perPage, lastPage }",
    example: `local page = User:paginate({ page = 2, perPage = 20 })`,
  },
];

export const conditionOperators: ApiOperator[] = [
  {
    name: "equals",
    symbol: ":eq(value)",
    description: "Equal to",
    example: "User:where(User.age:eq(18))",
  },
  {
    name: "not equals",
    symbol: ":neq(value)",
    description: "Not equal to",
    example: 'User:where(User.role:neq("admin"))',
  },
  {
    name: "greater than",
    symbol: ":gt(value)",
    description: "Greater than",
    example: "User:where(User.age:gt(18))",
  },
  {
    name: "less than",
    symbol: ":lt(value)",
    description: "Less than",
    example: "User:where(User.age:lt(65))",
  },
  {
    name: "greater or equal",
    symbol: ":ge(value)",
    description: "Greater than or equal to",
    example: "User:where(User.age:ge(18))",
  },
  {
    name: "less or equal",
    symbol: ":le(value)",
    description: "Less than or equal to",
    example: "User:where(User.age:le(65))",
  },
  {
    name: "like",
    symbol: ":like(pattern)",
    description: "SQL LIKE pattern match",
    example: 'User:where(User.name:like("%Lucas%"))',
  },
  {
    name: "is null",
    symbol: ":isNull()",
    description: "Check if column is NULL",
    example: "User:where(User.deleted_at:isNull())",
  },
  {
    name: "is not null",
    symbol: ":isNotNull()",
    description: "Check if column is NOT NULL",
    example: "User:where(User.email:isNotNull())",
  },
  {
    name: "in",
    symbol: ":isIn(values)",
    description: "Check if value is in a list",
    example: "User:where(User.id:isIn({1, 2, 3}))",
  },
  {
    name: "between",
    symbol: ":between(min, max)",
    description: "Check if value is between min and max",
    example: "User:where(User.age:between(18, 65))",
  },
];
