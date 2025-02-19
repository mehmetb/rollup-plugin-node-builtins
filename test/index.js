var vm = require('vm');
var rollup = require('rollup');
var builtins = require('..');
var globals = require('rollup-plugin-node-globals');
var os = require('os');
var constants = require('constants');
var debug = require('debug')('builtins:test');
var files = [
  'events.js',
  'url-parse.js',
  'url-format.js',
  'stream.js',
  'assert.js',
  'constants.js',
  'os.js',
  'path.js',
  'string-decoder.js',
  'zlib.js',
  'domain.js',
];
describe('rollup-plugin-node-builtins', function() {
  files.forEach(function(file) {
    it('works with ' + file, function(done) {
      var config = {
        input: 'test/examples/' + file,
        plugins: [
          builtins()
        ]
      };
      if (file === 'url-parse.js' || file === 'domain.js' || file ===   'url-format.js' || file === 'stream.js' || file === 'assert.js' || file === 'string-decoder.js' || file === 'zlib.js') {
        config.plugins.push(globals());
      }
      rollup.rollup(config)
        .then((bundle) => bundle.generate({}))
        .then((generated) => {
          const { code } = generated.output[0];
          debug(code);
          var script = new vm.Script(code);
          var context = vm.createContext({
            done: done,
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            console: console,
            _constants: constants,
            _osEndianness: os.endianness()
          });
          context.self = context;
          script.runInContext(context);
        }).catch(done);
    });
  })
})
