/*eslint-env node, commonjs*/

let path = require('path');

let D = path.resolve(__dirname, 'font');

let HtmlWebpackPlugin = require('html-webpack-plugin');
let VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	mode: 'development',

	entry: path.resolve(D, '_asset', 'index.js'),

	output: {
		path: path.resolve(D, '..', 'dist'),
		publicPath: './',
		filename: '[name].js',
		chunkFilename: 'sub[name].js'
	},

	resolve: {
		extensions: ['.js', '.vue'],
		alias: {
			'Vue': 'vue/dist/vue.min.js'
		}
	},

	module: {
		rules: [ {
			test: /\.css$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: true,
					}
				}
			]
		}, {
			test: /\.vue$/,
			use: [
				'vue-loader'
			],
		}, {
			test: /\.(png|jpg|gif)$/,
			loader: [
				{
					loader: 'url-loader',
					options: {
						limit: 1,
						name: './img/[name].[ext]'
					}
				}
			]
		}]
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			filename: path.join(D, '..', 'dist', 'index.html'),
			template: path.join(D, '_asset', 'index.html'),
			inject: true,
			hash: true
		}),
	]
};