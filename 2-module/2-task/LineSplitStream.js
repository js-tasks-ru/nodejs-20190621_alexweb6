const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.string = '';
    this.array = '';
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
      this.buffer += chunk.toString((encoding === 'buffer')?'utf8':encoding);
      const arrayStrings = this.buffer.split(os.EOL);
      const arrayStringsLast = arrayStrings.length - 1;

      for (let i = 0; i < arrayStringsLast; i++) {
          this.push(arrayStrings[i]);
      }; 

      this.buffer = arrayStrings[arrayStringsLast];


      callback();
  }

  _flush(callback) {
    this.push(this.buffer);
    callback();
  }

}

module.exports = LineSplitStream;
