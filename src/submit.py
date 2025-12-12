from fastapi import FastAPI
from pydantic import BaseModel
import cohere
import json
from fastapi.middleware.cors import CORSMiddleware

# Configuração do Cohere
COHERE_API_KEY = ""
co = cohere.Client(api_key=COHERE_API_KEY)

# Tabelas e campos válidos
tables = {
    "tfacr201": ["reca", "amnt", "ninv", "recd"],
    "tbtsli200": ["date", "t    sta", "fire", "cfne"]
}

# Modelo de input
class ScriptRequest(BaseModel):
    script: str 

app = FastAPI()

# Permitir CORS (para frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_script(script: str):
    prompt = f"""
Você é um **validador especialista em Infor LN / Baan 4GL**, com conhecimento avançado em:

- Estrutura de tabelas LN (tc, td, ti, twh, tdpur, tdsls, tcmcs etc.)
- Sintaxe de scripts LN (program scripts, eventos, 4GL, procedures)
- Validação de SELECT, UPDATE, DELETE, INSERT e READ
- Identificação de sessions-based fields, domains e comprimentos
- Identificação de inconsistências de chaves (t$cmpy, t$lnno, t$itno etc.)
- Erros típicos de LN (selectdo/ selectempty / selectnodat, enddo, endif, endselect)
- Lógica de tabelas por módulo (Compras, Vendas, Manufatura, Estoque, Financeiro)
- Prefixos e estrutura de tabelas: "tc" = common, "td" = logistics, "ti" = finance, "twh" = warehouse, etc.
- Campos padrão LN: t$cmps, t$fire, t$indt, t$odat, t$pono, t$item, t$seqn, t$line
- Scripts que geram relatórios (como txpdm****), triggers e regras de negócio

Use SOMENTE as tabelas e campos abaixo como referência autorizada:


{json.dumps(tables, indent=4)}

Analise o script LN abaixo:

{script}

Sua análise deve ser extremamente técnica e objetiva.
Responda **APENAS**:

1. **Erros de sintaxe detectados**
   - Estrutura 4GL incorreta
   - Falta de enddo / endif / endselect
   - SELECTDO / SELECTEMPTY mal fechados
   - Variáveis não definidas
   - Erros de concatenação, escaped strings etc.

2. **Tabelas ou campos inexistentes**
   - Campos fora do domínio LN
   - Tabelas não reconhecidas no catálogo fornecido
   - Nomes com prefixo incorreto (ex: tdpur em vez de tdpur0*)

3. **Problemas de estrutura e lógica**
   - JOIN incorreto ou impossível no LN
   - Falta de WHERE em UPDATE/DELETE
   - Uso incorreto de índices
   - Falta de leitura de chave obrigatória
   - Tentativa de escrita em tabela protegida

4. **Recomendações de correção**
   - Sugira resolução clara e objetiva para cada erro
   - Se possível, recomende boas práticas de LN
   - Sugira uso correto de chaves primárias conforme tabela

5. **Versão corrigida do script**
   - Reescreva o código 4GL funcionando
   - Preserve a lógica original
   - Garanta compatibilidade com Infor LN (tanto on-prem como CE)

IMPORTANTE:
- NÃO adicione nada que não esteja no catálogo de tabelas informado.
- NÃO invente campos LN.
- NÃO altere a lógica do script exceto para corrigir erros.
- Seja técnico, preciso e direto.
"""

    response = co.chat(
        model="command-a-03-2025",
        message=prompt,
        temperature=0.1
    )
    return response.text

@app.post("/analyze")
async def analyze(request: ScriptRequest):
    result = analyze_script(request.script)
    return {"analysis": result}
