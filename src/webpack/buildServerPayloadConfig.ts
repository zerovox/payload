
import path from 'path';
import { Configuration } from 'webpack';

export const buildServerPayloadConfig = (configPath: string): Configuration => ({
  mode: 'production',
  entry: configPath,
  output: {
    path: path.resolve(process.cwd(), 'cjs-config'),
    filename: 'my-first-webpack.bundle.js',
  },
  resolveLoader: {
    modules: ['node_modules', path.join(__dirname, '../../node_modules')],
  },
  // optimization: {
  //   minimizer: [
  //     new ESBuildMinifyPlugin({
  //       target: 'es2015', // Syntax to compile to (see options below for possible values)
  //     }),
  //   ],
  // },
  module: {
    rules: [
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
    ],
  },
});
