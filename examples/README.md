This directory contains very contrived non-sensical examples to try out the plugin on different webpack versions against hefty files and dependency trees.
The examples are designed to produce differing bundle size outputs to be displayed by the `webpack-stats-diff-plugin`, rather than being actually running or relevant applications when built.

Each webpack config file has a few environment variable toggles for easily generating different stats files and build outputs.
Each src folder is set up with different types of files in order to try out the `extensions` configuration option. The examples are filled with typical filenames but with irrelevant file contents.
