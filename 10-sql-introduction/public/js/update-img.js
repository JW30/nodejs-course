const image = document.getElementsByClassName("edit-img")[0];
const inputURL = document.getElementById("imageURL");

const updateImage = () => {
    image.src = inputURL.value;
}

inputURL.onchange = updateImage;