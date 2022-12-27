import webpack, { Configuration } from 'webpack';
import { SanitizedConfig } from '../config/types';
import getBaseWebpackConfig, { pathToAdminFolder } from './getBaseConfig';

export default (payloadConfig: SanitizedConfig): Configuration => {
  const baseConfig = getBaseWebpackConfig(payloadConfig) as any;

  let webpackConfig: Configuration = {
    ...baseConfig,
    entry: {
      main: [
        require.resolve('webpack-hot-middleware/client'),
        pathToAdminFolder,
      ],
    },
    output: {
      publicPath: payloadConfig.routes.admin,
      path: '/',
      filename: '[name].js',
    },
    mode: 'development',
    stats: 'errors-warnings',
    devtool: 'inline-source-map',
    plugins: [
      ...baseConfig.plugins,
      new webpack.HotModuleReplacementPlugin(),
    ],
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },
  };

  if (payloadConfig.admin.webpack && typeof payloadConfig.admin.webpack === 'function') {
    webpackConfig = payloadConfig.admin.webpack(webpackConfig);
  }

  return webpackConfig;
};
