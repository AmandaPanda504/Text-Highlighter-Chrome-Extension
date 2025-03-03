// content.js

// Listen for the selection of text on the page
document.addEventListener("mouseup", () => {
    let selectedText = window.getSelection().toString().trim();

    // Check if the selected text is not empty
    if (selectedText.length > 0) {
        console.log("Selected text:", selectedText);

        // Send the selected text to the background.js script for further processing
        chrome.runtime.sendMessage({ 
            type: "highlightText", 
            text: selectedText 
        }, (response) => {
            console.log("Response from background:", response);
        });
    }
});

document.addEventListener("mouseup", () => {
    let selectedText = window.getSelection().toString().trim();

    // Check if the selected text is not empty
    if (selectedText.length > 0) {
        console.log("Selected text:", selectedText);

        // Send the selected text to the background.js script for further processing
        chrome.runtime.sendMessage({ type: "saveHighlightedText", text: selectedText }, function(response) {
            if (chrome.runtime.lastError) {
                console.error("Error sending message to background.js:", chrome.runtime.lastError);
            } else {
                console.log("Response from background.js:", response);
            }
        });
    }
});

chrome.runtime.sendMessage({ 
    type: "highlightText", 
    text: selectedText 
}, (response) => {
    if (response) {
        console.log("Response from background:", response);
        console.log("Success:", response.success);
        console.log("Text processed:", response.text);
    } else {
        console.error("No response received from background.");
    }
});

