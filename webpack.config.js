const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/** @returns {import('webpack').Configuration} */

module.exports = (args) => {
	const { ts } = args;
	const isProduction = process.env.NODE_ENV === 'production' ? true : false;
	let mode = isProduction ? 'production' : 'development';
	const styleLoader = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';
	let css = {
		test: /\.s[ac]ss$/i,
		use: [styleLoader, 'css-loader', 'sass-loader'],
	};
	let target = 'web';
	let plugins = [new HtmlWebpackPlugin({ template: './src/index.html', inject: 'body' })];
	if (isProduction) {
		plugins.push(
			new MiniCssExtractPlugin({
				filename: 'style/[name].[contenthash].css',
			}),
		);
		css.use.splice(css.use.length - 1, 0, {
			loader: 'postcss-loader',
			options: { postcssOptions: { plugins: ['autoprefixer'] } },
		});
		target = 'browserslist';
	}
	return {
		target,
		resolve: {
			extensions: ['.tsx', '.ts', '.js'],
		},
		mode,
		entry: ts
			? path.resolve(path.join(__dirname, 'src', 'index.ts'))
			: path.resolve(path.join(__dirname, 'src', 'index.js')),
		output: {
			path: path.resolve(path.join(__dirname, 'dist')),
			filename: production ? '[name].[contenthash].js' : '[name].bundle.js',
			assetModuleFilename: 'images/[hash][ext][query]',
			clean: true,
		},
		devtool: 'source-map',
		devServer: {
			liveReload: true,
			open: true,
			hot: true,
			port: 5000,
		},
		module: {
			rules: [
				{
					test: /\.m?jsx$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
					},
				},
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.(png|svg|jpg|jpeg|gif)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.html$/i,
					loader: 'html-loader',
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'fonts/[name].[ext]',
					},
				},
				css,
			],
		},
		plugins,
		optimization: {
			splitChunks: {
				chunks: 'all',
			},
		},
	};
};
