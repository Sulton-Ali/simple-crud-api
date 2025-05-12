import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import nodeExternals from 'webpack-node-externals';
import ForkTsChecker from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import DotenvPlugin from 'dotenv-webpack';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default /** @type {import('webpack').Configuration} */ ({
  mode: 'production',
  target: 'node20',
  entry: { standalone: './src/standalone.ts', balancer: './src/balancer.ts' },
  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    clean: true,
    library: { type: 'module' },
    chunkFormat: 'module',
    module: true,
  },
  experiments: { outputModule: true },
  devtool: 'source-map',
  resolve: { extensions: ['.ts', '.js'] },
  externals: [nodeExternals({ allowlist: [/^node:/] })],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new ForkTsChecker()],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
      new DotenvPlugin({
        path: '.env.production',
        systemvars: true,
      }),
    ],
  },
});
