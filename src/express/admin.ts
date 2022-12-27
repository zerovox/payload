import express from 'express';
import compression from 'compression';
import history from 'connect-history-api-fallback';
import path from 'path';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import getWebpackDevConfig from '../webpack/getDevConfig';
import { Payload } from '../index';

const router = express.Router();

function initAdmin(ctx: Payload): void {
  if (!ctx.config.admin.disable) {
    router.use(history());

    if (process.env.NODE_ENV === 'production') {
      // remove trailing slash and redirect to non-trailing slash
      router.get('*', (req, res, next) => {
        if (req.path.slice(-1) === '/' && req.path.length > 1) {
          const query = req.url.slice(req.path.length);
          res.redirect(301, req.path.slice(0, -1) + query);
        } else {
          next();
        }
      });

      router.use(compression(ctx.config.express.compression));
      router.use(express.static(path.resolve(process.cwd(), 'build'), { redirect: false }));

      ctx.express.use(ctx.config.routes.admin, router);
    } else {
      // attach webpack dev server
      const webpackDevConfig = getWebpackDevConfig(ctx.config);
      const compiler = webpack(webpackDevConfig);

      router.use(WebpackDevMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath as string,
      }));
      router.use(WebpackHotMiddleware(compiler));

      ctx.express.use(ctx.config.routes.admin, history());
      ctx.express.use(router);
    }
  }
}

export default initAdmin;
