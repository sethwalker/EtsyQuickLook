// ==UserScript==
// @name           Etsy Quick Look
// @namespace      http://developer.etsy.com/greasemonkey
// @description    greasemonkey script for quickly showing larger listing images on search / browse pages.
// @include        http://wiki.greasespot.net/Greasemonkey_Manual:Editing
// @include        http://www.etsy.com/
// @include        http://www.etsy.com/search_results.php*
// ==/UserScript==

var API_KEY = '69d58et6t4n4k4rfkfw3xecr';

var listingCards;
listingCards = document.evaluate(
    "//*[@class='listing-card']",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

var listingIds = [];
for (var i = 0; i < listingCards.snapshotLength; i++) {
    listingCard = listingCards.snapshotItem(i);
    listingIds[i] = listingCard.id.replace('lid','');
}

url="http://openapi.etsy.com/v2/sandbox/public/listings/" 
  + listingIds.join(',') 
  + "?api_key=" + API_KEY
  + "&includes=Images";
GM_xmlhttpRequest({ method: "GET", 
                    url: url, 
                    onload: onListingsLoaded });

function onListingsLoaded(response) {
    if(window.JSON && JSON.parse){
        data = JSON.parse(response.responseText);
    }
    else{
        data = eval("("+response.responseText+")");
    }

    data.results.forEach(addQuickLook);
}

function addQuickLook(listing) {
    createOverlay(listing);
    addLinkOnHover(listing);
}

function createOverlay(listing) {
}

function addLinkOnHover(listing) {
    link = document.createElement('a');
    link.addEventListener('click', showQuickLook(listing), true);
    link.appendChild(document.createTextNode('quick look'));
    link.style.position = 'absolute';
    link.style.top = '60px';
    link.style.left = '75px';
    link.style.backgroundColor = 'white';
    link.style.display = 'none';
    listingCard = document.getElementById('lid'+listing.listing_id);
    listingCard.appendChild(link);
    listingCard.addEventListener('mouseover', showQuickLookLink(link), true);
    listingCard.addEventListener('mouseout', removeQuickLookLink(link), true);
}

function showQuickLookLink(link) {
    var callback = function(event) {
        link.style.display = 'inline';
    }
    return callback;
}

function removeQuickLookLink(link) {
    var callback = function(event) {
        link.style.display = 'none';
    }
    return callback;
}

function showQuickLook(listing) {
    var callback = function(event) {
        imageDiv = document.createElement('div');
        imageDiv.style.position = 'absolute';
        imageDiv.style.zIndex = 1000;
        imageDiv.style.left = '-100px';
        image = document.createElement('img');
        image.src = listing.Images[0].url_570xN;
        image.style.height = 'auto';
        image.style.width = 'auto';
        imageDiv.appendChild(image);
        event.target.appendChild(imageDiv);
        return false;
    }
    return callback;
}
