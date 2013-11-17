// ==UserScript==
// @name           Context_LinkText.uc.js
// @namespace      fromst@gmail.com
// @description    页面右键菜单中增加"对链接文本的操作：复制、打开与搜索"
// @version        0.0.0.1
// ==/UserScript==
if (location == "chrome://browser/content/browser.xul") {
    var linkTxt = {
        copy : function (aString) {
            var clipb = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
            clipb.copyString(aString);
        },
        
        copyText : function () {
            this.copy(gContextMenu.linkText());
        },
        
        openText : function () {
            gBrowser.loadOneTab(gContextMenu.linkText(), null, null, null, false, false);
        },
        
        searchText : function () {
            BrowserSearch.loadSearch(gContextMenu.linkText(), true);
        },
        
        init : function () {
            this.initialized = true;
            
            this.mItem = document.createElement("menu");
            this.mItem.setAttribute("id", "context-LinkTextText");
            this.mItem.setAttribute("label", "\u94FE\u63A5\u6587\u672C");
            
            var myPopUp = this.mItem.appendChild(document.createElement("menupopup"));
            myPopUp.setAttribute("id", "LinkTextPopUp");
            
            // copy link text
            var mItemCopy = document.createElement("menuitem");
            mItemCopy.setAttribute("id", "context-copyLinkTextText");
            mItemCopy.setAttribute("label", "\u590D\u5236\u94FE\u63A5\u6587\u672C");
            mItemCopy.setAttribute("oncommand", "linkTxt.copyText();");
            // open link text
            var mItemOpen = document.createElement("menuitem");
            mItemOpen.setAttribute("id", "context-openLinkTextText");
            mItemOpen.setAttribute("label", "\u6253\u5F00\u94FE\u63A5\u6587\u672C");
            mItemOpen.setAttribute("oncommand", "linkTxt.openText();");
            // search link text
            var mItemSearch = document.createElement("menuitem");
            mItemSearch.setAttribute("id", "context-searchLinkTextText");
            mItemSearch.setAttribute("label", "\u641C\u7D22\u94FE\u63A5\u6587\u672C");
            mItemSearch.setAttribute("oncommand", "linkTxt.searchText();");
            
            myPopUp.appendChild(mItemCopy);
            myPopUp.appendChild(mItemOpen);
            myPopUp.appendChild(mItemSearch);
            
            var contextMenu = document.getElementById("contentAreaContextMenu");
            contextMenu.insertBefore(this.mItem, document.getElementById("context-copylink"));
            contextMenu.addEventListener("popupshowing", function () {
                linkTxt.onPopupShowing(this);
            }, false);
        },
        
        onPopupShowing : function (aPopup) {
            var isHidden = !gContextMenu.onLink || gContextMenu.onImage;
            this.mItem.hidden = isHidden;
        }
    }
    
    window.setTimeout(function () {
        linkTxt.init();
    });
}
