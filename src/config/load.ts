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
  const localLogger = logger ?? Logger();
  timeStamp('logger init', bootTime);
  const configPath = findConfig();
  timeStamp('find config', bootTime);

  removedExtensions.forEach((ext) => {
    require.extensions[ext] = () => null;
  });

  timeStamp('removed extensions', bootTime);
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
  timeStamp('loaded babel', bootTime);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let config = require(configPath);
  timeStamp('required config', bootTime);

  if (config.default) config = config.default;

  const validatedConfig = validate(config, localLogger, bootTime);
  timeStamp('validated config', bootTime);

  return {
    ...validatedConfig,
    paths: {
      ...(validatedConfig.paths || {}),
      configDir: path.dirname(configPath),
      config: configPath,
    },
  };
};

export default loadConfig;
