const path = require( 'path' );
const webpack = require( 'webpack' );

const dotenv = require( 'dotenv' ).config({ path: '../.env' });
const localIPaddress = dotenv.parsed.LOCAL_IP;
const port = dotenv.parsed.PORT;

module.exports = {
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
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.scss$/,
				use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
		fallback: { 'os': require.resolve( 'os-browserify/browser' ) },
		alias: { 'react-dom': '@hot-loader/react-dom' }
	},
	output: {
		path: path.resolve( __dirname, 'dist/' ),
		publicPath: '/dist/',
		filename: 'bundle.js'
	},
	devServer: {
		contentBase: path.join( __dirname, 'public/' ),
		host: localIPaddress,
		port,
		publicPath: `http://${localIPaddress}:${port}/dist/`,
		hotOnly: true,
		writeToDisk: true,
		historyApiFallback: true,
		open: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			LOCAL_IP: JSON.stringify( dotenv.parsed.LOCAL_IP ),
			PORT: JSON.stringify( dotenv.parsed.PORT ),
			APP_GOOGLE_CLIENT_ID: JSON.stringify( dotenv.parsed.APP_GOOGLE_CLIENT_ID ),
			API_PORT: JSON.stringify( dotenv.parsed.API_PORT )
		})
	],
	devtool: 'eval-cheap-source-map'
};
