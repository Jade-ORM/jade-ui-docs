export const ptBr = {
  // Navigation
  "nav.docs": "Documentação",
  "nav.api": "API",
  "nav.examples": "Exemplos",
  "nav.plugins": "Plugins",
  "nav.github": "GitHub",
  "nav.install": "Instalar",

  // Home
  "home.title": "ORM para Lua que não interfere no seu caminho",
  "home.subtitle":
    "Jade oferece um schema declarativo, migrations automáticas e um query builder que parece nativo do Lua. Sem magia, sem SQL oculto.",
  "home.quickStart": "Início Rápido",
  "home.apiReference": "Referência da API",

  // Features
  "features.title": "O que o Jade oferece",
  "features.declarative.title": "Schema declarativo",
  "features.declarative.desc":
    "Defina suas tabelas em Lua. Jade cuida do resto.",
  "features.query.title": "Query builder",
  "features.query.desc":
    "Encadeie where, orderBy, limit e paginate. Sem concatenação de strings.",
  "features.migrations.title": "Migrations automáticas",
  "features.migrations.desc":
    "Alterações de schema viram arquivos de migration. Rollback com um comando.",
  "features.relations.title": "Relações",
  "features.relations.desc":
    "belongsTo, hasMany, hasOne. Eager e lazy loading.",
  "features.transactions.title": "Transações",
  "features.transactions.desc":
    "Auto-commit em caso de sucesso, rollback em caso de erro.",
  "features.security.title": "Segurança integrada",
  "features.security.desc":
    "Detecção de SQL injection, validação de entrada, queries parametrizadas.",

  // CTA
  "cta.title": "Pronto para começar?",
  "cta.subtitle": "Instale o Jade e construa seu primeiro projeto em minutos.",
  "cta.readDocs": "Ler documentação",

  // Code Example
  "codeExample.title": "Query builder",
  "codeExample.description":
    "Construa queries com encadeamento de métodos. Sem interpolação de strings, sem vetores de SQL injection. Condições compõem queries parametrizadas.",
  "codeExample.feature1": "WHERE, ORDER BY, LIMIT, OFFSET",
  "codeExample.feature2": "AND / OR com band() / bor()",
  "codeExample.feature3": "Helper de paginação",
  "codeExample.feature4": "Funções de agregação: count, sum, average",

  // API page
  "api.title": "Referência da API",
  "api.description":
    "Referência completa de todos os métodos e operadores do Jade.",
  "api.entityMethods": "Métodos de Entidade",
  "api.conditionOperators": "Operadores de Condição",
  "api.returns": "Retorna",

  // Examples page
  "examples.title": "Exemplos",
  "examples.description": "Exemplos práticos para padrões comuns do Jade.",

  // Sidebar
  "sidebar.gettingStarted": "Primeiros Passos",
  "sidebar.introduction": "Introdução",
  "sidebar.installation": "Instalação",
  "sidebar.quickStart": "Início Rápido",
  "sidebar.configuration": "Configuração",
  "sidebar.schema": "Schema",
  "sidebar.overview": "Visão Geral",
  "sidebar.columnTypes": "Tipos de Coluna",
  "sidebar.columnModifiers": "Modificadores de Coluna",
  "sidebar.declarativeSchema": "Schema Declarativo (.jade)",
  "sidebar.relations": "Relações",
  "sidebar.nestedCreates": "Nested Creates",
  "sidebar.queryBuilder": "Query Builder",
  "sidebar.security": "Segurança",
  "sidebar.encryption": "Encriptação",
  "sidebar.securityFeatures": "Recursos de Segurança",
  "sidebar.migrations": "Migrations",
  "sidebar.cli": "CLI (Esmeralda)",
  "sidebar.dbPull": "Introspecção de Banco",
  "sidebar.advanced": "Avançado",
  "sidebar.transactions": "Transações",
  "sidebar.callbacks": "Callbacks",
  "sidebar.validations": "Validações",
  "sidebar.softDelete": "Soft Delete",
  "sidebar.linter": "Linter",
  "sidebar.linterVscode": "Linter (VS Code)",
  "sidebar.luals": "Integração LuaLS",
  "sidebar.reference": "Referência",
  "sidebar.errorCodes": "Códigos de Erro",
  "sidebar.breakingChanges": "Breaking Changes",
  "sidebar.testing": "Testes",
  "sidebar.plugins": "Plugins",
  "sidebar.creatingPlugins": "Guia do Autor",
  "sidebar.browsePlugins": "Explorar e publicar",

  // Plugins marketplace
  "plugins.title": "Plugins",
  "plugins.description":
    "Plugins oficiais acompanham o Jade. Plugins community são auto-publicados a partir do seu repositório GitHub.",
  "plugins.official": "Oficiais",
  "plugins.officialHint": "Mantidos em Jade-ORM/plugins",
  "plugins.officialBadge": "oficial",
  "plugins.community": "Community",
  "plugins.communityHint": "Auto-publicados pelos autores",
  "plugins.communityBadge": "community",
  "plugins.submit": "Publicar plugin",
  "plugins.signIn": "Entrar com GitHub",
  "plugins.signOut": "Sair",
  "plugins.signInRequired":
    "Entre com GitHub para listar um plugin do seu repositório.",
  "plugins.submitTitle": "Publicar um plugin community",
  "plugins.submitSubtitle":
    "Cole a URL de um repositório GitHub público com jade-plugin.json na raiz.",
  "plugins.repoLabel": "URL do repositório",
  "plugins.repoHint":
    "Precisa ser github.com/owner/repo. O repo deve ter um jade-plugin.json válido.",
  "plugins.submitCta": "Publicar listing",
  "plugins.submitSuccess": "Seu plugin já aparece em Community.",
  "plugins.signedInAs": "Publicando como",
  "plugins.close": "Fechar",
  "plugins.viewSource": "Código",
  "plugins.viewRepo": "Repositório",
  "plugins.refresh": "Atualizar",
  "plugins.remove": "Remover",
  "plugins.confirmDelete": "Remover este listing community?",
  "plugins.empty":
    "Ainda não há plugins community. Seja o primeiro a publicar.",
  "plugins.loading": "Carregando plugins community…",
  "plugins.errList":
    "Não foi possível carregar os plugins community. Tente novamente.",
  "plugins.errUrl": "Informe uma URL de repositório GitHub válida.",
  "plugins.errGeneric": "Algo deu errado. Tente novamente.",
  "plugins.authError": "Falha no login com GitHub. Tente novamente.",
  "plugins.guideToggle": "Guia do autor — contrato, hooks e exemplos",
  "plugins.guideContract": "Manifesto do plugin (jade-plugin.json)",
  "plugins.guideContractDesc":
    "Coloque este arquivo na raiz do repositório. O Jade Docs lê ao publicar.",
  "plugins.guideLua": "Módulo Lua — name, version e setup são obrigatórios:",
  "plugins.guideInterface": "Interface Lua padrão",
  "plugins.guideInterfaceDesc":
    "Todo plugin é uma tabela/módulo Lua com contrato mínimo — name, version e opcionalmente hooks + setup.",
  "plugins.guideHooks": "Hooks disponíveis",
  "plugins.guideExamples": "Exemplos práticos",

  // Footer
  "footer.copyright": "Jade",
};
