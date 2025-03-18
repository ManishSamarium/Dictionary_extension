chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "findMeaning",
        title: "Find Meaning",
        contexts: ["selection"] // Only show when text is selected
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "findMeaning") {
        chrome.storage.local.set({ selectedWord: info.selectionText }, () => {
            chrome.action.openPopup(); // Open extension
        });
    }
});
