// ============================================================
// 1. Registrar Linguagem LN
// ============================================================
monaco.languages.register({ id: "lnscript" });

// ============================================================
// 2. Tokenizer LN (Monarch)
// ============================================================
monaco.languages.setMonarchTokensProvider("lnscript", {
    keywords: [
        "function","select","selectdo","endselect","from","where","order","by",
        "and","or","if","then","else","endif","continue","extern","domain",
        "table","group","choice","on.choice","execute","inrange",
        "rprt_open","rprt_close","rprt_send","when.field.changes",
        "get.screen.defaults"
    ],

    operators: ["=", ">", "<", ">=", "<=", "<>", "between"],

    tokenizer: {
        root: [
            [/\b\d+(\.\d+)?\b/, "number"],

            // Comentários
            [/\|.*/, "comment"],

            // Keywords
            [/\b(function|select|selectdo|endselect|from|where|order|by|and|or|if|then|else|endif|continue|extern|domain|table|group|choice|execute|inrange|rprt_open|rprt_close|rprt_send)\b/, "keyword"],

            // Variáveis LN (:variavel)
            [/:([a-zA-Z_][\w.]*)/, "variable.predefined"],

            // Campos com tabela — exemplo: tppdm600.cprj
            [/([a-zA-Z_][\w]*)\./, "type.identifier"],

            // Strings
            [/".*?"/, "string"],

            // Identificadores
            [/[a-zA-Z_][\w]*/, "identifier"],
        ]
    }
});

// ============================================================
// 3. Configurações extras da linguagem
// ============================================================
monaco.languages.setLanguageConfiguration("lnscript", {
    comments: {
        lineComment: "|"
    },
    brackets: [
        ["{", "}"],
        ["(", ")"]
    ],
    autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "(", close: ")" }
    ]
});
