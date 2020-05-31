const diffCells = (a, b) => {
  return a.reduce((acc, curr, i) => {
    const diff = Math.abs(curr - b[i])
    return acc + diff
  }, 0)
}

const bestMatch = (cell, encoder) => {
  return encoder
    .map(glyphCharPair => {
      return {
        pair: glyphCharPair,
        score: diffCells(glyphCharPair.glyph, cell)
      }
    })
    .reduce((previous, current) => {
      return current.score > previous.score ? current : previous
    }).pair.char
}

const createOffscreenContext = (width, height, fontSize = 0) => {
  const offscreenCanvas = new OffscreenCanvas(width, height)
  const offscreenContext = offscreenCanvas.getContext('2d')
  offscreenContext.font = fontSize + 'px monospace'

  return offscreenContext
}

const createCharacterEncoder = (charSet, fontSize, boxWidth, boxHeight) => {
  const offscreenContext = createOffscreenContext(boxWidth, boxHeight, fontSize)

  return charSet.map(char => {
    offscreenContext.clearRect(0, 0, boxWidth, boxHeight)
    offscreenContext.fillText(char, 0, fontSize)

    const charImage = offscreenContext.getImageData(0, 0, boxWidth, boxHeight)

    // We only care about every 4th byte of the image data (the alpha values)
    const glyph = charImage.data.filter((v, i) => i % 4 === 3)

    return { char, glyph }
  })
}

const getImageCells = (imageData, cellWidth, cellHeight, columns, rows) => {
  const offscreenContext = createOffscreenContext(cellWidth * columns, cellHeight * rows)
  offscreenContext.filter = 'grayscale()'
  offscreenContext.putImageData(imageData, 0, 0)

  return [...new Array(columns * rows)].map((_, i) => {
    const x = (i % columns) * cellWidth
    const y = Math.floor(i / columns) * cellHeight
    const cell = offscreenContext.getImageData(x, y, cellWidth, cellHeight)

    // Since the image is grayscale, all color bytes will be the same - just take the first
    return cell.data.filter((v, i) => i % 4 === 0)
  })
}

onmessage = e => {
  const imageData = e.data.imageData
  const lineHeight = e.data.lineHeight
  const actualLineHeight = imageData.height / 64 // TODO: let user configure num lines
  const fontSize = actualLineHeight / lineHeight
  const charWidth = createOffscreenContext(imageData.width, imageData.height, fontSize).measureText('M').width
  const characterSet = [...new Array(95)].map((_, i) => String.fromCharCode(i + 32))
  const characterEncoder = createCharacterEncoder(characterSet, fontSize, charWidth, actualLineHeight)
  const widthInChars = Math.floor(imageData.width / charWidth)
  const heightInLines = Math.floor(imageData.height / actualLineHeight)
  const imageCells = getImageCells(imageData, charWidth, actualLineHeight, widthInChars, heightInLines)
  const resultChars = imageCells.map(cell => bestMatch(cell, characterEncoder))
  const result = resultChars.reduce((previous, current, index) => index % widthInChars === widthInChars - 1
                                                                  ? previous + current + '\n' : previous + current)

  postMessage({ result, fontSize })
}
