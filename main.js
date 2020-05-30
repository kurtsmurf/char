const worker = new Worker('worker.js')

const img = document.getElementById('source')
img.src = './trees.jpeg'

const pre = document.getElementById('target')

const processImage = img => {
  const canvas = document.createElement('canvas')

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  const context = canvas.getContext('2d')
  context.filter = 'grayscale()'
  context.drawImage(img, 0, 0)

  const imageData = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight)

  worker.postMessage(imageData)
}

img.onload = () => {
  processImage(img)
}

worker.onmessage = e => {
  pre.innerText = e.data.result
  // pre.style.fontSize = e.data.fontSize
}

worker.onerror = e => console.log(e)

const fileInput = document.getElementById('fileElem')

fileInput.addEventListener('change', (e) => handleFiles(e.target.files))

function handleFiles(files) {
  arr = [...files]
  arr.forEach(handleFile)
}

handleFile = (file) => {
  const reader = new FileReader()
  
  reader.onload = e => {
    img.src = e.target.result
  }

  reader.readAsDataURL(file)
}