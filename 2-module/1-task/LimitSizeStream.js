const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

let bytes = '';

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = 0;
    this.buffer = 0;

    if (options.limit != undefined) {
      this.limit = options.limit;
    }

  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.length;
    if (this.buffer >= this.limit && this.limit != 0) {
      callback(new LimitExceededError(), chunk);
    } else {
      callback(null, chunk);
    }

  }



  

}

module.exports = LimitSizeStream;
