const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
require('dotenv').config();
module.exports = {
	mode: "development",
	entry: "./src/index.tsx",
	output: {
		filename: "[name].[contenthash].js", // 각 chunk에 고유 이름 부여
		path: path.resolve(__dirname, "dist"),
		clean: true, // 기존 번들 삭제
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: "babel-loader",
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env),
		}),
	],
	devServer: {
		static: path.resolve(__dirname, "dist"),
		port: 3000,
		hot: true,
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all",
				},
			},
		},
	},

};
