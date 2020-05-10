const diff = (a, b) => {
  return a.reduce((acc, curr, i) => {
    const diff = Math.abs(curr - b[i])
    return acc + diff
  }, 0)
}

const getBestGlyph = (cell, glyphs) => {
  return glyphs
    .map(glyph => {
      return diff(glyph, cell)
    })
    .reduce((best, current, index) => {
      return {
        value: current > best.value ? current : best.value,
        index: current > best.value ? index : best.index
      }
    }, { value: 0, index: 0 })
}

onmessage = e => {
  const offscreenCanvas = new OffscreenCanvas(e.data.width, e.data.height)
  const fontSize = 48

  const offscreenContext = offscreenCanvas.getContext('2d')
  offscreenContext.textBaseline = 'hanging'
  offscreenContext.font = fontSize + 'px monospace'

  const charWidth = offscreenContext.measureText('M').width

  const chars = [...new Array(95)].map((_, i) => String.fromCharCode(i + 32))

  const glyphs = chars.map(char => {
    offscreenContext.clearRect(0, 0, charWidth, fontSize)
    offscreenContext.fillText(char, 0, 0)

    const glyph = offscreenContext.getImageData(0, 0, charWidth, fontSize)

    return glyph.data.filter((v, i) => i % 4 === 3)
  })

  offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
  offscreenContext.putImageData(e.data, 0, 0)

  const widthInChars = Math.ceil(e.data.width / charWidth)
  const heightInChars = Math.ceil(e.data.height / fontSize)

  const cells = [...new Array(widthInChars * heightInChars)].map((_, i) => {
    const x = (i % widthInChars) * charWidth
    const y = Math.floor(i / widthInChars) * fontSize

    const cell = offscreenContext.getImageData(x, y, charWidth, fontSize)
    return cell.data.filter((v, i) => i % 4 === 0)
  })

  const resultChars = cells.map(cell => {
    return chars[getBestGlyph(cell, glyphs).index]
  })

  offscreenContext.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)

  resultChars.forEach((char, index) => {
    const x = (index % widthInChars) * charWidth
    const y = (Math.floor(index / widthInChars)) * fontSize

    offscreenContext.fillText(char, x, y)
  })

  postMessage(offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height))
}
