import TerserJSPlugin from 'terser-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path';
import { Configuration } from 'webpack';
import { SanitizedConfig } from '../config/types';
import getBaseWebpackConfig, { pathToAdminFolder } from './getBaseConfig';

export default (payloadConfig: SanitizedConfig): Configuration => {
  const baseConfig = getBaseWebpackConfig(payloadConfig) as any;

  let webpackConfig: Configuration = {
    ...baseConfig,
    entry: {
      main: [pathToAdminFolder],
    },
    output: {
      publicPath: `${payloadConfig.routes.admin}/`,
      path: path.resolve(process.cwd(), 'build'),
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
    },
    mode: 'production',
    stats: 'errors-only',
    plugins: [
      ...baseConfig.plugins,
      new MiniCSSExtractPlugin({
        filename: '[name].css',
        ignoreOrder: true,
      }),
    ],
    optimization: {
      minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin()],
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c)ss$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  };

  if (process.env.PAYLOAD_ANALYZE_BUNDLE) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  if (payloadConfig.admin.webpack && typeof payloadConfig.admin.webpack === 'function') {
    webpackConfig = payloadConfig.admin.webpack(webpackConfig);
  }

  return webpackConfig;
};
