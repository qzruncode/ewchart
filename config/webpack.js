const WebpackBar = require('webpackbar');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const config = {
  mode: 'production',
  watch: true,
  stats: 'errors-warnings',
  context: path.resolve(__dirname, '../'),
  entry: path.resolve(__dirname, '../src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../', 'build'),
    filename: 'index.js',
    clean: true,
    globalObject: 'this',
    library: {
      name: 'ewChart',
      type: 'umd',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: ['node_modules', path.resolve(__dirname, '../', 'src')],
  },
  plugins: [new WebpackBar()],
  module: {
    rules: [
      {
        test: /\.l?[ec]ss$/i,
        sideEffects: true,
        use: [
          {
            loader: require.resolve('css-loader'),
            options: {
              sourceMap: true,
              importLoaders: 1,
              modules: false,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              sourceMap: false,
              postcssOptions: {
                plugins: [require.resolve('postcss-preset-env'), require.resolve('postcss-import')],
              },
            },
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              lessOptions: {
                javascriptEnabled: true,
                sourceMap: false,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'image/[hash][ext][query]',
        },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [require.resolve('@babel/preset-react')],
            },
          },
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              babel: false,
              icon: true,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'font/[hash][ext][query]',
        },
      },
      {
        test: /\.(js|ts|tsx)?$/,
        exclude: /(node_modules|config|public|build|env|static)/,
        use: [
          {
            loader: require.resolve('thread-loader'),
            options: {
              workers: 4,
              workerParallelJobs: 100,
            },
          },
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                [require.resolve('@babel/preset-env')],
                require.resolve('@babel/preset-react'),
                require.resolve('@babel/preset-typescript'),
              ],
              cacheDirectory: true,
              // babel编译后的内容默认缓存在 node_modules/.cache/babel-loader
            },
          },
        ],
      },
    ],
  },
  externals: [nodeExternals()],
};
module.exports = config;
