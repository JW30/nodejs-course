const image = document.getElementsByClassName("edit-img-large")[0];
const inputURL = document.getElementById("imageURL");

const updateImage = () => {
    if (inputURL.value.startsWith("http://") || inputURL.value.startsWith("https://")) {
        image.src = inputURL.value;
    }
}

inputURL.onchange = updateImage;