document.addEventListener("DOMContentLoaded", () => {
    let wordInput = document.getElementById("wordInput");
    let resultDiv = document.getElementById("result");
    let historyBtn = document.getElementById("historyBtn");
    let historyList = document.getElementById("historyList");
    let clearHistoryBtn = document.getElementById("clearHistory");

    // Retrieve the selected word from storage
    chrome.storage.local.get("selectedWord", (data) => {
        if (data.selectedWord) {
            wordInput.value = data.selectedWord;
            chrome.storage.local.remove("selectedWord"); // Clear after use
        }
    });

    document.getElementById("searchBtn").addEventListener("click", function () {
        let word = wordInput.value.trim();
        if (word.length > 0) {
            fetchMeaning(word);
        }
    });

    function fetchMeaning(word) {
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data[0]) {
                    let meaning = data[0].meanings[0].definitions[0].definition;
                    resultDiv.innerText = `Meaning: ${meaning}`;

                    // Save word + meaning in history
                    saveWord({ word, meaning });
                } else {
                    resultDiv.innerText = "No definition found.";
                }
            })
            .catch(error => console.error("Error fetching meaning:", error));
    }

    // Save word + meaning to history in storage
    function saveWord(entry) {
        chrome.storage.local.get({ history: [] }, (data) => {
            let history = data.history || [];
            let exists = history.some(item => item.word === entry.word); // Avoid duplicates
            if (!exists) {
                history.push(entry);
                chrome.storage.local.set({ history: history });
            }
        });
    }

    // Show history when "Show History" button is clicked
    historyBtn.addEventListener("click", () => {
        historyList.innerHTML = ""; // Clear old list
        chrome.storage.local.get({ history: [] }, (data) => {
            let history = data.history || [];
            history.forEach((entry, index) => {
                let li = document.createElement("li");
                li.innerHTML = `
                    <strong>${entry.word}:</strong> ${entry.meaning}
                    <button class="delete-btn" data-index="${index}">❌</button>
                `;
                historyList.appendChild(li);
            });

            // Add delete functionality
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", function () {
                    let index = this.getAttribute("data-index");
                    history.splice(index, 1);
                    chrome.storage.local.set({ history: history }, function () {
                        historyBtn.click(); // Refresh history display
                    });
                });
            });
        });
    });

    // Clear history
    clearHistoryBtn.addEventListener("click", () => {
        chrome.storage.local.set({ history: [] }, () => {
            historyList.innerHTML = "";
        });
    });
});
