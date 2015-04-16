function openAddressInfo(address) {
    if (address.length == 34) {
        chrome.tabs.create({
            url: 'https://chainz.cryptoid.info/blk/address.dws?' + encodeURIComponent(address)
        });
    }  
    // block hash does also have 64 characters
    // This will always try to open a tx page, no result if the hash was a blick instead
    if (address.length == 64) {
        chrome.tabs.create({
            url: 'https://chainz.cryptoid.info/blk/tx.dws?' + encodeURIComponent(address)
        });
    }
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == 'contextMenuId') {
        var text = info.selectionText.trim();
        openAddressInfo(text);
    }
});

//add a message listener
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == 'updateContextMenu') {  
        // Does it start with B or b (halo addresses start with lower case)? No BLK address if not
        var text = request.text.trim();
        var first = text.toLowerCase().substring(0, 1); 
        // only alpahnumeric?
        var r = /^[a-z0-9]+$/i
        var match = r.exec(text);  
        // also checking length, address is 34 characters, tx 64        
        if (request.selection && match && ((text.length == 34 && first == 'b') || text.length == 64)) {
            var title = text.length == 34 ? 'Address' : 'Transaction';
            chrome.contextMenus.update('contextMenuId', {
                'title': 'lookup BlackCoin ' + title,
                'enabled': true,
                "contexts": ['selection'],
            });
        } else {
            chrome.contextMenus.update('contextMenuId', {
                'title': 'No BlackCoin Address or Transaction',
                'enabled': false,
                "contexts": ['selection']
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
    'title': 'lookup BlackCoin Adresses/Transactions',
    "contexts": ['selection']
});
