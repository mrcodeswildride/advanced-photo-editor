var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var image = document.getElementById("image");
var video = document.getElementById("video");

var redInput = document.getElementById("red");
var greenInput = document.getElementById("green");
var blueInput = document.getElementById("blue");
var invertColorsButton = document.getElementById("invertColors");
var blackAndWhiteButton = document.getElementById("blackAndWhite");
var fileInput = document.getElementById("file");
var useCameraButton = document.getElementById("useCamera");
var takePictureButton = document.getElementById("takePicture");
var colorDisplay = document.getElementById("colorDisplay");
var colorText = document.getElementById("colorText");

var width;
var height;
var offsetX;
var offsetY;
var original;

canvas.addEventListener("click", getColor);
redInput.addEventListener("input", changeRed);
greenInput.addEventListener("input", changeGreen);
blueInput.addEventListener("input", changeBlue);
invertColorsButton.addEventListener("click", invertColors);
blackAndWhiteButton.addEventListener("click", blackAndWhite);
fileInput.addEventListener("input", chooseFile);
useCameraButton.addEventListener("click", useCamera);
takePictureButton.addEventListener("click", takePicture);

drawImage();
image.addEventListener("load", drawImage);

function drawImage() {
    if (image.width || image.videoWidth) {
        if (image.videoWidth) {
            width = image.videoWidth;
            height = image.videoHeight;
        }
        else if (image.width > image.height) {
            width = Math.min(image.width, canvas.width);
            height = width * image.height / image.width;
        }
        else {
            height = Math.min(image.height, canvas.height);
            width = height * image.width / image.height;
        }

        offsetX = (canvas.width - width) / 2;
        offsetY = (canvas.height - height) / 2;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, offsetX, offsetY, width, height);
        setOriginal();
    }
}

function getColor(event) {
    var imageData = context.getImageData(event.offsetX, event.offsetY, 1, 1);
    var pixels = imageData.data;

    colorDisplay.style.backgroundColor = "rgb(" + pixels[0] + ", " + pixels[1] + ", " + pixels[2] + ")";
    colorText.innerHTML = "rgb(" + pixels[0] + ", " + pixels[1] + ", " + pixels[2] + ")";
}

function changeRed() {
    var imageData = context.getImageData(offsetX, offsetY, width, height);
    var pixels = imageData.data;
    var red = parseInt(redInput.value, 10);

    for (var i = 0; i < pixels.length; i += 4) {
        pixels[i] = original[i] + red;
    }

    context.putImageData(imageData, offsetX, offsetY);
}

function changeGreen() {
    var imageData = context.getImageData(offsetX, offsetY, width, height);
    var pixels = imageData.data;
    var green = parseInt(greenInput.value, 10);

    for (var i = 0; i < pixels.length; i += 4) {
        pixels[i + 1] = original[i + 1] + green;
    }

    context.putImageData(imageData, offsetX, offsetY);
}

function changeBlue() {
    var imageData = context.getImageData(offsetX, offsetY, width, height);
    var pixels = imageData.data;
    var blue = parseInt(blueInput.value, 10);

    for (var i = 0; i < pixels.length; i += 4) {
        pixels[i + 2] = original[i + 2] + blue;
    }

    context.putImageData(imageData, offsetX, offsetY);
}

function invertColors() {
    var imageData = context.getImageData(offsetX, offsetY, width, height);
    var pixels = imageData.data;

    for (var i = 0; i < pixels.length; i += 4) {
        pixels[i] = 255 - pixels[i];
        pixels[i + 1] = 255 - pixels[i + 1];
        pixels[i + 2] = 255 - pixels[i + 2];
    }

    context.putImageData(imageData, offsetX, offsetY);
    setOriginal();
}

function blackAndWhite() {
    var imageData = context.getImageData(offsetX, offsetY, width, height);
    var pixels = imageData.data;

    for (var i = 0; i < pixels.length; i += 4) {
        var averageColor = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;

        pixels[i] = averageColor;
        pixels[i + 1] = averageColor;
        pixels[i + 2] = averageColor;
    }

    context.putImageData(imageData, offsetX, offsetY);
    setOriginal();
}

function chooseFile() {
    var reader = new FileReader();
    reader.addEventListener("load", loadFile);

    if (this.files[0]) {
        reader.readAsDataURL(this.files[0]);
    }
}

function loadFile() {
    image = document.getElementById("image");
    image.src = this.result;
}

function useCamera() {
    window.navigator.mediaDevices.getUserMedia({
        video: {
            width: canvas.width,
            height: canvas.height
        }
    }).then(showVideo);
}

function showVideo(stream) {
    redInput.disabled = true;
    greenInput.disabled = true;
    blueInput.disabled = true;
    invertColorsButton.disabled = true;
    blackAndWhiteButton.disabled = true;
    fileInput.disabled = true;
    useCameraButton.disabled = true;
    takePictureButton.disabled = false;

    canvas.style.display = "none";
    video.style.display = "initial";
    video.srcObject = stream;
    video.play();
}

function takePicture() {
    redInput.disabled = false;
    greenInput.disabled = false;
    blueInput.disabled = false;
    invertColorsButton.disabled = false;
    blackAndWhiteButton.disabled = false;
    fileInput.disabled = false;
    useCameraButton.disabled = false;
    takePictureButton.disabled = true;

    video.style.display = "none";
    canvas.style.display = "initial";
    image = video;
    drawImage();
}

function setOriginal() {
    original = [];
    var imageData = context.getImageData(offsetX, offsetY, width, height);
    var pixels = imageData.data;

    for (var i = 0; i < pixels.length; i++) {
        original[i] = pixels[i];
    }

    redInput.value = 0;
    greenInput.value = 0;
    blueInput.value = 0;
}
