// Autocomplete LN para o Monaco Editor
fetch("src/tables.json")
    .then(response => response.json())
    .then(tables => {

        // Lista de palavras-chave LN
        const lnKeywords = [
            "function", "select", "selectdo", "endselect",
            "if", "then", "else", "endif", "continue",
            "from", "where", "order", "by", "and", "or",
            "inrange", "extern", "domain", "table",
            "group", "choice", "on.choice",
            "when.field.changes", "get.screen.defaults",
            "execute", "rprt_send", "rprt_open", "rprt_close"
        ];

        // Snippets LN
        const lnSnippets = [
            {
                label: "function",
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 
`function \${1:nome}()
{
    \${2:// código}
}`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: "Template de função LN"
            },
            {
                label: "select",
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText:
`select \${1:tabela}.*
from \${1:tabela}
where \${1:tabela}.\${2:campo} = :\${3:variavel}
selectdo
    rprt_send()
endselect`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: "Template de SELECT LN"
            }
        ];

        // Registrar provedor de autocomplete
        monaco.languages.registerCompletionItemProvider("lnscript", {
            provideCompletionItems: function(model, position) {

                const text = model.getLineContent(position.lineNumber);
                const word = model.getWordUntilPosition(position);
                const before = text.substring(0, word.startColumn - 1);

                const suggestions = [];

                // 1️⃣ Keywords LN
                lnKeywords.forEach(k => {
                    suggestions.push({
                        label: k,
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: k
                    });
                });

                // 2️⃣ Snippets LN
                lnSnippets.forEach(s => suggestions.push(s));

                // 3️⃣ Tabelas LN
                Object.keys(tables).forEach(tbl => {
                    suggestions.push({
                        label: tbl,
                        kind: monaco.languages.CompletionItemKind.Class,
                        insertText: tbl
                    });
                });

                // 4️⃣ Campos da tabela ao digitar "tabela."
                const match = before.match(/([a-zA-Z_][\w]*)\.$/);
                if (match) {
                    const tableName = match[1];

                    if (tables[tableName]) {
                        tables[tableName].forEach(field => {
                            suggestions.push({
                                label: field,
                                kind: monaco.languages.CompletionItemKind.Field,
                                insertText: field
                            });
                        });
                    }
                }

                return { suggestions };
            }
        });

    });
