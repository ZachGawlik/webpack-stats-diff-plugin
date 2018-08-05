/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const {
  getAssetsDiff,
  getStatsDiff,
  printStatsDiff
} = require('webpack-stats-diff');
const {
  measureFileSizesBeforeBuild
} = require('react-dev-utils/FileSizeReporter');

class StatsDiffPlugin {
  constructor(opts) {
    this.oldStatsFile = opts.oldStatsFile;
    this.config = {
      extensions: opts.extensions,
      threshold: opts.threshold
    };
  }

  apply(compiler) {
    if (compiler.hooks) {
      if (!this.oldStatsFile) {
        compiler.hooks.beforeRun.tapAsync(
          'calculate-previous-size',
          this.getPreviousBuildSize.bind(this)
        );
      }
      compiler.hooks.done.tapAsync(
        'webpack-stats-diff-plugin',
        this.getStatsDiff.bind(this)
      );
    } else {
      if (!this.oldStatsFile) {
        compiler.plugin('before-run', this.getPreviousBuildSize.bind(this));
      }
      compiler.plugin('done', this.getStatsDiff.bind(this));
    }
  }

  getPreviousBuildSize(compiler, callback) {
    this.buildRoot = compiler.options.output.path;
    measureFileSizesBeforeBuild(this.buildRoot).then(({ sizes }) => {
      this.sizesBeforeBuild = sizes;
      callback();
    });
  }

  getStatsDiff(stats) {
    if (this.oldStatsFile) {
      const oldPath = path.resolve(process.cwd(), this.oldStatsFile);
      if (!fs.existsSync(oldPath)) {
        throw new Error('File does not exist');
      }
      const oldAssets = require(oldPath).assets;
      const { assets } = stats.compilation;
      const formattedAssets = Object.keys(assets).map(name => ({
        name,
        size: assets[name].size()
      }));
      console.log(`Comparing build sizes to ${this.oldStatsFile}`);
      printStatsDiff(
        getStatsDiff(oldAssets, formattedAssets, this.config),
        null,
        2
      );
    } else {
      measureFileSizesBeforeBuild(this.buildRoot).then(({ sizes }) => {
        console.log(
          `Comparing build sizes to prior contents of ${this.buildRoot}`
        );
        printStatsDiff(
          getAssetsDiff(this.sizesBeforeBuild, sizes, this.config),
          null,
          2
        );
      });
    }
  }
}

module.exports = StatsDiffPlugin;
