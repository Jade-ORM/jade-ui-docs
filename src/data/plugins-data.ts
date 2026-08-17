export interface PluginExample {
  id: string
  title: string
  description: string
  code: string
  language: string
}

export const pluginExamples: PluginExample[] = [
  {
    id: 'basic-plugin',
    title: 'Plugin Básico',
    description: 'Um plugin mínimo seguindo o contrato padrão.',
    language: 'lua',
    code: `local M = {}

M.name        = "meu-plugin"
M.version     = "1.0.0"
M.description = "Meu plugin personalizado para Jade"

-- Hooks opcionais (registrados automaticamente no loader)
M.hooks = {
    beforeQuery  = function(ctx) print("Query:", ctx.sql) end,
    afterCreate  = function(ctx) print("Criado:", ctx.entity._table) end,
}

--- Setup é chamado quando o plugin é instalado.
--- @param jade table   API do módulo jade/plugin
--- @param opts table   Opções passadas via config
--- @return boolean ok
function M.setup(jade, opts)
    -- lógica de instalação aqui
    return true
end

--- Teardown é chamado ao desinstalar o plugin.
--- @param jade table
function M.teardown(jade)
    -- cleanup se necessário
end

return M`,
  },
  {
    id: 'custom-entity-method',
    title: 'Estender Entidades com Métodos Customizados',
    description: 'Injetar métodos em todas as entidades via hook extendEntity.',
    language: 'lua',
    code: `local M = {}

M.name        = "entity-helpers"
M.version     = "1.0.0"

M.hooks = {
    extendEntity = function(ctx)
        local entity = ctx.entity
        
        -- Adicionar método customizado findOrNew()
        function entity:findOrCreate(condition, defaults)
            local record = self:where(condition):first()
            if record then
                return record
            end
            return self:create(defaults or {})
        end
        
        -- Adicionar método soft count
        function entity:countSoft(query)
            local q = Query.new(self)
            if query then
                for k, v in pairs(query) do
                    q[k] = v
                end
            end
            return q:count()
        end
    end,
}

function M.setup(jade, opts)
    return true
end

function M.teardown(jade)
end

return M

-- Uso:
-- User:findOrCreate({ email = "test@test.com" }, { name = "Test" })
-- User:countSoft() -- count com filtro de trashed`,
  },
  {
    id: 'structured-logging',
    title: 'Logging Estruturado para Queries',
    description: 'Registrar todas as queries executadas com timestamps e métricas.',
    language: 'lua',
    code: `local M = {}

M.name        = "structured-logger"
M.version     = "1.0.0"

local log_stream = nil
local metrics = { queries = 0, errors = 0, total_ms = 0 }

M.hooks = {
    beforeQuery = function(ctx) _log_start(ctx) end,
    afterQuery  = function(ctx) _log_complete(ctx) end,
}

local function _open_log()
    if not log_stream then
        log_stream = io.open("queries.log", "a+")
    end
    return log_stream
end

local function _log_start(ctx)
    local stream = _open_log()
    if stream then
        stream:write(string.format("[START] %s\\n", os.date("!%Y-%m-%dT%H:%M:%SZ")))
    end
    metrics.queries = metrics.queries + 1
end

local function _log_complete(ctx)
    local stream = _open_log()
    if stream then
        stream:write(string.format("[DONE] rows=%d\\n", #ctx.rows or 0))
    end
    metrics.total_ms = metrics.total_ms + 1
end

function M.setup(jade, opts)
    opts = opts or {}
    if opts.level then
        -- configura nível de log: debug, info, warn, error
    end
    return true
end

function M.teardown(jade)
    if log_stream then
        log_stream:close()
    end
end

-- Métricas expostas
M.getMetrics = function()
    return { queries = metrics.queries, errors = metrics.errors }
end

return M`,
  },
  {
    id: 'rate-limiter',
    title: 'Rate Limiting por Entidade',
    description: 'Plugin que limita consultas por segundo por tabela.',
    language: 'lua',
    code: `local M = {}

M.name        = "rate-limiter"
M.version     = "1.0.0"

local rates = {}

M.hooks = {
    beforeQuery = function(ctx) _check_rate(ctx) end,
}

function M.setup(jade, opts)
    opts = opts or {}
    M._default_max = opts.max_requests_per_second or 100
    M._whitelist = opts.whitelist or {}
    return true
end

function M.teardown(jade)
    rates = {}
end

--- Configurar limite customizado por entidade.
--- @param entity table A entity cujo limite será ajustado
--- @param max integer Qtd máxima de queries/segundo
function M.setLimit(entity, max)
    rates[entity._table] = { count = 0, window = os.time(), max = max }
end

local function _check_rate(ctx)
    local entity = ctx.entity
    if not entity or not entity._table then return end
    
    local rate = rates[entity._table] or {}
    local max = rate.max or M._default_max
    
    -- Whitelist? Skip check
    for _, tbl in ipairs(M._whitelist) do
        if tbl == entity._table then return end
    end
    
    local now = os.time()
    if rate.window ~= now then
        rate.window = now
        rate.count = 0
    end
    
    rate.count = rate.count + 1
    if rate.count > max then
        error("Rate limit: " .. tostring(max) .. "/sec for '" .. entity._table .. "'")
    end
    
    rates[entity._table] = rate
end

return M

-- Configuração:
-- { name = "rate-limiter", max_requests_per_second = 50, whitelist = {"logs"} },`,
  },
]
