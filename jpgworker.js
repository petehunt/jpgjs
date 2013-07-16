function getJpgData(url, width, height, cb) {
  var j = new JpegImage();
  j.onload = function() {
    var data = j.getData(width, height);
    cb({data: data, numComponents: j.components.length, width: j.width, height: j.height});
  };
  j.load(url);
}