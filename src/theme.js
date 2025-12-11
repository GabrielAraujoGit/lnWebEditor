async function loadLNTheme(mode = "dark") {
    const response = await fetch("./theme-colors.json");
    const palette = await response.json();
    const colors = palette[mode];

    monaco.editor.defineTheme("ln-" + mode, {
        base: mode === "dark" ? "vs-dark" : "vs",
        inherit: true,
        rules: [
            { token: "comment",  foreground: colors.accent.comment.replace("#", "") },
            { token: "keyword",  foreground: colors.accent.primary.replace("#", "") },
            { token: "string",   foreground: colors.accent.string.replace("#", "") },
            { token: "number",   foreground: colors.accent.constant.replace("#", "") },
            { token: "operator", foreground: colors.accent.operator.replace("#", "") },
        ],
        colors: {
            "editor.background": colors.bg.default,
            "editor.foreground": colors.fg.primary,
            "editorLineNumber.foreground": colors.fg.muted,
            "editorLineNumber.activeForeground": colors.accent.primary,
            "editorCursor.foreground": colors.accent.primary,
            "editorIndentGuide.background": colors.fg.muted + "33"
        }
    });

    monaco.editor.setTheme("ln-" + mode);
}
