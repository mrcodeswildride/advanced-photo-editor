let canvas = document.getElementById(`canvas`)
let image = document.getElementById(`image`)
let video = document.getElementById(`video`)
let context = canvas.getContext(`2d`)

let decreaseRedButton = document.getElementById(`decreaseRedButton`)
let increaseRedButton = document.getElementById(`increaseRedButton`)
let decreaseGreenButton = document.getElementById(`decreaseGreenButton`)
let increaseGreenButton = document.getElementById(`increaseGreenButton`)
let decreaseBlueButton = document.getElementById(`decreaseBlueButton`)
let increaseBlueButton = document.getElementById(`increaseBlueButton`)

let invertButton = document.getElementById(`invertButton`)
let blackAndWhiteButton = document.getElementById(`blackAndWhiteButton`)
let file = document.getElementById(`file`)
let cameraButton = document.getElementById(`cameraButton`)
let pictureButton = document.getElementById(`pictureButton`)
let colorDisplay = document.getElementById(`colorDisplay`)
let colorParagraph = document.getElementById(`colorParagraph`)

decreaseRedButton.addEventListener(`click`, decreaseRed)
increaseRedButton.addEventListener(`click`, increaseRed)
decreaseGreenButton.addEventListener(`click`, decreaseGreen)
increaseGreenButton.addEventListener(`click`, increaseGreen)
decreaseBlueButton.addEventListener(`click`, decreaseBlue)
increaseBlueButton.addEventListener(`click`, increaseBlue)

invertButton.addEventListener(`click`, invert)
blackAndWhiteButton.addEventListener(`click`, blackAndWhite)
canvas.addEventListener(`click`, showColor)
file.addEventListener(`input`, chooseFile)
cameraButton.addEventListener(`click`, useCamera)
pictureButton.addEventListener(`click`, takePicture)

drawImage()
image.addEventListener(`load`, drawImage)

function drawImage() {
  if (image.width || image.videoWidth) {
    let width
    let height

    if (image.videoWidth) {
      width = image.videoWidth
      height = image.videoHeight
    } else if (image.width > image.height) {
      width = Math.min(image.width, canvas.width)
      height = width * (image.height / image.width)
    } else {
      height = Math.min(image.height, canvas.height)
      width = height * (image.width / image.height)
    }

    let offsetX = (canvas.width - width) / 2
    let offsetY = (canvas.height - height) / 2

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, offsetX, offsetY, width, height)
  }
}

function decreaseRed() {
  changeColor(0, -10)
}

function increaseRed() {
  changeColor(0, 10)
}

function decreaseGreen() {
  changeColor(1, -10)
}

function increaseGreen() {
  changeColor(1, 10)
}

function decreaseBlue() {
  changeColor(2, -10)
}

function increaseBlue() {
  changeColor(2, 10)
}

function changeColor(index, amount) {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height)

  for (let i = index; i < imageData.data.length; i += 4) {
    imageData.data[i] += amount
  }

  context.putImageData(imageData, 0, 0)
}

function invert() {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 255 - imageData.data[i]
    imageData.data[i + 1] = 255 - imageData.data[i + 1]
    imageData.data[i + 2] = 255 - imageData.data[i + 2]
  }

  context.putImageData(imageData, 0, 0)
}

function blackAndWhite() {
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < imageData.data.length; i += 4) {
    let sum = imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]
    let average = sum / 3

    imageData.data[i] = average
    imageData.data[i + 1] = average
    imageData.data[i + 2] = average
  }

  context.putImageData(imageData, 0, 0)
}

function showColor(event) {
  let x = event.offsetX
  let y = event.offsetY

  let imageData = context.getImageData(x, y, 1, 1)
  let rgba = imageData.data

  colorDisplay.style.backgroundColor = `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`
  colorParagraph.innerHTML = colorDisplay.style.backgroundColor
}

function chooseFile() {
  let reader = new FileReader()
  reader.addEventListener(`load`, loadFile)

  if (this.files[0]) {
    reader.readAsDataURL(this.files[0])
  }
}

function loadFile() {
  image = document.getElementById(`image`)
  image.src = this.result
}

function useCamera() {
  window.navigator.mediaDevices
    .getUserMedia({
      video: {
        width: canvas.width,
        height: canvas.height,
      },
    })
    .then(streamWebcamToVideo)
}

function streamWebcamToVideo(stream) {
  decreaseRedButton.disabled = true
  increaseRedButton.disabled = true
  decreaseGreenButton.disabled = true
  increaseGreenButton.disabled = true
  decreaseBlueButton.disabled = true
  increaseBlueButton.disabled = true

  invertButton.disabled = true
  blackAndWhiteButton.disabled = true
  file.disabled = true
  cameraButton.disabled = true
  pictureButton.disabled = false

  canvas.style.display = `none`
  video.style.display = `inline-block`
  video.srcObject = stream
  video.play()
}

function takePicture() {
  decreaseRedButton.disabled = false
  increaseRedButton.disabled = false
  decreaseGreenButton.disabled = false
  increaseGreenButton.disabled = false
  decreaseBlueButton.disabled = false
  increaseBlueButton.disabled = false

  invertButton.disabled = false
  blackAndWhiteButton.disabled = false
  file.disabled = false
  cameraButton.disabled = false
  pictureButton.disabled = true

  canvas.style.display = `inline-block`
  video.style.display = `none`
  image = video
  drawImage()
}
