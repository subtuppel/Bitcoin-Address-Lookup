//This event listener will determine if the context menu should be updated 
//based on if the right-button was clicked and if there is a selection or not
document.addEventListener("mousedown", function(event){
    if (event.button !== 2) {
        return false;
    }
    var selected = window.getSelection().toString();
        if(event.button == 2 && selected != '') {
                //get selected text and send request to bkgd page to create menu
            chrome.extension.sendMessage({
                   'message': 'updateContextMenu', 
                   'text' : selected,
                   'selection': true});
        } else {
        chrome.extension.sendMessage({
                   'message': 'updateContextMenu',
                   'selection': false});
        }
}, true);