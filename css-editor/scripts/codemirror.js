var TAB_CHAR = " ".repeat(4);

var $code = $("#code");

$code.on("keydown", function (e) {
    if (e.originalEvent.key == "Tab") {
        e.preventDefault();
        var text = this.value;
        text = text.insert(this.selectionStart, TAB_CHAR);
        this.value = text;
    }
});

var myCodeMirror = CodeMirror.fromTextArea($code[0], {
    lineNumbers : true,
    tabSize     : 4,
    indentUnit  : 4,
    styleActiveLine: true,
    
    // https://github.com/codemirror/CodeMirror/issues/988#issuecomment-37095621
    extraKeys   : {
        Tab: function(cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces, "end", "+input");
        }
    },
});



var updateTimeout = null;

myCodeMirror.on("keyup", function () {
    var $activeSection = getActiveSection();
    if ($activeSection) {
        var sectionName  = $activeSection.text();
        var currentRules = myCodeMirror.getValue();
        var parentItem = getParentItem($activeSection[0]);
        if (parentItem) {
            // subitem
            if (currentRules != CSS[parentItem.innerText][sectionName]) {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(function () {
                    CSS[parentItem.innerText][sectionName] = currentRules;
                }, 500);
            }
        } else {
            if (subItems = getSubItems($activeSection[0])) {
                // parent-item
                if (currentRules != CSS[sectionName][sectionName]) {
                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(function () {
                        CSS[sectionName][sectionName] = currentRules;
                    }, 500);
                }
            } else {
                // item
                if (currentRules != CSS[sectionName]) {
                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(function () {
                        CSS[sectionName] = currentRules;
                    }, 500);
                }
            }
        }
    }
});