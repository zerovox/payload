/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */

import webpack from 'webpack';
import getWebpackProdConfig from '../webpack/getProdConfig';
import findConfig from '../config/find';
import loadConfig from '../config/load';
import { buildServerPayloadConfig } from '../webpack/buildServerPayloadConfig';

const configPath = findConfig();

export const buildServerConfig = (): void => {
  console.log('Building server config...');
  webpack(buildServerPayloadConfig(configPath), (err, stats) => {
    console.log('Built server config');
    if (err || stats.hasErrors()) {
      if (stats) {
        console.error(stats.toString({
          chunks: false,
          colors: true,
        }));
      } else {
        console.error(err.message);
      }
    }
  });
};

export const build = (): void => {
  try {
    // buildServerConfig();
    const config = loadConfig();
    const webpackProdConfig = getWebpackProdConfig({
      ...config,
      paths: {
        ...(config.paths || {}),
        config: configPath,
      },
    });

    webpack(webpackProdConfig, (err, stats) => { // Stats Object
      if (err || stats.hasErrors()) {
        // Handle errors here

        if (stats) {
          console.error(stats.toString({
            chunks: false,
            colors: true,
          }));
        } else {
          console.error(err.message);
        }
      }
    });
  } catch (err) {
    console.error(err);
    throw new Error(`Error: can't find the configuration file located at ${configPath}.`);
  }
};

// when build.js is launched directly
if (module.id === require.main.id) {
  build();
}
