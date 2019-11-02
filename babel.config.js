module.exports = api => {
  const isTest = api.env() === 'test';

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: isTest ? 'cjs' : false,
          targets: {
            node: '8',
            browsers: 'last 1 version, > 5%, not dead',
          },
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          useESModules: !isTest,
        },
      ],
    ],
  };
};
