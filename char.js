const cnvsAlpha = document.getElementById('left')
const cnvsImage = document.getElementById('right')

const worker = new Worker('worker.js')

const loadImage = () => {
  const img = new Image()
  img.src = './flower.jpeg'
  
  cnvsImage.height = img.height
  cnvsImage.width = img.width
  
  cnvsAlpha.height = img.height
  cnvsAlpha.width = img.width

  img.onload = () => {
    const ctxImage = cnvsImage.getContext('2d')
    ctxImage.filter = 'grayscale()'
    ctxImage.drawImage(img, 0, 0)
  
    setItOff()
  }
}

const imageDataFromCharset = (charSet, fontSize) => {
  const canvas = document.createElement('canvas')
  const text = charSet.join('')

  let context = canvas.getContext('2d')
  context.textBaseline = 'hanging'
  context.font = fontSize + 'px monospace'

  const textWidth = context.measureText(text).width
  const charWidth = context.measureText("M").width

  console.log(textWidth, charWidth, charWidth * charSet.length)
  
  canvas.width = Math.ceil(textWidth)
  canvas.height = fontSize

  context = canvas.getContext('2d')
  context.textBaseline = 'hanging'
  context.font = fontSize + 'px monospace'

  context.fillText(text, 0, 0)
  
  return {
    imageData: context.getImageData(0,0,textWidth,fontSize),
    charWidth: charWidth
  }
}

const setItOff = () => {
  const fontSize = 24
  const chars = [...new Array(95)]
    .map((_, i) => String.fromCharCode(i + 32))

  const imageData = cnvsImage
    .getContext('2d')
    .getImageData(0,0,cnvsImage.width, cnvsImage.height)

  const charData = imageDataFromCharset(chars, fontSize)

  worker.postMessage({
    action: "IMAGE_TO_TEXT",
    imageData: imageData,
    characterData: charData,
    fontSize: fontSize
  })
}

loadImage()





