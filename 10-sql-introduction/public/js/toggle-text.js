const img = document.getElementById("detail-img");
const anchor = document.getElementById("toggle-btn");
const detailTxt = document.getElementById("detail-text");
const description = document.getElementById("description");

let collapsed = false;

const fixHeight = () => {
    while (Math.abs(detailTxt.offsetHeight - img.offsetHeight) >= 1) {
        if (detailTxt.offsetHeight < img.offsetHeight) {
            description.style.height = description.offsetHeight + 1 + "px";
        } else {
            description.style.height = description.offsetHeight - 1 + "px";
        }
    }
}

const toggle = () => {
    if (collapsed) {
        anchor.innerHTML = "Read less";
        collapsed = false;
        description.style.height = "auto";
        description.style.overflow = "auto";
        fixOnResize();
    } else {
        anchor.innerHTML = "Read more";
        collapsed = true;
        description.style.overflow = "hidden";
        fixHeight();
    }
}

const fixOnResize = () => {
    if (collapsed) {
        fixHeight();
    } else {
        if (detailTxt.offsetHeight <= img.offsetHeight) {
            anchor.style.display = "none";
        } else {
            anchor.style.display = "block";
        }
    }
}

fixOnResize();
if (anchor.style.display === "block") {
    toggle();
}

window.onresize = fixOnResize;



