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
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.scss$/,
				use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
			},
			{
				test: require.resolve( 'snapsvg/dist/snap.svg.js' ),
				use: 'imports-loader?wrapper=window&additionalCode=module.exports=0;'
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
		fallback: { 'os': require.resolve( 'os-browserify/browser' ) },
		alias: {
			'react-dom': '@hot-loader/react-dom',
			'snapsvg': 'snapsvg/dist/snap.svg.js'
		}
	},
	output: {
		path: path.resolve( __dirname, 'dist/' ),
		publicPath: '/dist/',
		filename: 'bundle.js'
	},
	devServer: {
		contentBase: path.join( __dirname, 'public/' ),
		host: dotenv.parsed.LOCAL_IP,
		port: dotenv.parsed.PORT,
		publicPath: `http://${dotenv.parsed.LOCAL_IP}:${dotenv.parsed.PORT}/dist/`,
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

module.exports = webpackConfig;
