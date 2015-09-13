/* globals window, document */

(function (window, document) {

  /**
   * Ghoster class
   * This object take a canvas as parameter
   * which will be used to display grayscale
   * picture (via url or blob).
   * These pictures will be transformed the white
   * to transparent. 
   * @param {HTMLCanvasElement} canvas Destination canvas
   */
  function Ghoster (canvas) {
    this.canvasDst = canvas;
    
    this.canvasSrc = document.createElement('canvas');
    this.imgWidth  = 0;
    this.imgHeight = 0;
    this.color     = {r:0, v: 0, b: 0};
  }

  /**
   * Set a new image to display via it's url
   * @param {string} url Url to the picture
   * @return {Ghoster} Current instance
   */
  Ghoster.prototype.setImageUrl = function (url) {
    var img = new Image();
    img.src = url;
    img.addEventListener('load', function () {
      this.fillBackupCanvas(img);
      this.render();
    }.bind(this));
    return this;
  }

  /**
   * Set a new image to display via a Image object.
   * @param {Image} img Image object to display
   * @return {Ghoster} Current instance
   */
  Ghoster.prototype.setImageObject = function (img) {
    this.fillBackupCanvas(img);
    this.render();
    return this;
  }

  /**
   * When a new picture is set up, a reset must be
   * done on the existing objects: 
   * 
   * - width and height updated
   * - source canvas must get the new data
   * - update size attributes on canvases
   * 
   * @param  {Image} img Image object to set as source
   */
  Ghoster.prototype.fillBackupCanvas = function (img) {
    var context;

    this.imgWidth  = img.width;
    this.imgHeight = img.height;

    this.canvasDst.setAttribute('width',  this.imgWidth);
    this.canvasDst.setAttribute('height', this.imgHeight);

    this.canvasSrc.setAttribute('width',  this.imgWidth);
    this.canvasSrc.setAttribute('height', this.imgHeight);
    context = this.canvasSrc.getContext('2d');
    context.drawImage(img, 0, 0);
  };

  /**
   * Render the destination canvas from the
   * information set in the instance.
   * 
   */
  Ghoster.prototype.render = function () {
    var i, j,
      contextSrc = this.canvasSrc.getContext('2d'),
      imgDataSrc = contextSrc.getImageData(0, 0, this.imgWidth, this.imgHeight),
      contextDst = this.canvasDst.getContext('2d'),
      imgDataDst = contextDst.getImageData(0, 0, this.imgWidth, this.imgHeight);

    for (i = 0; i < this.imgWidth; i++) {
      for (j = 0; j < this.imgHeight; j++) {
        this.renderPoint(imgDataSrc.data, imgDataDst.data, i, j);
      }
    }

    contextDst.putImageData(imgDataDst, 0, 0);
  };

  /**
   * Render a specific point
   * @param  {Uint8ClampedArray} dataSrc Data from the source canvas
   * @param  {Uint8ClampedArray} dataDst Data from the destination canvas
   * @param  {number}            posx    X position of the point to update
   * @param  {number}            posy    Y position of the point to update
   */
  Ghoster.prototype.renderPoint = function (dataSrc, dataDst, posx, posy) {
    var dy = posy * this.imgWidth * 4;
    var pos = dy + posx * 4;
    dataDst[pos  ] = this.color.r || 0;
    dataDst[pos+1] = this.color.v || 0;
    dataDst[pos+2] = this.color.b || 0;
    dataDst[pos+3] = 255 - (dataSrc[pos] + dataSrc[pos+1] + dataSrc[pos+2])/3;
  };

  /**
   * Set a new color to render the picture.
   * This method won't force a new rendering.
   * @param {string} hexColor Hex color (:'#4e21ed')
   * @return {Ghoster} Current instance
   */
  Ghoster.prototype.setColor = function (hexColor) {
    this.color = {
      r: parseInt(hexColor.substr(1, 2), 16),
      v: parseInt(hexColor.substr(3, 2), 16),
      b: parseInt(hexColor.substr(5, 2), 16)
    }
    return this;
  };

  window.Ghoster = Ghoster;

})(window, document);