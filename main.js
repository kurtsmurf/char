const worker = new Worker('worker.js')

const cnvsAlpha = document.getElementById('alpha')
const cnvsImage = document.getElementById('image')

const img = new Image()
img.src = './trees.jpeg'

let animationTimeout;

const startLoadingAnimation = () => {
  const ctxAlpha = cnvsAlpha.getContext('2d')
  ctxAlpha.font = cnvsAlpha.width / 24 + 'px monospace'
  
  const x = (cnvsAlpha.width / 2) - ctxAlpha.measureText("working...").width / 2
  const y = cnvsAlpha.height / 2

  const animate = (dots = "") => {
    const text = "working" + dots

    ctxAlpha.clearRect(0, 0, cnvsAlpha.width, cnvsAlpha.height)
    ctxAlpha.fillText(text, x, y)

    animationTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        animate(dots.length === 3 ? "" : dots + ".")
      })
    }, 400)
  }

  animate()
}

const stopLoadingAnimation = () => {
  clearTimeout(animationTimeout)
}

const processImage = img => {
  cnvsImage.height = img.height
  cnvsImage.width = img.width

  cnvsAlpha.height = img.height
  cnvsAlpha.width = img.width

  const ctxImg = cnvsImage.getContext('2d')
  ctxImg.filter = 'grayscale()'
  ctxImg.drawImage(img, 0, 0)

  startLoadingAnimation()
  worker.postMessage(ctxImg.getImageData(0, 0, img.width, img.height))
}

img.onload = () => {
  processImage(img)
}

worker.onmessage = e => {
  stopLoadingAnimation()
  cnvsAlpha.getContext('2d').putImageData(e.data, 0, 0)
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
    let img = new Image()

    img.onload = e => {
      cnvsImage.getContext('2d').drawImage(img,0,0)
      processImage(img)
    }
    
    img.src = e.target.result
  }

  reader.readAsDataURL(file)
}
