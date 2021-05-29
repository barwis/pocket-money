const path = require( 'path' );
const webpack = require( 'webpack' );

let dotenv;
try {
	dotenv = require( 'dotenv' ).config({ path: '../.env' });
} catch ( e ) {
	throw new Error( e );
}
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
		port,
		publicPath: `http://localhost:${port}/dist/`,
		hotOnly: true,
		writeToDisk: true,
		historyApiFallback: true,
		disableHostCheck: true,
		open: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			LOCAL_IP: JSON.stringify( dotenv.parsed.LOCAL_IP ),
			PORT: JSON.stringify( dotenv.parsed.PORT ),
			CLIENT_ID: JSON.stringify( dotenv.parsed.CLIENT_ID ),
			API_PORT: JSON.stringify( dotenv.parsed.API_PORT )
		})
	],
	devtool: 'eval-cheap-source-map'
};
