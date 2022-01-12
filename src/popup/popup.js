document.addEventListener("DOMContentLoaded", function () {

    function fillInputs(){
        let pageInputs = document.getElementsByTagName("input");
        chrome.storage.sync.get("fillValue", ({ fillValue }) => {
            Array.from(pageInputs).forEach((input) => {
                input.value = fillValue;
            });
        });
    }

    async function callInjectFillInputs(){
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: fillInputs,
        });
        
    }

    


    document.getElementById("fill-button").addEventListener("click", callInjectFillInputs);
    document.getElementById("fill-input").addEventListener("change", () => {
        chrome.storage.sync.set({ fillValue: document.getElementById("fill-input").value });
        chrome.storage.local.set({ fillValue: document.getElementById("fill-input").value });
    });


    chrome.storage.local.get("fillValue", ({ fillValue }) => {
        
        document.getElementById("fill-input").value = fillValue ?? "";
    });
});