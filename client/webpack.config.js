var path = require('path');

module.exports = {
	context: __dirname,
	devtool: 'source-map',
	entry: {
		app: './src/index.js'
	},
	watch: true,
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "index.js"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style-loader!css-loader" }//,
//			{ test: /\.png$/, loader: "url-loader?prefix=img/&limit=8192" },
//			{ test: /\.sass/, loader: "style-loader!css-loader!sass-loader" },
//			{ test: /\.jpg$/, loader: "url-loader?prefix=img/&limit=8192" },
//			{ test: /\.gif$/, loader: "url-loader?prefix=img/&limit=8192" }
		]
	},
	resolve: {
		extensions: ['', '.js', '.json'],
		modulesDirectories: ['lib', 'node_modules']
	},
	plugins: []
};
