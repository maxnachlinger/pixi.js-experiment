var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.png$/, loader: "url-loader?prefix=img/&limit=8192" }//,
//			{ test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
//			{ test: /\.jpg$/, loader: "url-loader?prefix=img/&limit=8192" },
//			{ test: /\.gif$/, loader: "url-loader?prefix=img/&limit=8192" }
		]
	},
	resolve: {
		extensions: ['', '.js', '.json'],
		modulesDirectories: ['lib', 'node_modules']
	},
	plugins: [new HtmlWebpackPlugin()]
};
