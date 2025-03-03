document.addEventListener('DOMContentLoaded', function () {
    // Retrieve the saved highlighted text from storage
    chrome.storage.local.get({ highlightedTexts: [] }, function (result) {
        const highlightedTextList = result.highlightedTexts;
        const listElement = document.getElementById('highlightedTextList');
        listElement.innerHTML = ""; // Clear previous content

        // Display each saved highlight with its corresponding URL
        highlightedTextList.forEach(function (item) {
            const li = document.createElement('li');

            // Display highlighted text
            const textElement = document.createElement('span');
            textElement.textContent = item.text;
            textElement.style.fontWeight = "bold";

            // Create a clickable URL
            const urlElement = document.createElement('a');
            urlElement.href = item.url;
            urlElement.textContent = item.url;
            urlElement.target = "_blank"; // Open in a new tab
            urlElement.style.fontSize = "12px";
            urlElement.style.color = "blue";
            urlElement.style.textDecoration = "underline";
            urlElement.style.display = "block"; // Ensures it appears on a new line

            // Append elements
            li.appendChild(textElement);
            li.appendChild(document.createElement('br')); // Line break
            li.appendChild(urlElement);
            listElement.appendChild(li);
        });
    });

    // Clear saved highlights when the "Clear Highlights" button is clicked
    document.getElementById('clearButton').addEventListener('click', function () {
        chrome.storage.local.set({ highlightedTexts: [] }, function () {
            const listElement = document.getElementById('highlightedTextList');
            listElement.innerHTML = ''; // Clear the list from the UI
        });
    });
});
