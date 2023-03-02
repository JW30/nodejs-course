const img = document.getElementsByClassName("product-img-large")[0];
const toggleBtn = document.getElementById("toggle-btn");
const textCol = document.getElementById("text-col");
const description = document.getElementById("description");

let collapsed = false;

function toggle() {
    if (collapsed) {
        description.style.maxHeight = "100%";
        toggleBtn.innerHTML = "Read less";
        collapsed = false;
    } else {
        description.style.overflow = "hidden";
        description.style.maxHeight = img.offsetHeight + "px";
        while (textCol.offsetHeight > img.offsetHeight) {
            description.style.maxHeight = description.offsetHeight - 1 + "px";
        }
        toggleBtn.innerHTML = "Read more";
        collapsed = true;
    }
}

function isToggleNecessary() {
    const descriptionMaxHeight = description.style.maxHeight;
    description.style.maxHeight = "100%";
    const toggleBtnDisplay = toggleBtn.style.display;
    toggleBtn.style.display = "none";

    const isNecessary = textCol.offsetHeight > img.offsetHeight;

    toggleBtn.style.display = toggleBtnDisplay;
    description.style.maxHeight = descriptionMaxHeight;
    return isNecessary;
}

function updateToggle() {
    if (isToggleNecessary()) {
        toggleBtn.style.display = "inline-block";
        // Toggle twice to get previous state
        toggle();
        toggle();
    } else {
        console.log("Unnecessary");
        toggleBtn.style.display = "none";
        description.maxHeight = "100%";
    }
}

// Collapse
toggle();

// Hide toggle if not necessary
updateToggle()

window.onresize = updateToggle;