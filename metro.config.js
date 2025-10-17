const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('env', 'css');

module.exports = withNativeWind(config, {
  input: path.resolve(__dirname, 'global.css'),
});