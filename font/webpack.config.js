const { sassResources, favicon, resolveAlias } = require('../fontendDymatic');

const _pa = require('path');

const R = _pa.resolve;
const RR = function(...paths) { return R(__dirname, ...paths); };

const pathDist = RR('..', 'dist');

const isProduction = process.env.npm_lifecycle_event == 'prod';

const Webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const mapLoader = {
	// css/sass/scss
	css: {
		loader: 'css-loader',
		options: {
			importLoaders: 1,
			esModule: false
		}
	},
	vueStyle: 'vue-style-loader',
	postcss: {
		loader: 'postcss-loader',
		options: {
			config: {
				path: RR()
			}
		}
	},
	sass: {
		loader: 'sass-loader',
		options: {
			sassOptions: {
				indentedSyntax: true
			}
		}
	},
	sassResources: {
		loader: 'sass-resources-loader',
		options: {
			resources: sassResources
		}
	},
	// js
	babel: {
		loader: 'babel-loader',
		options: {
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-proposal-class-properties',
				'@babel/plugin-proposal-optional-chaining'
			]
		}
	},
	// vue
	vue: 'vue-loader',
	// image
	url: {
		loader: 'url-loader',
		options: {
			limit: 1,
			name: './reso/[name].[ext]',
			esModule: false
		}
	}
};

const configuration = {
	mode: isProduction ? 'production' : 'development',

	entry: RR('index.js'),

	output: {
		path: pathDist,
		publicPath: './',
		filename: '[name].js',
		chunkFilename: '[name].[chunkhash:8].js'
	},

	resolve: {
		extensions: ['.js', '.vue'],
		alias: Object.assign(
			{ Vue: isProduction ? 'vue/dist/vue.esm.min.js' : 'vue/dist/vue.esm.js' },
			resolveAlias
		)
	},

	performance: {
		hints: false
	},

	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: [
				mapLoader.babel
			]
		}, {
			test: /\.s[ac]ss$/,
			use: [
				mapLoader.vueStyle,
				mapLoader.css,
				isProduction ? mapLoader.postcss : null,
				mapLoader.sass,
				mapLoader.sassResources,
			].filter(x => x)
		}, {
			test: /\.css$/,
			use: [
				mapLoader.vueStyle,
				mapLoader.css,
				isProduction ? mapLoader.postcss : null,
			].filter(x => x)
		}, {
			test: /\.vue$/,
			use: [
				mapLoader.vue
			],
		}, {
			test: /\.(png|jpg|gif)$/,
			use: [
				mapLoader.url
			]
		}]
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				favicon ? { from: favicon, to: RR(pathDist, 'favicon.ico') } : null,
			].filter(x => x)
		}),
		new Webpack.BannerPlugin({
			raw: true,
			banner() {
				return `var PACKTIME = ${new Date().getTime()};var HASH = '[hash]';`;
			},
			entryOnly: false,
			include: 'index.js'
		}),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			filename: RR(pathDist, 'index.html'),
			template: RR('index.html'),
			inject: true,
			hash: true
		}),
	],
	optimization: {
		splitChunks: {
			minSize: 2000000,
		}
	}
};

module.exports = configuration;