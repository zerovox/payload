import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack, { Configuration } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { SanitizedConfig } from '../config/types';
import babelConfig from '../babel.config';

const mockModulePath = path.resolve(__dirname, './mocks/emptyModule.js');
const mockDotENVPath = path.resolve(__dirname, './mocks/dotENV.js');

export const pathToAdminFolder = path.resolve(__dirname, '../admin');

export default (config: SanitizedConfig): Configuration => {
  const { NODE_ENV = 'development' } = process.env;

  return {
    resolveLoader: {
      modules: ['node_modules', path.join(__dirname, '../../node_modules')],
    },
    module: {
      rules: [
        // {
        //   test: /\.(t|j)sx?$/,
        //   exclude: /node_modules[\\/](?!(@payloadcms[\\/]payload)[\\/]).*/,
        //   use: [
        //     {
        //       loader: require.resolve('babel-loader'),
        //       options: babelConfig,
        //     },
        //   ],
        // },
        {
          test: /\.jsx?$/,
          use: {
            loader: 'esbuild-loader',
            options: {
              loader: 'jsx',
              target: 'es2015',
            },
          },
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
            },
          },
        },
        {
          test: /\.(scss|css)$/,
          sideEffects: true,
          use: [
            NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
            require.resolve('css-loader'),
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: [require.resolve('postcss-preset-env')],
                },
              },
            },
            require.resolve('sass-loader'),
          ],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|woff(2)?|eot|ttf|otf|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
        crypto: false,
        https: false,
        http: false,
      },
      modules: ['node_modules', path.resolve(__dirname, '../../node_modules')],
      alias: {
        'payload-config': config.paths.config,
        payload$: mockModulePath,
        'payload-user-css': config.admin.css,
        dotenv: mockDotENVPath,
      },
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
      new webpack.ProvidePlugin(
        { process: 'process/browser' },
      ),
      new webpack.DefinePlugin(
        Object.entries(process.env).reduce(
          (values, [key, val]) => {
            if (key.indexOf('PAYLOAD_PUBLIC_') === 0) {
              return ({
                ...values,
                [`process.env.${key}`]: `'${val}'`,
              });
            }

            return values;
          },
          {},
        ),
      ),
      new HtmlWebpackPlugin({
        template: config.admin.indexHTML,
        filename: path.normalize('./index.html'),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
  };
};
