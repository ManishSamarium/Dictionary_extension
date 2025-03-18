document.addEventListener("dblclick", async function () {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data[0]) {
                    alert(`Meaning of "${selectedText}":\n${data[0].meanings[0].definitions[0].definition}`);
                } else {
                    alert("No definition found.");
                }
            })
            .catch(error => console.error("Error fetching meaning:", error));
    }
});
