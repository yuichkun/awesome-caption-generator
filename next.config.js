module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    const newConfig = {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          fs: false,
          path: false,
          process: false,
          buffer: false,
          crypto: false,
        },
      },
    };
    return newConfig;
  },
};
