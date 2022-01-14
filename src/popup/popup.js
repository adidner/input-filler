document.addEventListener("DOMContentLoaded", function () {
    
    function isVisible(elem){
        const style = getComputedStyle(elem);
        console.log("style", style)
        if (style.display === 'none') return false;
        if (style.visibility !== 'visible') return false;
        return true;
    }

    function fillInputs(){
        let pageInputs = document.getElementsByTagName("input");
        chrome.storage.sync.get("fillValue", ({ fillValue }) => {
            Array.from(pageInputs).forEach((input) => {
                if(input.type == "text" || input.type == "number"){
                    console.log("input.value", input.value)
                    if(input.value == undefined || input.value == null || input.value == ""){
                        if(input.offsetParent !== null){ // checking if any parents have display:none on https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
                            input.value = fillValue;
                        }

                    }
                }
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