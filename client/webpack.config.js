const path = require('path');

module.exports = {
  // Entry point of your application
  entry: './src/index.js',  // Update according to your entry file

  // Output configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      // Add your other rules here
      {
        test: /\.wasm$/,           // Match .wasm files
        type: "javascript/auto",   // Treat them as raw binary assets
        loader: "file-loader",     // Use file-loader to handle them
      },
      // Other rules can go here...
    ]
  },

  resolve: {
    // Optional: Ensure .wasm files are resolved correctly
    extensions: ['.js', '.json', '.wasm'],
  },

  // Optionally, you can add the following to optimize loading
  experiments: {
    asyncWebAssembly: true,
  },
};
