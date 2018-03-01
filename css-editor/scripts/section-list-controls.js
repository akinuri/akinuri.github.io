$("#addSection").on("click", function () {
    var $activeSection = getActiveSection();
    $sectionList.find("li").removeClass("active");
    if ($activeSection && $activeSection.length > 0) {
        var parentItem = getParentItem($activeSection[0]);
        if (parentItem) {
            // subitem
            $activeSection.after( elem("li", {"contenteditable":"", "class":"new active depth-1"},) );
        } else {
            if (subItems = getSubItems($activeSection[0])) {
                // parent-item
                $activeSection.after( elem("li", {"contenteditable":"", "class":"new active depth-1"},) );
            } else {
                // item
                $activeSection.after( elem("li", {"contenteditable":"", "class":"new active"},) );
            }
        }
    } else {
        $sectionList.append( elem("li", {"contenteditable":"", "class":"new active"},) );
    }
    $sectionList.sortable("disable");
    $sectionList.enableSelection();
    if (newSec = getNewSection()) {
        newSec.focus();
    }
});

function getNewSection() {
    var $new_ = $sectionList.find("li.new");
    if ($new_.length > 0) {
        return $new_;
    }
    return null;
}

$sectionList.on("keypress", "li.new", function (e) {
    if (e.originalEvent.key == "Enter") {
        e.preventDefault();
        this.classList.remove("new");
        this.removeAttribute("contenteditable");
        
        $sectionList.sortable("enable");
        $sectionList.disableSelection();
        
        var sectionName = this.innerText.trim().toUpperCase();
        if (sectionName == "") {
            sectionName = "NEW-SECTION";
        }
        this.innerText = sectionName;
        
        var parentItem = getParentItem(this);
        if (parentItem) {
            // subitem
            CSS[parentItem.innerText][sectionName] = "";
        } else {
            if (subItems = getSubItems(this)) {
                // parent-item
                CSS[parentItem.innerText][parentItem.innerText] = "";
            } else {
                // item
                CSS[sectionName] = "";
            }
        }
        
        myCodeMirror.setValue("");
        myCodeMirror.focus();
    }
});

$sectionList.on("blur", "li.new", function (e) {
    this.removeAttribute("contenteditable");
    this.classList.remove("new");
    
    $sectionList.sortable("enable");
    $sectionList.disableSelection();
    
    var sectionName = this.innerText.trim().toUpperCase();
    if (sectionName == "") {
        sectionName = "NEW-SECTION";
    }
    this.innerText   = sectionName;
        
    var parentItem = getParentItem(this);
    if (parentItem) {
        // subitem
        CSS[parentItem.innerText][sectionName] = "";
    } else {
        if (subItems = getSubItems(this)) {
            // parent-item
            CSS[parentItem.innerText][parentItem.innerText] = "";
        } else {
            // item
            CSS[sectionName] = "";
        }
    }
    
    myCodeMirror.setValue("");
    myCodeMirror.focus();
});

$sectionList.on("keypress", "li.renaming", function (e) {
    if (e.originalEvent.key == "Enter") {
        this.classList.remove("renaming");
        this.removeAttribute("contenteditable");
        
        $sectionList.sortable("enable");
        $sectionList.disableSelection();
        
        var newSectionName = this.innerText.trim().toUpperCase();
        var oldSectionName = this.dataset.oldName;
        this.innerText = newSectionName;
        
        var parentItem = getParentItem(this);
        if (parentItem) {
            // subitem
            CSS[parentItem.innerText][newSectionName] = CSS[parentItem.innerText][oldSectionName];
            delete CSS[parentItem.innerText][oldSectionName];
        } else {
            if (getSubItems(this)) {
                // parent-item
                CSS[oldSectionName][newSectionName] = CSS[oldSectionName][oldSectionName];
                CSS[newSectionName] = CSS[oldSectionName];
                delete CSS[oldSectionName];
            } else {
                // item
                CSS[newSectionName] = CSS[oldSectionName];
                delete CSS[oldSectionName];
            }
        }
    }
});

$sectionList.on("blur", "li.renaming", function (e) {
    this.classList.remove("renaming");
    this.removeAttribute("contenteditable");
    
    $sectionList.sortable("enable");
    $sectionList.disableSelection();
    
    var newSectionName = this.innerText.trim().toUpperCase();
    var oldSectionName = this.dataset.oldName;
    this.innerText = newSectionName;
    
    var parentItem = getParentItem(this);
    if (parentItem) {
        // subitem
        CSS[parentItem.innerText][newSectionName] = CSS[parentItem.innerText][oldSectionName];
        delete CSS[parentItem.innerText][oldSectionName];
    } else {
        if (getSubItems(this)) {
            // parent-item
            CSS[oldSectionName][newSectionName] = CSS[oldSectionName][oldSectionName];
            CSS[newSectionName] = CSS[oldSectionName];
            delete CSS[oldSectionName];
        } else {
            // item
            CSS[newSectionName] = CSS[oldSectionName];
            delete CSS[oldSectionName];
        }
    }
});



$("#delSection").on("click", function () {
    var $activeSection = getActiveSection();
    if ($activeSection.length > 0) {
        var sectionName = $activeSection.text();
        var parentItem = getParentItem($activeSection[0]);
        if (parentItem) {
            // subitem
            delete CSS[parentItem.innerText][sectionName];
            if (getSubItems(parentItem).length == 1 && CSS[parentItem.innerText]) {
                CSS[parentItem.innerText] = CSS[parentItem.innerText][parentItem.innerText];
            }
        } else {
            if (subItems = getSubItems($activeSection[0])) {
                // parent-item
                delete CSS[sectionName];
                subItems.forEach(function (item) {
                    item.remove();
                });
            } else {
                // item
                delete CSS[sectionName];
            }
        }
        $activeSection.remove();
        myCodeMirror.setValue("");
    }
});

function getActiveSection() {
    var $active = $sectionList.find("li.active");
    if ($active.length > 0) {
        return $active;
    }
    return null;
}



$("#renameSection").on("click", function () {
    var $activeSection = getActiveSection();
    if ($activeSection) {
        $sectionList.sortable("disable");
        $sectionList.enableSelection();
        $activeSection.addClass("renaming");
        $activeSection.attr("contenteditable", "");
        $activeSection.attr("data-old-name", $activeSection.text());
        $activeSection.focus();
        $activeSection.caret("pos", $activeSection.text().length);
    }
});

