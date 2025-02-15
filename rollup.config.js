const babel = require('@rollup/plugin-babel');

var external = Object.keys( require( './package.json' ).dependencies ).concat('path');
module.exports = {
	input: 'src/index.js',
	plugins: [ babel() ],
	external: external
};
