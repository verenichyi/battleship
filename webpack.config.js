import path, { dirname } from 'node:path';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const NODE_ENV = process.env.NODE_ENV;
const plugins = NODE_ENV === 'development' ? [ new NodemonPlugin() ] : [];

const config = {
	entry: './index.ts',
	mode: NODE_ENV,
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.cjs'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					'ts-loader',
				],
				exclude: /node_modules/,
			}
		]
	},
	resolve: {
		extensions: [ '.ts', '.js' ],
		alias: {
			src: path.resolve(__dirname, 'src'),
		},
	},
	externals: [ nodeExternals() ],
	plugins
};

export default config;
