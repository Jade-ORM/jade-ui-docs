export interface NavItem {
  href: string;
  label: string;
  labelKey: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { href: "/docs", label: "Docs", labelKey: "nav.docs" },
  { href: "/api", label: "API", labelKey: "nav.api" },
  { href: "/examples", label: "Examples", labelKey: "nav.examples" },
  { href: "/plugins", label: "Plugins", labelKey: "nav.plugins" },
];

export const docsSidebar: NavItem[] = [
  {
    href: "/docs/introduction",
    label: "Getting Started",
    labelKey: "sidebar.gettingStarted",
    children: [
      {
        href: "/docs/introduction",
        label: "Introduction",
        labelKey: "sidebar.introduction",
      },
      {
        href: "/docs/installation",
        label: "Installation",
        labelKey: "sidebar.installation",
      },
      {
        href: "/docs/quick-start",
        label: "Quick Start",
        labelKey: "sidebar.quickStart",
      },
      {
        href: "/docs/configuration",
        label: "Configuration",
        labelKey: "sidebar.configuration",
      },
    ],
  },
  {
    href: "/docs/schema",
    label: "Schema",
    labelKey: "sidebar.schema",
    children: [
      { href: "/docs/schema", label: "Overview", labelKey: "sidebar.overview" },
      {
        href: "/docs/column-types",
        label: "Column Types",
        labelKey: "sidebar.columnTypes",
      },
      {
        href: "/docs/column-modifiers",
        label: "Column Modifiers",
        labelKey: "sidebar.columnModifiers",
      },
    ],
  },
  {
    href: "/docs/relations",
    label: "Relations",
    labelKey: "sidebar.relations",
    children: [
      {
        href: "/docs/relations",
        label: "Overview",
        labelKey: "sidebar.overview",
      },
      {
        href: "/docs/nested-creates",
        label: "Nested Creates",
        labelKey: "sidebar.nestedCreates",
      },
    ],
  },
  {
    href: "/docs/query-builder",
    label: "Query Builder",
    labelKey: "sidebar.queryBuilder",
    children: [
      {
        href: "/docs/query-builder",
        label: "Overview",
        labelKey: "sidebar.overview",
      },
    ],
  },
  {
    href: "/docs/encryption",
    label: "Security",
    labelKey: "sidebar.security",
    children: [
      {
        href: "/docs/encryption",
        label: "Encryption",
        labelKey: "sidebar.encryption",
      },
      {
        href: "/docs/security",
        label: "Security Features",
        labelKey: "sidebar.securityFeatures",
      },
    ],
  },
  {
    href: "/docs/migrations",
    label: "Migrations",
    labelKey: "sidebar.migrations",
    children: [
      {
        href: "/docs/migrations",
        label: "Overview",
        labelKey: "sidebar.overview",
      },
      { href: "/docs/cli", label: "CLI (Esmeralda)", labelKey: "sidebar.cli" },
    ],
  },
  {
    href: "/docs/transactions",
    label: "Advanced",
    labelKey: "sidebar.advanced",
    children: [
      {
        href: "/docs/transactions",
        label: "Transactions",
        labelKey: "sidebar.transactions",
      },
      {
        href: "/docs/callbacks",
        label: "Callbacks",
        labelKey: "sidebar.callbacks",
      },
      {
        href: "/docs/validations",
        label: "Validations",
        labelKey: "sidebar.validations",
      },
      {
        href: "/docs/soft-delete",
        label: "Soft Delete",
        labelKey: "sidebar.softDelete",
      },
    ],
  },
  {
    href: "/docs/linter",
    label: "Linter",
    labelKey: "sidebar.linter",
    children: [
      {
        href: "/docs/linter",
        label: "Linter (VS Code)",
        labelKey: "sidebar.linterVscode",
      },
    ],
  },
  {
    href: "/docs/error-codes",
    label: "Reference",
    labelKey: "sidebar.reference",
    children: [
      {
        href: "/docs/error-codes",
        label: "Error Codes",
        labelKey: "sidebar.errorCodes",
      },
      { href: "/docs/testing", label: "Testing", labelKey: "sidebar.testing" },
    ],
  },
  {
    href: "/plugins",
    label: "Plugins",
    labelKey: "sidebar.plugins",
    children: [
      {
        href: "/plugins",
        label: "Creating Plugins",
        labelKey: "sidebar.creatingPlugins",
      },
    ],
  },
];
