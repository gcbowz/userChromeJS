// ==UserScript==
// @name           autoCopy.uc.js
// @namespace      ithinc#mozine.cn
// @description    AutoCopy with AutoPaste to search bar
// @include        main
// @compatibility  Firefox 3.0.x
// @author         ithinc
// @updator       iwo
// @update        2013-01-21 21:30 respected ctrl or alt Key
// @update        2013-01-06 10:00 excluding input area
// @version        LastMod 2009/3/1 22:30 Initial release
// @Note           https://g.mozest.com/redirect.php?goto=findpost&pid=299093&ptid=42980
// ==/UserScript==

/* :::: AutoCopy with AutoPaste to search bar :::: */

(function() {
  var lastSelection = "";
  var autocopyImages = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAADQklEQVQ4jT3RzW8UZQCA8eedeWe3291+QHfp9tuqxe0SodSUojECWk1DSnpQNFa9efXEwZMX/SswJiYejJqYxsTGKJi2SCohSNCALcFatqVLv3enuzvdmXnnfb0Q/4Hnd3jE5VxOGDAS0k3Dw6rmxMqB74lMTJrd+8uU3AoNaGY6jjzbr+gbSGXTX2QnrkxVF0rHJkeRLqABBZ+l/HrTnEx9vFXZ6rnY0eetDb+Retg51OOVN3qThb/O9N6dHzkUhEeymb3PfS0ugalKwETwcgym9L2/m3tPvz5U6Lpw+LJISFvrFuvRfqylVubE0l2yoFvcEqe3b0+29We/BjkvAUKwU5CQYJ6+s5A/GM8JldIk4paR9QMVn/7RdKuS5YClwBxduZkxYc8ZRnK/WYAdg/k1uLQBIlmvRadufx+98oyjTx6u0zf3jezySo4DtgX6Mbb4suv8vQePtqbxKlpqEA3AYmzwznJn1/aFh1cz8dWijmZ+tkr7FcT6Jo1ABFS6siy0j7IdPlcz69d3AKQEWoHmoJLxXjrX6g9ahD/9IpK3btEECMC3LMzYGDw/SO3aBhwoKVASQDaCKAP/ZoZ6B8tFJ1XaVSWQKcAGgnSa6K03cdrb0TubaKXAaGMR01gW0gFVIEnc9vP5q18RBRXTBgRP9HgYIvfKqJZDKG1QBgh9HR8YMDQmsXxo7qT26bsbVz7oDCo4IENAnTtHtSOLcl2s774lfvMGBAFhZEBFWA1xgW1hbcOkgE9aIf5kqdATE8TOnoVXX8MFDGBm52i9dp32mAZjIq1UhDFYVfijBOsChG9bRr19EXP8OEG5TENfH/74+P8R+eAfzq/eYCC52yLj8XaEwB5Pp90Y5Gp240n7/fe0fKrPUgc+RgiMHxDv6cGr15HFIjaImFcl5xXaEoSriXx+wUpCMOscm1saHUNmUlHg7hgVVEzgucbz9k1lq6j9fE4XM2ktQSkQ06Z/qbC2PoPvGVkDVrtPdbrbj9n6dVHUlSW0BqVBaUEYIUIjsBInGOF3U3EyLHa+UDq6XNhGa2Tmw4/gh5UVN/T+dLfsTYQOEKIOtge6hhA+UEPI6mzbiy6Oc0Bp937TO1N7ZLv5D+kujbC/iJ43AAAAAElFTkSuQmCC",
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAADtElEQVQ4jQXBfWjUdRwH8Pfn+/ves7u73blH3E031x6c2zQcw52NQJGIsakVVNiDsyAJyQYFZaBZYQWB2T8FCTIZQkJIjdYDoa2ZtIfMsbbmRpvNbXe3dbvb3e9+9/v9vt9vrxct1NeTyueVMxzeHOruttfdnnUjm6ZKj1Mt/jaK5Qdr8JGNi/VV21ssVLYWVm8+WX3yx/eS15Idvd3gcduGIIIVj58r1LMFfc7Qmwtr8xVv1zTpk4+9vOlu7cGK1MpcJDjxU0fjwKU9ZduM4urI0hdZQb1QKsNJKWUTRd2gZ8QvQ/7GQ8dbJupeC51gBdwhZIBNJZzF6ys4MHwD1alVWTyzgcPlg10VLVX9IMdNDgB5KbVCt8vjfLCodv1wrWHjlb1khiT8Xk05Mmnb99EFVTd/m7n9YWamk6rtj+tF0mjoUJ3tQ0wRaR7Im1Nw9c75Cqlwckx0fXdePPuwSx4sz2Bn3xlee2/c4fYGNaZvyNmiKuqte3VyZGT+a0qtSi5II5/5H4a2P31ntKY2cWr44yLv4M/S3vo5W15dBV0fRCAUgkVA6pEovqo6hCGjLfuE9+oqCOAujaOECRRtrBWln3w+mI1qMM6co+CVKwgHA6CAH3pZKWTPMeDRfVjvn4XLsjgzTQ4FML8wKB7YhvHqA5GylRlHaHnR1rmDGAE8FoPZ2gr7s4twHDkCkclAmBaUFIp5PBKaBu4SeXvCVw+fpjfs+/INWHN31Ba3D7lcDgTAaxiwl1ZgFpfClAqWVJBGVvpaWxUCQXCde/wPrc/2vjty/mhISTCnl+edTpivn4I+PAz+zbfgS0vw9hyD2t0MQygoywYLeAlcA1uw7C6S4p0S7nBBEgyvh+zTp+E5+hzwwouI1dVBxWJQFz5Faf9VVLkldKWEMC0BpaB1+gO24lpXhRD+jfJSJc6eJbRHYSaTcEUiSAaDsH4fgc+2wKf+UrtdOkuVbEk3+ozvI207YtqJcDDlzm3UJbc27eIfvC8dzU3MyuhQRBB6Dr6GHUgLG46xMXC3lzyz02jHv+ECGPc3RaO3WNBfZF6uf+nGre4euCpDIhe7r/L6mtJTcZVOJdTqPzMyG90rZ1r3SKeRts2CAH0om6fv3p4eID2t+LrJMFDfVR5fmMX8pV8pa2kkBGAKBVMwGBbIlAysYD86g2m1Fozgcs3jybbERALCBs2N38PhT/58ShmJt/KKx4iYCWIGSNMBlSWiPMCyipDxkZXSXK5cPMf/7jteOxrdv9P6H00LytiG/sXgAAAAAElFTkSuQmCC",
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAADeUlEQVQ4jQXBSWicZRgH8P/zfu83S7aZzGSyTCZLY1IySdSDlkADHrzpoaAtCAUFIxQR8WqXU/HgTRB6VqhCe+lBa22LBEMQreLSkIjN5kzWcTLJ7DPf9r7v4+9He8ceLt7MgbXBXDZBQ+37XPh7CdnXrqIrnoYQAq3SNraWP58emDjnZeYXvTtLef3J22eKCzM9kDvOE8RGD9DZ4aE3cZ7DB5H+3r7UZDQSapIUXYGhEVdEx6zJN16pJsakV3ZjbZ/+OnWOrhWdgxpd/ulF9Ma0oOpZE2xeX+SKuuKHe8aN7CHNFNckQ9Q+QiI5Ch1qajd6x2rtnFubOvvsgkys5GWPGCToCudWX7Ja+ZHLC3O5+Uy6T3VHSHbahrujluqyU1zKrwkxXOPH7Udqor8xMxTOZGsqnZcaAdnCGITa6fEBxN5ZiCEernL/0LAxRhOBJIlO7Hc5+PbkIUJigPfUMpGa/YrboUUJQBAZE+jwaDwqR0YzaWhDVrWtBQAwDGwwcmYb/zo7oJAmVyu9Vnia9MqqSzBAxhBEyBtNxkwfg8GGiAgQBEgCHFXHj4V7iITDKPslJX1peXX/FgtzVwQNP6gVxeRgZv16dmbLMoE0DEMEQLOCpDAeHdxFQD4aqmqg2/J060xZuUNfyIgyolltTYWD+K10PDp3bD/WjnGFIAnNCp1WN9ZPf8Ozxh/whYtGUOTa7gBON97dMMFAEfAgvJpOmTZerrsN/Hq8JNYrT8AGkAjjqLmLpaN7EFLgxCsAhSii+2/CccaEIBdEFgQr/vnosPLRfq4MTzX5+/2vudDcRcur4bvd26hzGSXvEHRq4/XEFaA9CIYDggAASMtuolmd+NM6uZDv6PxyfNNdMw8Ob1PCGsCBt42aX4F7Qnhv+gYi7S64/i6IDZgZACAkkqifZuPPxRfSb41fQybI0g873+D3ygoqrSrsWjc+mLmJqb5peNqBrxTYKGMJi6UIQRbLFvzjS6n4ZD50fmQ2SIgP5cr+fd4urWFYTODV4UtsORJbuU0U/isbpckiZq66ZTSah6AHT5fx8We1qzOp1qfpuBdoDttGWyg2T9BhJ+EpQsNzYYxAoIx2tG2V6qFfbryfvDj/gl2Qz6fnAX64889eY3U1L4oM5RNZrm31tgPjtJjIk8JuMbgpyKp1RIQT6GBjsm+2NJ1M4X84vtmKnywkowAAAABJRU5ErkJggg=="];
  var autocopyTooltips = ["Autocopy Disabled", "Autocopy Enabled\nWithOut Autopaste", "Autocopy Enabled\nwith Autopaste"];

  var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
  if(!prefs.getPrefType("userChrome.autocopy.autocopyState")) prefs.setIntPref("userChrome.autocopy.autocopyState", 2);

  function autocopyStart(e) {
    lastSelection = getBrowserSelection();
  }

  function autocopyStop(e) {
    var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
    var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");
    var selection = getBrowserSelection();
//增加判断是否在输入框或按下功能键	
	var exceptTarget = (e.target.nodeName == "TEXTAREA" || e.target.type == "textarea" || e.target.type == "text" || e.target.type == "password" || e.target.type == "email");
	var exceptoriginalTarget = (!e.originalTarget.ownerDocument || e.originalTarget.ownerDocument.designMode == "off" || e.originalTarget.ownerDocument.designMode == "undefined");
	var exceptAlternativeKey = (e.ctrlKey || e.altKey);
	var except = (exceptTarget && exceptoriginalTarget && !exceptAlternativeKey);//

    if(autocopyState>0 && selection && selection!=lastSelection && !except) {//
      goDoCommand('cmd_copy');

      if(autocopyState>1) {
        var searchbar = document.getElementById('searchbar');
        searchbar.removeAttribute("empty");
        searchbar.value = selection;

        var evt = document.createEvent("Events");
        evt.initEvent("oninput", true, true);
        searchbar.dispatchEvent(evt);
      }
    }
  }

  gBrowser.mPanelContainer.addEventListener("mousedown", autocopyStart, false);
  gBrowser.mPanelContainer.addEventListener("mouseup", autocopyStop, false);

  var statusbarpanel = document.getElementById("status-bar").appendChild(document.createElement("statusbarpanel"));;
  statusbarpanel.setAttribute("id", "autocopy-statusbarpanel");
  statusbarpanel.setAttribute("class", "statusbarpanel-iconic");
  // statusbarpanel.insertBefore(newItem refChild);//
  statusbarpanel.setAttribute("onclick", '\
    if(event.button==0) {\
      var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);\
      var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");\
      prefs.setIntPref("userChrome.autocopy.autocopyState", (autocopyState+1)%3);\
    }\
  ');

  function refreshStatus() {
    var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
    var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");
    var statusbarpanel = document.getElementById("autocopy-statusbarpanel");

    statusbarpanel.setAttribute("src", autocopyImages[autocopyState%3]);
    statusbarpanel.tooltipText = autocopyTooltips[autocopyState%3];
  }
  refreshStatus();

  var observer = {
    observe:function(subject, topic, prefName) {refreshStatus();}
  };
  prefs.QueryInterface(Ci.nsIPrefBranchInternal).addObserver("userChrome.autocopy.autocopyState", observer, false);
})();
