var path = require('path');

module.exports = {  
  entry: path.resolve(__dirname, 'react/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: [
          path.resolve(__dirname, "react")
        ],
        loader: "babel-loader",
        options: {
          presets: ["es2015", "react"]
        }
      }
    ]
  }
};
