
var Canvas = require('canvas')
  , fs = require('fs')
  , db
  , async = require('async')

eval(fs.readFileSync('db.js', 'utf-8'))

async.forEachSeries(db, function(pattern, callback) {
  var eyecatch = pattern.eyecatch
    , image = new Canvas.Image
  console.log(eyecatch)
  image.src = fs.readFileSync('eyecatch/' + eyecatch)

  var c1 = new Canvas(image.width, image.height)
    , ct1 = c1.getContext('2d')
  ct1.drawImage(image, 0, 0, image.width, image.height)

  var x1 = 0
    , y1 = 0
    , x2 = image.width - 1
    , y2 = image.height - 1
    , data = ct1.getImageData(0, 0, c1.width, c1.height)

  function white(idt) {
    for (var i = 0; i < idt.data.length; i += 4) {
      if ((idt.data[i] + idt.data[i + 1] + idt.data[i + 2]) / 3 < 240) return false
    }
    return true
  }

  while (white(ct1.getImageData(0, y1, c1.width, 1))) y1 += 4
  while (white(ct1.getImageData(0, y2, c1.width, 1))) y2 -= 4
  while (white(ct1.getImageData(x1, 0, 1, c1.height))) x1 += 4
  while (white(ct1.getImageData(x2, 0, 1, c1.height))) x2 -= 4

  x1 += 4
  y1 += 4
  x2 -= 4
  y2 -= 4

  var cx = (x1 + x2) / 2
    , cy = (y1 + y2) / 2

  var nw = x2 - x1
    , nh = y2 - y1

  nh = Math.min(nh, nw * 9 / 16)
  nw = Math.min(nw, nh * 16 / 9)

  var fromSize = nw * nw + nh * nh
    , toSize = 960 * 960 + 540 * 540

  var c2 = new Canvas(960, 540)
    , ct2 = c2.getContext('2d')

  ct2.translate(c2.width / 2, c2.height / 2)
  var scale = (Math.sqrt(toSize / fromSize))
  ct2.scale(scale, scale)
  ct2.translate(-cx, -cy)
  ct2.drawImage(c1, 0, 0, c1.width, c1.height)

  var out = fs.createWriteStream('small-eyecatch/' + eyecatch)
    , stream = c2.createJPEGStream()

  stream.pipe(out)
  out.on('close', function() {
    console.log('written')
    callback()
  })

})










