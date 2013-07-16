function clampTo8bit(a) {
  return a < 0 ? 0 : a > 255 ? 255 : a;
}

var TIMEOUT = 10;

function CopyImageDataTask(srcJpegData, numComponents, destImageData, finish) {
  this.data = srcJpegData;
  this.imageData = destImageData;
  this.width = this.imageData.width;
  this.height = this.imageData.height;
  this.imageDataArray = this.imageData.data;
  this.i = 0;
  this.j = 0;
  this.x = 0;
  this.y = 0;
  this.callback = CALLBACKS[numComponents];
  this.finish = finish;
  this.beginIterate();
};

CopyImageDataTask.prototype.beginIterate = function() {
  this.iterate(Date.now());
};

CopyImageDataTask.prototype.iterate = function(startTime) {
  while (true) {
    if (this.x === this.width) {
      this.x = 0;
      this.y++;
    }
    if (this.y >= this.height) {
      this.finish();
      break;
    }
    this.callback();
    this.x++;

    if (Date.now() - startTime > TIMEOUT) {
      requestAnimationFrame(this.beginIterate.bind(this));
      break;
    }
  }
};

var CALLBACKS = {
  1: function() {
    var Y = this.data[this.i++];

    this.imageDataArray[this.j++] = Y;
    this.imageDataArray[this.j++] = Y;
    this.imageDataArray[this.j++] = Y;
    this.imageDataArray[this.j++] = 255;
  },
  3: function() {
    var R = this.data[this.i++];
    var G = this.data[this.i++];
    var B = this.data[this.i++];

    this.imageDataArray[this.j++] = R;
    this.imageDataArray[this.j++] = G;
    this.imageDataArray[this.j++] = B;
    this.imageDataArray[this.j++] = 255;
  },
  4: function() {
    var C = this.data[this.i++];
    var M = this.data[this.i++];
    var Y = this.data[this.i++];
    var K = this.data[this.i++];

    var R = 255 - clampTo8bit(C * (1 - K / 255) + K);
    var G = 255 - clampTo8bit(M * (1 - K / 255) + K);
    var B = 255 - clampTo8bit(Y * (1 - K / 255) + K);

    this.imageDataArray[this.j++] = R;
    this.imageDataArray[this.j++] = G;
    this.imageDataArray[this.j++] = B;
    this.imageDataArray[this.j++] = 255;
  }
};