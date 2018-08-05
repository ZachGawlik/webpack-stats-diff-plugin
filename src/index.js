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
const chalk = require('chalk');

class StatsDiffPlugin {
  constructor(opts) {
    this.oldStatsFile = opts.oldStatsFile;
    this.config = {
      extensions: opts.extensions,
      threshold: opts.threshold
    };
  }

  apply(compiler) {
    //  compiler.hooks only exists for Webpack 4.x
    if (compiler.hooks) {
      if (this.oldStatsFile) {
        compiler.hooks.beforeRun.tapAsync(
          'get-sizes-from-stats-file',
          this.getSizeFromStatsFile.bind(this)
        );
        compiler.hooks.done.tapAsync(
          'webpack-stats-diff-plugin',
          this.compareWithBuildStats.bind(this)
        );
      } else {
        compiler.hooks.beforeRun.tapAsync(
          'get-sizes-from-build-folder',
          this.getPreviousBuildSize.bind(this)
        );
        compiler.hooks.done.tapAsync(
          'webpack-stats-diff-plugin',
          this.compareWithBuildOutput.bind(this)
        );
      }
    } else {
      if (this.oldStatsFile) {
        compiler.plugin('before-run', this.getSizeFromStatsFile.bind(this));
        compiler.plugin('done', this.compareWithBuildStats.bind(this));
      } else {
        compiler.plugin('before-run', this.getPreviousBuildSize.bind(this));
        compiler.plugin('done', this.compareWithBuildOutput.bind(this));
      }
    }
  }

  getSizeFromStatsFile(compiler, callback) {
    const oldPath = path.resolve(process.cwd(), this.oldStatsFile);
    if (!fs.existsSync(oldPath)) {
      throw new Error('File does not exist');
    }
    console.log(`Comparing build sizes to ${this.oldStatsFile}`);
    const { assets } = require(oldPath);
    if (!assets) {
      console.log(
        chalk.yellow(
          'No assets found in stats file. If using WebpackStatsPlugin, ensure that opts.files contains "assets"'
        )
      );
    }
    this.sizesFromStatsFile = assets;
    callback();
  }

  getPreviousBuildSize(compiler, callback) {
    this.buildRoot = compiler.options.output.path;
    console.log(`Comparing build sizes to prior contents of ${this.buildRoot}`);
    measureFileSizesBeforeBuild(this.buildRoot).then(({ sizes }) => {
      this.sizesBeforeBuild = sizes;
      if (Object.keys(sizes).length === 0) {
        console.log(
          chalk.yellow(
            'No files found in build directory. Ensure that CleanWebpackPlugin is set with {afterEmit: true}'
          )
        );
      }

      callback();
    });
  }

  compareWithBuildStats(stats) {
    if (this.sizesFromStatsFile) {
      const { assets } = stats.compilation;
      const formattedAssets = Object.keys(assets).map(name => ({
        name,
        size: assets[name].size()
      }));
      printStatsDiff(
        getStatsDiff(this.sizesFromStatsFile, formattedAssets, this.config),
        null,
        2
      );
    }
  }

  compareWithBuildOutput() {
    if (Object.keys(this.sizesBeforeBuild).length > 0) {
      measureFileSizesBeforeBuild(this.buildRoot).then(({ sizes }) => {
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
