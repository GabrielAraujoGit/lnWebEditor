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
    "tbtsli200": ["date", "tsta", "fire", "cfne"]
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
