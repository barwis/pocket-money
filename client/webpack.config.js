const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const path = require( 'path' );
const webpack = require( 'webpack' );

let dotenv;
try {
	dotenv = require( 'dotenv' ).config({ path: '../.env' });
} catch ( e ) {
	throw new Error( e );
}

const webpackConfig = {
	entry: './src/index.js',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				options: { presets: ['@babel/env'] }
			},
			{
				test: /\.css$/,
				include: /src/,
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
		fallback: { 'os': require.resolve( 'os-browserify/browser' ) },
		alias: { 'react-dom': '@hot-loader/react-dom' }
	},
	// output: {
	// 	path: path.resolve( __dirname, 'dist/' ),
	// 	publicPath: '/dist/',
	// 	filename: 'bundle.js',
	// 	chunkFilename: '[name].js'
	// },
	output: {
		path: path.resolve( __dirname, 'dist/' ),
		publicPath: '/dist/',
		filename: '[name].[fullhash:8].js',
		sourceMapFilename: '[name].[fullhash:8].map',
		chunkFilename: '[id].[fullhash:8].js'
	},
	devServer: {
		contentBase: path.join( __dirname, 'public/' ),
		host: dotenv.parsed.LOCAL_IP,
		port: dotenv.parsed.PORT,
		publicPath: `http://${dotenv.parsed.LOCAL_IP}:${dotenv.parsed.PORT}/dist/`,
		hotOnly: true,
		disableHostCheck: true,
		open: true,
		writeToDisk: true
	},
	// optimization: {
	// 	splitChunks: {
	// 		cacheGroups: {
	// 			vendors: {
	// 				test: /[\\/]node_modules[\\/]/, // /< put all used node_modules modules in this chunk
	// 				name: 'vendor', // /< name of bundle
	// 				chunks: 'all' // /< type of code to put in this bundle
	// 			}
	// 		}
	// 	}
	// },
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			LOCAL_IP: JSON.stringify( dotenv.parsed.LOCAL_IP ),
			PORT: JSON.stringify( dotenv.parsed.PORT ),
			CLIENT_ID: JSON.stringify( dotenv.parsed.CLIENT_ID ),
			API_PORT: JSON.stringify( dotenv.parsed.API_PORT )
		}),
		new MiniCssExtractPlugin()
	],
	devtool: 'eval-cheap-source-map'
};

module.exports = webpackConfig;
