const image = document.getElementsByClassName("edit-img")[0];
const inputURL = document.getElementById("image");

const updateImage = () => {
    image.src = inputURL.value;
}

inputURL.onchange = updateImage;