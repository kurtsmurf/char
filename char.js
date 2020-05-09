const worker = new Worker('worker.js')

const cnvsAlpha = document.getElementById('left')
const cnvsImage = document.getElementById('right')

const img = new Image()
img.src = './flower.jpeg'

img.onload = () => {
  cnvsImage.height = img.height
  cnvsImage.width = img.width
  
  cnvsAlpha.height = img.height
  cnvsAlpha.width = img.width

  const ctxImg = cnvsImage.getContext('2d')
  ctxImg.filter = 'grayscale()'
  ctxImg.drawImage(img, 0, 0)

  worker.postMessage(ctxImg.getImageData(0,0,img.width,img.height))
}

worker.onmessage = e => {
  console.log(e.data)  

  cnvsAlpha.getContext('2d').putImageData(e.data, 0, 0)
}

worker.onerror = e => console.log(e)