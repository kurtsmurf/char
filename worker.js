const diff = (a, b) => {
  return a.reduce((acc, curr, i) => {
    const diff = Math.abs(curr - b[i])
    return acc + diff
  }, 0)
}

const getBestGlyph = (cell, glyphs) => {
  return glyphs
    .map(glyph => diff(glyph, cell))
    .reduce((best, current, index) => {
      return {
        value: current > best.value ? current : best.value,
        index: current > best.value ? index : best.index
      }
    }, { value: 0, index: 0 })
}

onmessage = e => {
  const imageData = e.data.imageData
  const lineHeight = e.data.lineHeight
  const offscreenCanvas = new OffscreenCanvas(imageData.width, imageData.height)
  const actualLineHeight = imageData.height / 64
  const fontSize = actualLineHeight / lineHeight

  const offscreenContext = offscreenCanvas.getContext('2d')
  offscreenContext.font = fontSize + 'px monospace'

  const charWidth = offscreenContext.measureText('M').width

  const chars = [...new Array(95)].map((_, i) => String.fromCharCode(i + 32))

  const glyphs = chars.map(char => {
    offscreenContext.clearRect(0, 0, charWidth, actualLineHeight)
    offscreenContext.fillText(char, 0, fontSize)

    const glyph = offscreenContext.getImageData(0, 0, charWidth, actualLineHeight)

    return glyph.data.filter((v, i) => i % 4 === 3)
  })

  offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
  offscreenContext.putImageData(imageData, 0, 0)

  const widthInChars = Math.floor(imageData.width / charWidth)
  const heightInChars = Math.floor(imageData.height / actualLineHeight)

  const cells = [...new Array(widthInChars * heightInChars)].map((_, i) => {
    const x = (i % widthInChars) * charWidth
    const y = Math.floor(i / widthInChars) * actualLineHeight

    const cell = offscreenContext.getImageData(x, y, charWidth, actualLineHeight)

    return cell.data.filter((v, i) => i % 4 === 0)
  })

  const resultChars = cells.map(cell => {
    return chars[getBestGlyph(cell, glyphs).index]
  })

  const resultStr = resultChars.reduce((previous, current, index) => {
    if (index % widthInChars === widthInChars - 1) {
      return previous + current + '\n'
    } else {
      return previous + current
    }
  })

  console.log(resultStr)

  // postMessage(offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height))
  postMessage({
    result: resultStr,
    fontSize: fontSize
  })
}
