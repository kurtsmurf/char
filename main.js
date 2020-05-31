const getLineHeight = () => {
  const testPre = document.createElement('pre')
  testPre.style.position = 'absolute'
  testPre.style.top = -1000
  testPre.innerText = 'A'
  
  document.body.appendChild(testPre)
  
  const lineHeight =  testPre.getBoundingClientRect().height
    / testPre.computedStyleMap().get('font-size').value
  
  document.body.removeChild(testPre)
  
  return lineHeight
}

const worker = new Worker('worker.js')

const processImage = img => {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  
  const context = canvas.getContext('2d')
  context.drawImage(img, 0, 0)

  const imageData = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
  const lineHeight = getLineHeight()

  worker.postMessage({ imageData, lineHeight })
}

const img = document.getElementById('source')
img.src = './trees.jpeg'
img.onload = () => {
  processImage(img)
}

const fileElem = document.getElementById('fileElem')
fileElem.addEventListener('change', (e) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  reader.onload = e => img.src = e.target.result
  reader.readAsDataURL(file)
})

const pre = document.getElementById('target')

worker.onmessage = e => pre.innerText = e.data.result
worker.onerror = e => console.log(e)