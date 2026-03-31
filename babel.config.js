module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./app",
            "@components": "./src/components",
            "@hooks": "./src/hooks",
            "@services": "./src/services",
            "@stores": "./src/stores",
            "@lib": "./src/lib",
            "@mytypes": "./src/types",
            "@constants": "./src/constants",
            "@utils": "./src/utils",
            "@assets": "./assets",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};