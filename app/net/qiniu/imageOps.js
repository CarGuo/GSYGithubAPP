/**
 * Created by buhe on 16/4/12.
 */
import util from './auth';
import rpc from './rpc';
import conf from './conf';

class ImageView {
  constructor(mode, width, height, quality, format) {
    this.mode = mode || 1;
    this.width = width || 0;
    this.height = height || 0;
    this.quality = quality || 0;
    this.format = format || null;
  }

  makeRequest(url) {
    url += '?imageView2/' + this.mode;

    if (this.width > 0) {
      url += '/w/' + this.width;
    }

    if (this.height > 0) {
      url += '/h/' + this.height;
    }

    if (this.quality > 0) {
      url += '/q/' + this.quality;
    }

    if (this.format) {
      url += '/format/' + this.format;
    }

    return url;
  }
}

class ImageInfo {
  makeRequest(url) {
    return url + '?imageInfo'
  }
}

class Exif {
  makeRequest(url) {
    return url + '?exif'
  }
}

export default {ImageView,ImageInfo,Exif}
