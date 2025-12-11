console.log("LN Editor com Monaco carregado.");

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
    }
});

require(["vs/editor/editor.main"], function () {

    window.editor = monaco.editor.create(document.getElementById("editor-container"), {
        value: `| Script LN
function exemplo()
{
    select tfacr201.*
    from tfacr201
    where tfacr201.reca > tfacr201.amnt
    selectdo
        rprt_send()
    endselect
}`,
        language: "lnscript",
        theme: "ln-dark",
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: true }
    });

});
