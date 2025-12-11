import cohere
import json

COHERE_API_KEY = ""
co = cohere.Client(api_key=COHERE_API_KEY)

# JSON de tabelas/campos
tables = {
    "tfacr201": ["reca", "amnt", "ninv", "recd"],
    "tbtsli200": ["date", "tsta", "fire", "cfne"]
}

# Script correto
script_ok = """
function read.main.table()
{
    select tfacr201.*
    from tfacr201
    where tfacr201.ninv = :ninv
    selectdo
        if reca > amnt then
            rprt_send()
        endif
    endselect
}
"""

# Script com erros
script_err = """
function read.main.table(
{
    select tfacr201.*
    from tfacr201
    where tfacr201.invv = :ninv
    selectdoo
        if reca > amnt
            rprt_send()
        
    endselect
}
"""


def analyze(script):
    prompt = f"""
Você é um validador experto de scripts LN/Baan.
Use APENAS essas tabelas e campos como referência:

{json.dumps(tables, indent=4)}

Analise o script LN abaixo:

{script}

Responda APENAS:
1. Erros de sintaxe detectados
2. Tabelas ou campos inexistentes
3. Problemas de estrutura (selectdo, endif, chaves, etc)
4. Recomendações de correção
5. Versão corrigida do script
"""

    # ✅ Sintaxe antiga — funciona na sua instalação
    response = co.chat(
        model="command-a-03-2025",
        message=prompt,
        temperature=0.1
    )

    return response.text


print("======= SCRIPT CORRETO =======")
print(analyze(script_ok))

print("\n\n======= SCRIPT COM ERROS =======")
print(analyze(script_err))
