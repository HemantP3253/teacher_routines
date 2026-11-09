module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      "./babel-preset-watermelondb",
      [
        "babel-preset-expo",
        {
          decorators: false,
        },
      ],
    ],
  };
};
