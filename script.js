"use strict";

function loadImage (src) {
  return new Promise (success => {
    const img = new Image ();
    img.onload = _ => success (img);
    img.crossOrigin = "Anonymous";
    img.src = src;
  });
}

function createImageData (img, w, h) {
  const layer = document.createElement ("canvas");
  layer.width = w;
  layer.height = h;
  const cty = layer.getContext ("2d");
  const ratio = img.width / img.height;
  const iw = h * ratio;
  const ix = (w - iw) / 2;
  cty.fillStyle = "#0C0C0C";
  cty.fillRect (0, 0, w, h);
  cty.drawImage (img, ix, 0, iw, h);
  return cty.getImageData (0, 0, w, h);
}

class Thread {
  constructor (ctx) {
    if (window.Worker) {
      const url = window.URL || window.webkitURL;
      const blob = new Blob ([
        "(" + ctx.toString () + ")()"
      ]);
      const urlWorker = url.createObjectURL (blob);
      this.worker = new Worker (urlWorker);
      url.revokeObjectURL (blob);
      if ("postMessage" in this === false)
        this.__proto__.postMessage = this.worker.postMessage.bind (this.worker);
      this.threading = true;
    }
    else {
      this.worker = window.frames;
      this.threading = false;
    }
  }
  set onmessage (ctx) {
    this.worker.onmessage = ctx;
  }
  set onerror (ctx) {
    this.worker.onerror = ctx;
  }
}

function secondContext ()  {
  "use strict";

  const treshold = 1500;
  let width, height;
  let imageBuffer;
  let frameBuffer;

  onmessage = e => {
    switch (e.data.type) {
      case "dataimage":
        width = e.data.width;
        height = e.data.height;
        imageBuffer = e.data.imageData.data;
        break;
      case "running":
        frameBuffer = e.data.frameBuffer;
        let view32 = new Uint32Array (frameBuffer);
        let now = performance.now ();
        for (let i = 0; i < height; i++) {
          let counter = treshold * 2 - Math.ceil (now) % treshold;
          for (let j = 0; j < width; j++) {
            let index0 = i * width + j;
            let index1 = index0 * 4;
            counter += (
              imageBuffer [index1] +
              imageBuffer [index1 + 1] +
              imageBuffer [index1 + 2]
            ) / 3;
            if (counter > treshold) {
              view32 [index0] = 0xFFFCFCFC;
              counter -= treshold / 2;
            }
            else {
              view32 [index0] = 0xFF402300;
            }
          }
        }
        postMessage ({
          frameBuffer: frameBuffer
        },
        [frameBuffer]);
    }
  }

}

const source = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/260px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg";
const canvas = document.getElementById ("canvas0");
const ctx = canvas.getContext ("2d");
let imageData;
let frameBuffer;
let requestID;
const thread = new Thread (secondContext);
thread.onmessage = e => {
  frameBuffer = e.data.frameBuffer;
  requestID = requestAnimationFrame (frame);
}

function transfertBuffer () {
  thread.postMessage ({
    type: "running",
    frameBuffer: frameBuffer
  },
  [frameBuffer]);
}

function resize (img) {
  if (requestID) window.cancelAnimationFrame (requestID);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  imageData = createImageData (img, canvas.width, canvas.height);
  thread.postMessage ({
    type: "dataimage",
    width: canvas.width,
    height: canvas.height,
    imageData: imageData
  });
  frameBuffer = new ArrayBuffer (canvas.width * canvas.height * 4);
  transfertBuffer ();
}

function frame () {
  imageData = new ImageData (
    new Uint8ClampedArray (frameBuffer),
    canvas.width,
    canvas.height);
  ctx.putImageData (imageData, 0, 0);
  transfertBuffer ()
}

loadImage (source).then (img => {
  window.addEventListener ("resize", _ => resize (img), false);
  resize (img);
});
