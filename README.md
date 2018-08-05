# webpack-stats-diff-plugin

Clear reporting of bundle sizes relative to a prior build. This is particularly useful for understanding the outcome of webpack configuration changes.

## Why is this useful?

Webpack prints absolute sizes of outputted files, but it's hard to see the overall impact of a code or configuration change. For example if you wanted to know the effect of changing webpack's `optimization.splitChunks.chunks` setting from its default `"async"` value to the recommended `"all"`,

Instead of trying to compare webpack's basic output:

![standard webpack report with chunks: async](readme-assets/standard-report-all.png)
![standard webpack report with chunks: all](readme-assets/standard-report-async.png)

Adding this plugin will highlight only the key changes:

![webpack-stats-diff-plugin comparison output](readme-assets/plugin-output.png)

## Installation & Usage

```
npm install webpack-stats-diff-plugin --save-dev
```

To establish a baseline to compare to, you'll need the build to output a json stats file. This can be done by adding an npm script like `"build_stats": "webpack --profile --json > stats-master.json"` or using [webpack-stats-plugin](https://github.com/FormidableLabs/webpack-stats-plugin) with `opts.fields` containing `"assets"`.

Add the following to your webpack config to conditionally use the plugin when passed an environment variable:

```javascript
const WebpackStatsDiffPlugin = require('webpack-stats-diff-plugin');

module.exports = {
  // ... other webpack config
  plugins: [
    // ... other plugins
    process.env.STATS_FILE &&
      new WebpackStatsDiffPlugin({
        oldStatsFile: process.env.STATS_FILE
      })
  ].filter(Boolean);
};
```

To see your changes since that prior build, add on the flag to your existing webpack build command. For example,

```
STATS_FILE=stats-master.json npm run build
```

### Additional configuration

The WebpackStatsDiffPlugin constructor can also take in the following fields:

- `extensions`: An array of strings, optionally with a leading period. If provided, only files matching a given extension will be displayed and used for calculating totals. For example, `extensions: ['.js']` will only show size changes for built javascript files.

- `threshold`: Minimum percent difference to qualify a size change as significant. This prevents flooding the output with files that have only trivially changed their compiled output. Defaults to `5`. Can set to 0 to see all changed file sizes.
