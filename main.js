import { render, h, Fragment } from 'https://cdn.skypack.dev/preact';

const worker = new Worker('worker.js')
worker.onmessage = e => {
  const pre = document.createElement('pre')
  pre.innerText = e.data.result

  document.body.appendChild(pre)
}
worker.onerror = console.log

const ImageLoader = ({
  receiveImage
}) => h(
  'form',
  {},
  h(
    'input',
    {
      type: "file",
      accept: "image/*",
      onchange: e => receiveImage(e.target.files[0])
    }
  )
)

const App = () => {
  return (
    h(
      Fragment,
      {},
      h(
        ImageLoader,
        { receiveImage: processImage }
      )
    )
  )
}

render(h(App), document.querySelector('#App'))























// =========================================================== //
// =========================================================== //

function processImage(file) {
  const reader = new FileReader()

  reader.onload = e => {
    const img = document.createElement('img')
    img.src = e.target.result

    img.onload = e => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const context = canvas.getContext('2d')
      context.drawImage(img, 0, 0)

      const imageData = context.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
      const lineHeight = getLineHeight()

      worker.postMessage({ imageData, lineHeight })
    }
  }

  reader.readAsDataURL(file)
}

function getLineHeight() {
  const testPre = document.createElement('pre')
  testPre.style.position = 'absolute'
  testPre.style.top = -1000
  testPre.innerText = 'A'

  document.body.appendChild(testPre)

  const lineHeight = testPre.getBoundingClientRect().height
    / testPre.computedStyleMap().get('font-size').value

  document.body.removeChild(testPre)

  return lineHeight
}