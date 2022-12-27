/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import path from 'path';
import pino from 'pino';
import Logger from '../utilities/logger';
import { SanitizedConfig } from './types';
import findConfig from './find';
import validate from './validate';
import babelConfig from '../babel.config';
import { timeStamp } from '../utilities/timeStamp';

const removedExtensions = ['.scss', '.css', '.svg', '.png', '.jpg', '.eot', '.ttf', '.woff', '.woff2'];

const loadConfig = (logger?: pino.Logger, bootTime?: Date): SanitizedConfig => {
  const { NODE_ENV } = process.env;

  const localLogger = logger ?? Logger();
  timeStamp('logger init', bootTime);

  removedExtensions.forEach((ext) => {
    require.extensions[ext] = () => null;
  });
  timeStamp('removed extensions', bootTime);

  const configPath = findConfig();
  timeStamp('found config', bootTime);

  if (NODE_ENV !== 'production' || true) {
    timeStamp('loading babel for config transpilation', bootTime);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@babel/register')({
      ...babelConfig,
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      env: {
        development: {
          sourceMaps: 'inline',
          retainLines: true,
        },
      },
      ignore: [
        /node_modules[\\/](?!.pnpm[\\/].*[\\/]node_modules[\\/])(?!payload[\\/]dist[\\/]admin|payload[\\/]components).*/,
      ],
    });
  }

  const builtConfigPath = configPath; // TODO: replace with hard coded built config path
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let config = require(NODE_ENV === 'production' ? builtConfigPath : configPath);
  timeStamp('config loaded', bootTime);

  if (config?.default) {
    config = config.default;
  } else {
    localLogger.error('Config file must export a default object. i.e. export default buildConfig({ ... })');
    process.exit(1);
  }

  // skip validation in production
  config = NODE_ENV === 'production' ? config : validate(config, localLogger, bootTime);
  timeStamp('validated config', bootTime);

  return {
    ...config,
    paths: {
      ...(config?.paths || {}),
      configDir: path.dirname(configPath),
      config: configPath,
    },
  };
};

export default loadConfig;
