export const en = {
  // Navigation
  "nav.docs": "Docs",
  "nav.api": "API",
  "nav.examples": "Examples",
  "nav.plugins": "Plugins",
  "nav.github": "GitHub",
  "nav.install": "Install",

  // Home
  "home.title": "ORM for Lua that gets out of your way",
  "home.subtitle":
    "Jade gives you a declarative schema, automatic migrations, and a query builder that feels native to Lua. No magic, no hidden SQL.",
  "home.quickStart": "Quick Start",
  "home.apiReference": "API Reference",

  // Features
  "features.title": "What Jade gives you",
  "features.declarative.title": "Declarative schema",
  "features.declarative.desc":
    "Define your tables in Lua. Jade handles the rest.",
  "features.query.title": "Query builder",
  "features.query.desc":
    "Chain where, orderBy, limit, and paginate. No string concatenation.",
  "features.migrations.title": "Automatic migrations",
  "features.migrations.desc":
    "Schema changes become migration files. Rollback with one command.",
  "features.relations.title": "Relations",
  "features.relations.desc":
    "belongsTo, hasMany, hasOne. Eager and lazy loading.",
  "features.transactions.title": "Transactions",
  "features.transactions.desc": "Auto-commit on success, rollback on error.",
  "features.security.title": "Built-in security",
  "features.security.desc":
    "SQL injection detection, input validation, parameterized queries.",

  // CTA
  "cta.title": "Ready to start?",
  "cta.subtitle": "Install Jade and build your first project in minutes.",
  "cta.readDocs": "Read the docs",

  // Code Example
  "codeExample.title": "Query builder",
  "codeExample.description":
    "Build queries with method chaining. No string interpolation, no SQL injection vectors. Conditions compile to parameterized queries.",
  "codeExample.feature1": "WHERE, ORDER BY, LIMIT, OFFSET",
  "codeExample.feature2": "AND / OR with band() / bor()",
  "codeExample.feature3": "Pagination helper",
  "codeExample.feature4": "Aggregate functions: count, sum, average",

  // API page
  "api.title": "API Reference",
  "api.description": "Complete reference for all Jade methods and operators.",
  "api.entityMethods": "Entity Methods",
  "api.conditionOperators": "Condition Operators",
  "api.returns": "Returns",

  // Examples page
  "examples.title": "Examples",
  "examples.description": "Practical examples for common Jade patterns.",

  // Sidebar
  "sidebar.gettingStarted": "Getting Started",
  "sidebar.introduction": "Introduction",
  "sidebar.installation": "Installation",
  "sidebar.quickStart": "Quick Start",
  "sidebar.configuration": "Configuration",
  "sidebar.schema": "Schema",
  "sidebar.overview": "Overview",
  "sidebar.columnTypes": "Column Types",
  "sidebar.columnModifiers": "Column Modifiers",
  "sidebar.declarativeSchema": "Declarative Schema (.jade)",
  "sidebar.relations": "Relations",
  "sidebar.nestedCreates": "Nested Creates",
  "sidebar.queryBuilder": "Query Builder",
  "sidebar.security": "Security",
  "sidebar.encryption": "Encryption",
  "sidebar.securityFeatures": "Security Features",
  "sidebar.migrations": "Migrations",
  "sidebar.cli": "CLI (Esmeralda)",
  "sidebar.dbPull": "Database Introspection",
  "sidebar.advanced": "Advanced",
  "sidebar.transactions": "Transactions",
  "sidebar.callbacks": "Callbacks",
  "sidebar.validations": "Validations",
  "sidebar.softDelete": "Soft Delete",
  "sidebar.linter": "Linter",
  "sidebar.linterVscode": "Linter (VS Code)",
  "sidebar.luals": "LuaLS Integration",
  "sidebar.reference": "Reference",
  "sidebar.errorCodes": "Error Codes",
  "sidebar.testing": "Testing",
  "sidebar.plugins": "Plugins",
  "sidebar.creatingPlugins": "Author Guide",
  "sidebar.browsePlugins": "Browse & Submit",

  // Plugins marketplace
  "plugins.title": "Plugins",
  "plugins.description":
    "Official plugins ship with Jade. Community plugins are self-published from your own GitHub repository.",
  "plugins.official": "Official",
  "plugins.officialHint": "Maintained in Jade-ORM/plugins",
  "plugins.officialBadge": "official",
  "plugins.community": "Community",
  "plugins.communityHint": "Self-published by authors",
  "plugins.communityBadge": "community",
  "plugins.submit": "Submit plugin",
  "plugins.signIn": "Sign in with GitHub",
  "plugins.signOut": "Sign out",
  "plugins.signInRequired":
    "Sign in with GitHub to list a plugin from your repository.",
  "plugins.submitTitle": "Submit a community plugin",
  "plugins.submitSubtitle":
    "Paste a public GitHub repository that contains jade-plugin.json at the root.",
  "plugins.repoLabel": "Repository URL",
  "plugins.repoHint":
    "Must be github.com/owner/repo. The repo must include a valid jade-plugin.json.",
  "plugins.submitCta": "Publish listing",
  "plugins.submitSuccess": "Your plugin is now listed under Community.",
  "plugins.signedInAs": "Submitting as",
  "plugins.close": "Close",
  "plugins.viewSource": "Source",
  "plugins.viewRepo": "Repository",
  "plugins.refresh": "Refresh",
  "plugins.remove": "Remove",
  "plugins.confirmDelete": "Remove this community listing?",
  "plugins.empty": "No community plugins yet. Be the first to publish one.",
  "plugins.loading": "Loading community plugins…",
  "plugins.errList": "Could not load community plugins. Try again later.",
  "plugins.errUrl": "Enter a valid GitHub repository URL.",
  "plugins.errGeneric": "Something went wrong. Try again.",
  "plugins.authError": "GitHub sign-in failed. Please try again.",
  "plugins.guideToggle": "Author guide — contract, hooks, and examples",
  "plugins.guideContract": "Plugin manifest (jade-plugin.json)",
  "plugins.guideContractDesc":
    "Place this file at the repository root. Jade Docs reads it when you submit.",
  "plugins.guideLua": "Lua module — name, version, and setup are required:",
  "plugins.guideInterface": "Standard Lua interface",
  "plugins.guideInterfaceDesc":
    "Every plugin is a Lua table/module with a minimum contract — name, version, and optionally hooks + setup.",
  "plugins.guideHooks": "Available hooks",
  "plugins.guideExamples": "Practical examples",

  // Footer
  "footer.copyright": "Jade",
};
