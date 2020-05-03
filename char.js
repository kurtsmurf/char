const cnvsAlpha = document.getElementById('left')
const cnvsImage = document.getElementById('right')

const img = new Image()
img.src = './flower.jpeg'
img.onload = () => {
  setItOff()
}

const setItOff = () => {
  cnvsImage.height = img.height
  cnvsImage.width = img.width

  cnvsAlpha.height = img.height
  cnvsAlpha.width = img.width

  const ctxAlpha = cnvsAlpha.getContext('2d')
  const fontHeight = 24

  ctxAlpha.textBaseline = 'hanging'
  ctxAlpha.font = `${fontHeight}px monospace`

  const textMetrics = ctxAlpha.measureText("M")
  const charWidth = textMetrics.width

  const widthChars = Math.ceil(cnvsAlpha.width / charWidth)
  const heightChars = Math.ceil(cnvsAlpha.height / fontHeight)

  const chars = [...new Array(95)].map((_, i) => String.fromCharCode(i + 32))

  ctxAlpha.clearRect(0, 0, charWidth, fontHeight)
  const charBoxes = chars.map(char => {
    ctxAlpha.fillText(char, 0, 0)
    const cell = ctxAlpha.getImageData(0, 0, charWidth, fontHeight)
    ctxAlpha.clearRect(0, 0, charWidth, fontHeight)

    return cell.data.filter((v, i) => i % 4 === 3)
  })

  const c = cnvsImage.getContext('2d')
  c.filter = 'grayscale()'
  c.drawImage(img, 0, 0)

  const imgBoxes = [...new Array(widthChars * heightChars)].map((_, i) => {
    const x = (i % widthChars) * charWidth
    const y = Math.floor(i / widthChars) * fontHeight

    const cell = c.getImageData(x, y, charWidth, fontHeight)
    return cell.data.filter((v, i) => i % 4 === 0)
  })

  const diffBoxes = (a, b) => {
    return a.reduce((acc, curr, i) => {
      const diff = Math.abs(curr - b[i])
      return acc + diff
    }, 0)
  }

  const getBestChar = imgBox => {
    const bestMatch = charBoxes
      .map(charBox => diffBoxes(charBox, imgBox))
      .reduce((acc, cur, i) => {
        const useCur = cur > acc.value

        return {
          value: useCur ? cur : acc.value,
          index: useCur ? i : acc.index
        }
      }, {value: 0, index: 0})

    return chars[bestMatch.index]
  }

  const charVersion = imgBoxes.map(imgBox => {
    return getBestChar(imgBox)
  })

  charVersion.forEach((char,index) => {
    const x = (index % widthChars) * charWidth
    const y = (Math.floor(index / widthChars)) * fontHeight
    
    ctxAlpha.fillText(char, x, y)
  })
}





