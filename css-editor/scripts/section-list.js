var CSS          = {};
var $sectionList = $("#sectionList");


$sectionList.on("click", "li", function () {
    $sectionList.find("li").removeClass("active");
    this.classList.add("active");
    if (!this.classList.contains("new")) {
        var sectionName = this.innerText;
        myCodeMirror.setValue("");
        var parentItem = getParentItem(this);
        if (parentItem) {
            // subitem
            myCodeMirror.setValue(CSS[parentItem.innerText][sectionName]);
        } else {
            var subitems = getSubItems(this);
            if (subitems) {
                // parent-item
                myCodeMirror.setValue(CSS[sectionName][sectionName]);
            } else {
                // item
                myCodeMirror.setValue(CSS[sectionName]);
            }
        }
        myCodeMirror.scrollTo(0, 0);
        $(myCodeMirror.display.wrapper).find(".CodeMirror-vscrollbar")[0].scrollTo(0,0);
    }
});





var oldParentItem = null;
var oldParentItemName = null;

// http://api.jqueryui.com/sortable/
$sectionList.sortable({
    cancel : ".unsortable",
    start : function (event, ui) {
        oldParentItem = getParentItem(ui.item[0]);
        if (oldParentItem) {
            oldParentItemName = oldParentItem.innerText;
        }
    },
    sort : function (event, ui) {
        var prevSib = ui.placeholder[0].previousElementSibling;
        if (prevSib && prevSib.classList.contains("ui-sortable-helper")) {
            prevSib = prevSib.previousElementSibling;
        }
        var nextSib = ui.placeholder[0].nextElementSibling;
        if (nextSib && nextSib.classList.contains("ui-sortable-helper")) {
            nextSib = nextSib.nextElementSibling;
        }
        // ignore first item as it can't be a subitem
        if (prevSib && !prevSib.classList.contains("ui-sortable-helper")) {
            // check if it's not the last item in the list
            if (nextSib) {
                // item that is right below a parent item (depth-0) must be a subitem (depth-1)
                // also an item between subitems must be a subitem
                if ( (!prevSib.classList.contains("depth-1") && nextSib.classList.contains("depth-1")) || 
                     (prevSib.classList.contains("depth-1") && nextSib.classList.contains("depth-1")) ) {
                    ui.placeholder.addClass("depth-1");
                } else {
                    // non-subitems
                    if ((ui.offset.left - ui.originalPosition.left) >= 25) {
                        ui.placeholder.addClass("depth-1");
                    } else {
                        ui.placeholder.removeClass("depth-1");
                    }
                }
            } else {
                // if it's the last item in the list
                if ((ui.offset.left - ui.originalPosition.left) >= 25) {
                    ui.placeholder.addClass("depth-1");
                } else {
                    ui.placeholder.removeClass("depth-1");
                }
            }
        } else {
            // an item from below can't be at the top and be a subitem
            ui.placeholder.removeClass("depth-1");
        }
    },
    stop : function (event, ui) {
        if (ui.placeholder.hasClass("depth-1")) {
            ui.item.addClass("depth-1");
        } else {
            ui.item.removeClass("depth-1");
        }
        var itemName       = ui.item.text();
        var parentItem     = getParentItem(ui.item[0]);
        var parentItemName = null;
        if (parentItem) {
            parentItemName = parentItem.innerText;
        }
        if (parentItem) {
            if (oldParentItemName != parentItemName) {
                // moved from parent-list into sublist
                var itemCSSText = CSS[itemName];
                delete CSS[itemName];
                if (getSubItems(parentItem).length > 1) {
                    // moved into an existing sublist
                    CSS[parentItemName][itemName] = itemCSSText;
                } else {
                    // moved into a new sublist
                    var parentCSSText = CSS[parentItemName];
                    delete CSS[parentItemName];
                    CSS[parentItemName] = {};
                    CSS[parentItemName][parentItemName] = parentCSSText;
                    CSS[parentItemName][itemName] = itemCSSText;
                    parentItem.classList.add("unsortable");
                }
            }
        } else {
            if (oldParentItem) {
                // moved from sublist to parent list
                var itemCSSText = CSS[oldParentItemName][itemName];
                delete CSS[oldParentItemName][itemName];
                CSS[itemName] = itemCSSText;
                // there is no subitem
                if (!getSubItems(oldParentItem)) {
                    var selfCSSText = CSS[oldParentItemName][oldParentItemName];
                    delete CSS[oldParentItemName][oldParentItemName];
                    CSS[oldParentItemName] = selfCSSText;
                    oldParentItem.classList.remove("unsortable");
                }
            }
        }
        oldParentItem = null;
        oldParentItemName = null;
    },
    distance: 10,
});
$sectionList.disableSelection();





function getParentItem(item, looping) {
    if (item.classList.contains("depth-1")) {
        var prevSiblings = getPrevSiblings(item);
        for (var i = prevSiblings.length - 1; i >= 0; i--) {
            if (!prevSiblings[i].classList.contains("depth-1")) {
                return prevSiblings[i];
            }
        }
    }
    return null;
}

function getSubItems(item) {
    if (!item.classList.contains("depth-1")) {
        var items = [];
        var nextSiblings = getNextSiblings(item);
        for (var i = 0; i < nextSiblings.length; i++) {
            if (nextSiblings[i].classList.contains("depth-1")) {
                items.push(nextSiblings[i]);
            } else {
                break;
            }
        }
        if (items.length > 0) {
            return items;
        }
        return null;
    }
    return null;
}

function getPrevSiblings(item) {
    return $(item).parent().children().slice(0, $(item).index()).toArray();
}

function getNextSiblings(item) {
    return $(item).parent().children().slice($(item).index() + 1).toArray();
}
