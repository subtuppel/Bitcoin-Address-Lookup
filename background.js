function openAddressInfo(address) {  
  if (address.length == 34)
    {
     chrome.tabs.create({ url: 'https://chainz.cryptoid.info/blk/address.dws?'+encodeURIComponent(address) });
    }  
  if (address.length == 64)
    {
     chrome.tabs.create({ url: 'https://chainz.cryptoid.info/blk/tx.dws?'+encodeURIComponent(address) });
    }         
}
  
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == 'contextMenuId')
   {
	    openAddressInfo(info.selectionText); 
   }
});

//add a message listener that will modify the context menu however you see fit
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'updateContextMenu') { 
    var text = request.text.trim();
    var first = text.toLowerCase().substring(0,1);  
    var r = /^[a-z0-9]+$/i   
    var match = r.exec(text); 
        if (request.selection && match && ((text.length == 34 && first == 'b') || text.length == 64 )) { 
        var title = text.length == 34 ? 'Address' : 'Transaction';
            chrome.contextMenus.update('contextMenuId',{
                'title': 'lookup BlackCoin ' + title, 
                'enabled': true, 
                "contexts": ['selection'],
                //"onclick":   window.alert(text.length)
            });
        } else {
            chrome.contextMenus.update('contextMenuId',{
                'title': 'No BlackCoin Address or Transaction', 
                'enabled': false, 
                "contexts":['selection']
            });
        }
    } else {
        sendResponse({});
    }
});

//The original context menu.  The important property is the id.  The rest is mostly 
//arbitrary because it will be changed dynamically by the listener above.
    chrome.contextMenus.create({
        'id': 'contextMenuId', 
        'enabled': false, 
        'title': 'Some Title', 
        "contexts": ['selection']
        });