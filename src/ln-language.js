// Registro da linguagem LN no Monaco
monaco.languages.register({ id: "lnscript" });

// Configuração de tokens
monaco.languages.setMonarchTokensProvider("lnscript", {
    tokenizer: {
        root: [

            // Comentários
            [/\|.*/, "comment"],

            // Palavras-chave LN
            [
                /\b(function|select|selectdo|endselect|if|then|else|endif|continue|from|where|order|by|and|or|inrange|execute|extern|domain|table|group|choice|on\.choice|when\.field\.changes|get\.screen\.defaults)\b/,
                "keyword"
            ],

            // Números
            [/\b\d+(\.\d+)?\b/, "number"],

            // Strings
            [/\".*?\"/, "string"],

            // Campos com tabela: tfacr201.reca
            [/[a-zA-Z_][\w]*\.[a-zA-Z_][\w]*/, "field"],

            // Variáveis LN (:var)
            [/:([a-zA-Z_][\w]*)/, "variable"],

            // Identificadores genéricos
            [/[a-zA-Z_][\w]*/, "identifier"],
        ]
    }
});
// Tema escuro LN
monaco.editor.defineTheme("ln-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
        { token: "comment",   foreground: "888888" },
        { token: "keyword",   foreground: "00ccff", fontStyle: "bold" },
        { token: "number",    foreground: "ffcf6e" },
        { token: "string",    foreground: "9cdcfe" },
        { token: "variable",  foreground: "ff7aaa" },
        { token: "field",     foreground: "a3ffa3" },
        { token: "identifier",foreground: "ffffff" }
    ]
});
    