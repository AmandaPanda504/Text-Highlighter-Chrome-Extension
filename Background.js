// Ensure context menu is created when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed, creating context menu...");
    chrome.contextMenus.create({
        id: "highlightText",
        title: "Highlight Selected Text",
        contexts: ["selection"]
    });
});

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "highlightText") {
        console.log("Context menu clicked, highlighting text:", info.selectionText);
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: highlightText,
            args: [info.selectionText]
        });

        // Save the selected text along with the URL
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let pageURL = tabs[0].url;

            chrome.storage.local.get({ highlightedTexts: [] }, function (result) {
                let highlights = result.highlightedTexts;

                // Check for duplicate highlights before adding
                let exists = highlights.some(item => item.text === info.selectionText && item.url === pageURL);
                if (!exists) {
                    highlights.push({ text: info.selectionText, url: pageURL });

                    chrome.storage.local.set({ highlightedTexts: highlights }, function () {
                        console.log("Saved:", info.selectionText, "from", pageURL);
                    });
                } else {
                    console.log("Duplicate highlight detected, ignoring:", info.selectionText);
                }
            });
        });
    }
});

// Function to highlight text on the page
function highlightText(selectedText) {
    if (!selectedText) return;

    let selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    let range = selection.getRangeAt(0);
    let span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    span.textContent = selectedText;

    range.deleteContents();
    range.insertNode(span);
}

// Handle messages from popup.js to get the current URL
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getURL") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            sendResponse({ url: tabs[0].url });
        });
        return true; // Required for async sendResponse
    }
});
