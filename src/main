from fastapi import FastAPI
from pydantic import BaseModel
import cohere
import json
from fastapi.middleware.cors import CORSMiddleware

# Configuração do Cohere
COHERE_API_KEY = ""
co = cohere.Client(api_key=COHERE_API_KEY)

# Base de dados expandida de tabelas e campos do Infor LN
tables = {
    # Common Data (tc)
    "tccom100": ["bpid", "nama", "namb", "ccty", "ccit", "pstc", "telp", "cdfx"],
    "tccom130": ["cadr", "nama", "pstc", "ccty", "ccit", "telp"],
    "tcemm030": ["emno", "nama", "ccty", "telf"],
    "tcmcs000": ["cmpy", "nama", "ccty"],
    "tcmcs052": ["dsca", "refr", "loco"],
    
    # Financial (tf/ti)
    "tfacr201": ["reca", "amnt", "ninv", "recd", "balc", "blca", "fire"],
    "tfacp200": ["ttyp", "ninv", "ifbp", "amti", "cmpy"],
    "tfgld010": ["dim", "dcod", "dsca"],
    "tfgld106": ["year", "peri", "amnt", "dcod"],
    
    # Sales (tdsls)
    "tdsls400": ["orno", "sqnb", "pono", "item", "dqua", "qana", "qoor", "dldt"],
    "tdsls401": ["orno", "pono", "dsca", "amnt"],
    "tdsls420": ["orno", "sqnb", "fire"],
    "tdsls094": ["ofbp", "nama"],
    
    # Purchase (tdpur)
    "tdpur400": ["orno", "pono", "sqnb", "item", "qoor", "qidl", "cprt"],
    "tdpur401": ["orno", "pono", "dsca"],
    "tdpur094": ["ofbp", "nama", "ccty"],
    
    # Inventory/Warehouse (twh/ti)
    "twhwmd215": ["item", "cwar", "qhnd", "qall", "qord"],
    "twhwmd400": ["item", "cwar", "sern", "cwar", "fire"],
    "tcibd001": ["item", "dsca", "dscb", "kitm", "csig"],
    "tcibd002": ["item", "cplt", "cpmt"],
    
    # Manufacturing (tipdm)
    "tipdm015": ["item", "cwar", "csig"],
    "tipdm600": ["maun", "stat", "item", "qmog", "pldt"],
    
    # Project (tpppc)
    "tpppc100": ["cprj", "dsca"],
    "tpppc200": ["cprj", "cact", "csub", "dsca"],
    
    # Business Partner (tccom)
    "tccom100": ["bpid", "nama", "seak", "ccty", "telp"],
    
    # Transport (tdtcr)
    "tdtcr940": ["load", "trck", "fire"],
    
    # Service (tisfc)
    "tisfc010": ["cser", "dsca"],
    
    # Sessions Tables (ttstpi)
    "ttstpi010": ["data"],
    "ttstpi030": ["data"],
}

# Campos comuns LN (padrão em múltiplas tabelas)
common_fields = [
    "t$cmpy", "t$fire", "t$user", "t$lnno", "t$seqn", 
    "t$crdt", "t$crby", "t$updt", "t$upby",
    "t$item", "t$pono", "t$orno", "t$sqnb", 
    "t$bpid", "t$cwar", "t$stat"
]

class ScriptRequest(BaseModel):
    script: str 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_script(script: str):
    prompt = f"""
Você é um **validador especialista em Infor LN / Baan 4GL**, com profundo conhecimento em:

**ESTRUTURA DE TABELAS LN:**
- Prefixos: tc (common), td (logistics), ti (financial/inventory), tw (warehouse), tp (project)
- Sufixos numéricos indicam módulos específicos
- Nomenclatura session-based: t$campo para campos transacionais
- Campos auditoria padrão: t$crdt, t$crby, t$updt, t$upby
- Campos controle: t$cmpy, t$fire, t$user, t$lnno

**SINTAXE 4GL:**
- Estruturas: select...endselect, selectdo...endselect, selectempty...endselect
- Loops: for...endfor, while...endwhile
- Condicionais: if...then...else...endif
- Comandos DB: db.insert, db.update, db.delete, db.read, db.skip
- Declaração: domain, long, string, double
- Funções built-in: strip$(), concat$(), val(), str$()

**CATÁLOGO DE REFERÊNCIA:**
{json.dumps(tables, indent=2)}

**CAMPOS COMUNS (aplicáveis a múltiplas tabelas):**
{json.dumps(common_fields, indent=2)}

---

**SCRIPT PARA ANÁLISE:**
```
{script}
```

---

**INSTRUÇÕES DE ANÁLISE:**

**1. AVALIAÇÃO INICIAL**
   - Primeiro determine se o script possui erros de sintaxe ou lógica
   - Se NÃO houver erros: apenas explique o que o código faz, sua finalidade e fluxo
   - Se HOUVER erros: prossiga com a análise detalhada abaixo

**2. ERROS DE SINTAXE (apenas se existirem)**
   - Estruturas 4GL mal formadas (falta de endselect, endif, endfor, endwhile)
   - Comandos incompletos ou incorretos
   - Variáveis não declaradas (domain, long, string não definidos)
   - Strings mal formatadas ou escape incorreto
   - Uso incorreto de operadores

**3. ERROS DE TABELAS/CAMPOS (apenas se existirem)**
   - Tabelas que não existem no catálogo fornecido
   - Campos não listados para a tabela específica
   - Prefixo t$ faltando ou incorreto
   - Referências a módulos inexistentes

**4. ERROS DE LÓGICA (apenas se existirem)**
   - SELECT/UPDATE/DELETE sem WHERE apropriado
   - Leitura de índices sem campos chave
   - JOINs inválidos ou impossíveis no LN
   - Tentativa de escrita em tabelas read-only
   - Falta de verificação de db.found após db.read
   - Problemas com controle transacional

**5. PARA SCRIPTS SEM ERROS:**
   Forneça:
   - ✅ "Este script não possui erros de sintaxe ou lógica"
   - Explicação clara do propósito do código
   - Descrição do fluxo de execução
   - Tabelas e campos utilizados
   - Possíveis melhorias de performance (opcional)

**6. PARA SCRIPTS COM ERROS:**
   Forneça:
   - Lista detalhada de cada erro encontrado
   - Explicação do motivo de cada erro
   - Recomendações específicas de correção
   - Versão corrigida do script completo

**REGRAS CRÍTICAS:**
- ❌ NÃO invente tabelas ou campos não listados no catálogo
- ❌ NÃO corrija scripts que já estão corretos
- ❌ NÃO altere a lógica de negócio original
- ✅ Seja preciso, técnico e objetivo
- ✅ Respeite a sintaxe 4GL estrita do Infor LN
- ✅ Considere compatibilidade LN on-premise e Cloud Edition

**FORMATO DE RESPOSTA:**
Se SEM erros: breve confirmação + explicação funcional
Se COM erros: análise detalhada + código corrigido
"""

    response = co.chat(
        model="command-r-plus-08-2024",
        message=prompt,
        temperature=0.1,
        max_tokens=4000
    )
    return response.text

@app.post("/analyze")
async def analyze(request: ScriptRequest):
    result = analyze_script(request.script)
    return {"analysis": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
