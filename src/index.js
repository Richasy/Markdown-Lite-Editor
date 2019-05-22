import './css/acrmd-light.css'
import './css/acrmd-dark.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/display/fullscreen.css'

//require('./lib/jquery.js');
import * as CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/continuelist.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/display/fullscreen.js'

window.EditInit = function(content, theme, fontSize,fontFamily) {
    if (theme === "Dark") {
        theme = 'acrmd-dark';
        document.body.classList.remove('light');
        document.body.classList.add('dark');
    }
    else {
        theme = 'acrmd-light';
        document.body.classList.remove('dark');
        document.body.classList.add('light');
    }
    window.isInput = true;
    window.inputInterval = 0;
    window.editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
        mode: 'markdown',
        autoCloseTags:true,
        autoCloseBrackets: true,
        theme: theme,
        lineNumbers:true,
        lineWrapping: true,
        scrollbarStyle: 'null',
        maxHighlightLength: Infinity,
        inputStyle: 'contenteditable',
        fullScreen:true,
        extraKeys: {
            "Ctrl-B": (cm) => { TextEffect(cm, 'b') },
            "Ctrl-C": (cm) => { cm.execCommand('copy') },
            "Ctrl-X": (cm) => { cm.execCommand('cut') },
            "Ctrl-I": (cm) => { TextEffect(cm, 'i') },
            "Ctrl-Q": (cm) => { TextEffect(cm, 'q') },
            "Ctrl-D": (cm) => { TextEffect(cm, 'd') },
            "Ctrl-P": (cm) => { TextEffect(cm, 'p') },
            "Ctrl-T": (cm) => { TextEffect(cm, 't') },
            "Ctrl-R": (cm) => { TextEffect(cm, 'r') },
            "Ctrl-U": (cm) => { TextEffect(cm, 'u') },
            "Ctrl-F":(cm)=>{cm.execCommand('find')},
            "Ctrl-H":(cm)=>{cm.execCommand('replace')},
            "Shift-F1": (cm) => { TextEffect(cm, 'sup') },
            "Shift-F2": (cm) => { TextEffect(cm, 'sub') },
            "Shift-F3": (cm) => { UpperandLower(cm) },
            "Ctrl-Z": (cm) => {
                var his = cm.doc.historySize();
                if (his.undo > 1) {
                    cm.doc.undo();
                }
            },
            "Enter": "newlineAndIndentContinueMarkdownList"
        }
    });
    SetText(content);
    SetFontSize(fontSize);
    document.getElementsByClassName('CodeMirror')[0].style.fontFamily=fontFamily;
    editor.on('change', () => {
        window.isInput = true;
    });
    editor.on('scroll', (cm) => {
        var data = cm.getScrollInfo();
        var top = data.top;
        var height = data.height;
        var obj = {
            Name: 'ScrollChanged',
            Value: top / height
        };
        var result = JSON.stringify(obj);
        window.external.notify(result);
    });
    setInterval(() => {
        window.inputInterval += 200;
        if (window.inputInterval > 600) {
            if (window.isInput) {
                var text = GetText();
                var obj1 = {
                    Name: 'TextChange',
                    Value: text
                }
                var result1 = JSON.stringify(obj1);
                window.external.notify(result1);
                window.isInput = false;
            }
            window.inputInterval = 0;
        }
    }, 200);
    // document.getElementById('QueryCloseButton').click(()=>{
    //     queryText="";
    //     document.getElementById("QueryInputBox").innerText='';
    //     queryCursor=null;
    //     document.getElementsByClassName("SearchDialog")[0].classList.add('hide');
    // })
    // document.getElementById('QueryInputBox').on('input',()=>{
    //     window.queryText=document.getElementById("QueryInputBox").innerText;
    //     window.queryCursor=editor.getSearchCursor(queryText);
    //     queryCursor.findNext();
    //     console.log(queryCursor);
    // })
}
function SetText(text) {
    editor.setValue(text);
}
function ShowQuery(){
    document.getElementsByClassName(".SearchDialog")[0].classList.remove('hide');
}
function SetFontSize(size) {
    document.body.style.fontSize=size+"px";
}
function SetColor(isDark) {
    var ele=document.getElementsByClassName('CodeMirror')[0];
    if (isDark) {
        editor.options.theme = 'acrmd-dark';
        ele.classList.remove('cm-s-acrmd-light');
        ele.classList.add('cm-s-acrmd-dark');
    }
    else {
        editor.options.theme = 'acrmd-light';
        ele.classList.add('cm-s-acrmd-light');
        ele.classList.remove('cm-s-acrmd-dark');
    }
}
function UpperandLower(cm) {
    var s = cm.doc.getSelection('\n');
    if (s.length > 0) {
        var reg = /[a-z]/;
            let b = true;
            for (let i = 0; i < s.length; i++) {
                if (reg.test(s[i])) {
                    b = false;
                }
            }
            if (!b) {
                s = s.toUpperCase();
            }
            else {
                s = s.toLowerCase();
            }
        cm.doc.replaceSelection(s);
    }
}
function GetText() {
    let text = editor.doc.getValue('\n');
    return text;
}

function TextEffect(cm,eff) {
    var s = cm.doc.getSelection('\n');
    if (s.length > 0) {
            switch (eff.toLowerCase()) {
                case "b":
                    s = `**${s}**`;
                    break;
                case "i":
                    s = `*${s}*`;
                    break;
                case "q":
                    s = `> ${s}`;
                    break;
                case "d":
                    s = `\`${s}\``;
                    break;
                case "p":
                    s = `\`\`\`\n${s}\n\`\`\``;
                    break;
                case "u":
                    s = `_${s}_`;
                    break;
                case "t":
                    s = `\n|${s}||\n|-|-|\n`;
                    break;
                case "sup":
                    s = `^${s} `;
                    break;
                case "sub":
                    s = `~${s}~`;
                    break;
                case "r":
                    s = `~~${s}~~`;
                    break;
                case "number1":
                case "number2":
                case "number3":
                case "number4":
                case "number5":
                case "number6":
                    var num = parseInt(eff.replace("Number", ""));
                    var h = "";
                    for (let i = 0; i < num; i++)
                    {
                        h += "#";
                    }
                    s = `${h} ${s}`;
                    break;
        }
        
        cm.doc.replaceSelection(s);
    }
}
    