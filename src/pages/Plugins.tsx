import { pluginExamples } from "../data/plugins-data";
import CodeBlock from "../components/ui/CodeBlock";

export default function Plugins() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Criando Plugins para Jade
      </h1>
      <p className="mb-10 text-zinc-500 dark:text-zinc-400">
        Guia completo para criar extensões modulares que estendem o sistema do
        Jade sem modificar o core.
      </p>

      {/* Interface Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          Interface Padrão
        </h2>
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          Todo plugin segue este contrato mínimo — declare nome, versão e
          opcionalmente hooks + setup.
        </p>
        <CodeBlock
          code={`local M = {}

M.name        = "meu-plugin"         -- Identificador único (obrigatório)
M.version     = "1.0.0"              -- Semver recomendado
M.description = "Descrição curta"    -- Para documentação

-- Hooks opcionais (registrados automaticamente pelo loader)
M.hooks = {
    beforeQuery  = function(ctx) print("SQL:", ctx.sql) end,
    afterCreate  = function(ctx) print("Criado:", ctx.entity._table) end,
    extendEntity = function(ctx)
        local entity = ctx.entity
        -- Adicionar métodos customizados à entidade
        function entity:findOrCreate(cond, defaults)
            local record = self:where(cond):first()
            if record then return record end
            return self:create(defaults or {})
        end
    end,
}

function M.setup(jade, opts)
    -- Instalação: validação, configuração inicial
    return true
end

function M.teardown(jade)
    -- Cleanup ao desinstalar
end

return M`}
          language="lua"
        />
      </section>

      {/* Hook Types Table */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          Hooks Disponíveis
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">
                  Hook
                </th>
                <th className="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">
                  Contexto
                </th>
                <th className="py-2 font-medium text-zinc-700 dark:text-zinc-300">
                  Quando dispara
                </th>
              </tr>
            </thead>
            <tbody className="text-zinc-600 dark:text-zinc-400">
              {[
                ["beforeQuery", "{ sql, bindings }", "Antes de executar query"],
                ["afterQuery", "{ sql, bindings, rows }", "Após execução"],
                ["beforeConnect", "{ config }", "Antes de abrir conexão"],
                [
                  "afterConnect",
                  "{ connection_id }",
                  "Após conexão estabelecida",
                ],
                [
                  "beforeCreate",
                  "{ entity, instance?, data }",
                  "Antes do INSERT",
                ],
                ["afterCreate", "{ entity, instance, data }", "Após INSERT"],
                [
                  "beforeUpdate",
                  "{ entity, instance?, data }",
                  "Antes do UPDATE",
                ],
                ["afterUpdate", "{ entity, instance, data }", "Após UPDATE"],
                ["beforeDelete", "{ entity, instance? }", "Antes do DELETE"],
                ["afterDelete", "{ entity, instance }", "Após DELETE"],
                ["extendEntity", "{ entity }", "Ao criar nova Entity"],
                ["extendQuery", "{ query }", "Ao criar Query builder"],
                ["extendDriver", "{ driver }", "Ao criar Driver instance"],
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-100 dark:border-zinc-800"
                >
                  <td className="py-2 pr-4 font-mono text-emerald-600 dark:text-emerald-400">
                    {row[0]}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs">{row[1]}</td>
                  <td className="py-2">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Configuration */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          Configuração via jade.config.lua
        </h2>
        <CodeBlock
          code={`return {
    database = { ... },
    
    plugins = {
        -- Plugin builtin (carregado via require("jade.plugin."..name))
        { name = "soft-delete" },
        
        -- Plugin com options customizadas
        { name = "cache", ttl = 600, max_size = 2000 },
        { name = "audit", ignore = {"password"} },
        
        -- Plugin externo (do filesystem do projeto)
        {
            name   = "community-plugin",
            source = "external",
            path   = "./plugins",
        },
    }
}`}
          language="lua"
        />
        <div className="mt-4 flex gap-4 text-xs">
          <span className="rounded bg-zinc-100 px-2 py-1 font-mono dark:bg-zinc-800">
            builtin
          </span>
          <span className="text-zinc-500">via require()</span>
          <span className="rounded bg-zinc-100 px-2 py-1 font-mono dark:bg-zinc-800">
            external
          </span>
          <span className="text-zinc-500">caminho local ./plugins</span>
        </div>
      </section>

      {/* Examples */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-white">
          Exemplos Práticos
        </h2>
        <div className="space-y-12">
          {pluginExamples.map((example) => (
            <section key={example.id}>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                {example.title}
              </h3>
              <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                {example.description}
              </p>
              <CodeBlock code={example.code} language={example.language} />
            </section>
          ))}
        </div>
      </section>

      {/* Publishing */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          Publicando como Plugin
        </h2>
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          Estrutura recomendada para distribuição via luarocks:
        </p>
        <pre className="rounded-md bg-zinc-100 p-4 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {`jade-plugin-meuscript/
├── README.md
├── LICENSE
├── lua/jade/plugin/meuscript.lua
└── meuscript-0.1.0-1.rockspec`}
        </pre>
        <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>Para publicar:</p>
          <ol className="mt-2 ml-4 list-inside list-decimal space-y-1">
            <li>Crie o rockspec seguindo o template oficial</li>
            <li>
              <code>luarocks build</code> para testar localmente
            </li>
            <li>
              <code>luarocks upload</code> para publicar no Luarocks
            </li>
            <li>
              Os usuários instalam com{" "}
              <code>luarocks install jade-plugin-meuscript</code>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
