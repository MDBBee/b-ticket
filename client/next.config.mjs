const nextConfig = {
  webpack: (config) => {
    return {
      ...config,
      watchOptions: {
        ...config.watchOptions,
        poll: 300,
      },
    };
  },
  allowedDevOrigins: ['b-tickets.dev'],
};

export default nextConfig;
// const nextConfig = {
//   webpack: (config) => {
//     config.module.rules.push({
//       test: /\.js$/,
//       exclude: /node_modules/,
//       use: {
//         loader: 'babel-loader',
//         options: {
//           presets: ['next/babel'],
//         },
//       },
//     });
//     return config;
//   },
// };
// export default nextConfig;
