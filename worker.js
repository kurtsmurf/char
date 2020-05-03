onmessage = e => {
  postMessage(imageToText(e.data))
}

// {
//   action: "IMAGE_TO_TEXT",
//   imageData: imageData,
//   characterData: charSetImageData,
//   fontSize: fontSize
// }
const imageToText = (e) => {
  
  const imgDataFiltered = nth(e.imageData.data, 4, 0)
  const charDataFiltered = nth(e.characterData.imageData.data, 4, 3)

  console.log('blerp')

  const imgBoxes = getBoxes(
    imgDataFiltered,
    e.imageData.width,
    e.imageData.height,
    e.characterData.charWidth,
    e.fontSize
  )

  const charBoxes = getBoxes(
    charDataFiltered,
    e.characterData.imageData.width,
    e.characterData.imageData.height,
    e.characterData.boxWidth,
    e.fontSize
  )

  console.log(imgBoxes)
}

const getBoxes = (data, width, height, boxWidth, boxHeight) => {

  const widthInBoxes = Math.ceil(width / boxWidth)
  const heightInBoxes = Math.ceil(height / boxHeight)

  const result = new Array(widthInBoxes * heightInBoxes)

  for (i = 0; i < result.length; i++) {
    const x = (i % widthInBoxes) * boxWidth
    const y = Math.floor(i / widthInBoxes) * boxHeight

    // result[i] = getBox(imageData, x, y, boxWidth, boxHeight)
  }

  return result
}

const getBox = (data, w, h, x, y, sw, sh) => {
  return imageData.data.reduce()
}

const nth = (arr, n, offset = 0) => {
  return arr.filter((_, i) => i % n === offset)
}




// const diffBoxes = (a, b) => {
//   return a.reduce((acc, curr, i) => {
//     const diff = Math.abs(curr - b[i])
//     return acc + diff
//   }, 0)
// }

// const getBestChar = imgBox => {
//   const bestMatch = charBoxes
//     .map(charBox => diffBoxes(charBox, imgBox))
//     .reduce((acc, cur, i) => {
//       const useCur = cur > acc.value

//       return {
//         value: useCur ? cur : acc.value,
//         index: useCur ? i : acc.index
//       }
//     }, { value: 0, index: 0 })

//   return chars[bestMatch.index]
// }

// const charVersion = imgBoxes.map(imgBox => {
//   return getBestChar(imgBox)
// })

// charVersion.forEach((char, index) => {
//   const x = (index % widthChars) * charWidth
//   const y = (Math.floor(index / widthChars)) * fontHeight

//   ctxAlpha.fillText(char, x, y)
// })
