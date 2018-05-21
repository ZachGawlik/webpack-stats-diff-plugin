const path = require('path');
const fs = require('fs');
const { getStatsDiff, printStatsDiff } = require('webpack-stats-diff');

class StatsDiffPlugin {
  constructor(opts) {
    if (!opts.oldStatsFile) {
      throw new Error('oldStatsFile not specified in StatsDiffPlugin config');
    }
    this.oldStatsFile = opts.oldStatsFile;
    this.config = {
      extensions: opts.extensions,
      threshold: opts.threshold
    };
  }

  apply(compiler) {
    if (compiler.hooks) {
      compiler.hooks.emit.tapAsync(
        'webpack-stats-diff-plugin',
        this.getStatsDiff.bind(this)
      );
    } else {
      compiler.plugin('emit', this.getStatsDiff.bind(this));
    }
  }

  getStatsDiff(compilation, callback) {
    const { assets } = compilation.getStats().toJson();
    const oldPath = path.resolve(process.cwd(), this.oldStatsFile);
    if (!fs.existsSync(oldPath)) {
      return callback(new Error('File does not exist'));
    }
    const oldAssets = require(oldPath).assets;
    printStatsDiff(getStatsDiff(oldAssets, assets, this.config), null, 2);
    callback();
  }
}

module.exports = StatsDiffPlugin;
