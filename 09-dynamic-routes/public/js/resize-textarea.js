const imageDiv = document.getElementById("detail-img");
const text = document.getElementById("detail-text");
const textarea = document.getElementsByTagName("textarea")[0];

const resizeTextarea = () => {
    console.log(text.offsetHeight, text.scrollHeight);
    while (text.offsetHeight < imageDiv.offsetHeight) {
        console.log(1);
        textarea.rows += 1;
    }
    textarea.rows -= 1;
}

resizeTextarea();

window.onresize = resizeTextarea;

