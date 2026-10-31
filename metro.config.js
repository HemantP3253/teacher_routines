const { getDefaultConfig } = require("expo/metro-config");
const { withUnistylesConfig } = require("react-native-unistyles/metro");

const config = getDefaultConfig(__dirname);

module.exports = withUnistylesConfig(config);
