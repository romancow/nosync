
#	No Sync
- [About](#About)
- [Installation](#Installation)
- [Usage](#Usage)
	- [Programmatic](#Programmatic)
	- [Command Line](#Command-Line)
- [License](#License)

## About

A tool to prevent files and folders from syncing to iCloud.

It does this by creating a folder named ".nosync" (which iCloud will not sync) to hold the unsynced files
and symlinking to them from the original location.

This can come in handy, for example, if you want to keep node packages on iCloud, but don't want it to sync
all their `node_modules` folders.

If the file or folder already exists, `nosync` will move it to the unsynced location, then create a
symlink pointing to it with the original location and name. If a file or folder does not exist at the
specified location, a symlink is created that points to a new folder at the unsynced location.

## Installation

Add a scope mapping for the GitHub npm package manager by adding a `.npmrc` file with the line:

	@romancow:registry=https://npm.pkg.github.com/

Then install the package:

	npm install @romancow/vue-external-events

or

	yarn add @romancow/vue-external-events

More info on using the GitHub npm package registry [here](https://help.github.com/en/articles/configuring-npm-for-use-with-github-package-registry#installing-a-package).

You might also want to add your nosync folder (".nosync" by default) to your .gitignore since things you
don't want to sync are typically also things you don't want in git.

## Usage

### Programmatic

Theres is one function to import:
```javascript
const nosync = require('@romancow/nosync');
```

Or with ES modules:
```javascript
import nosync from '@romancow/nosync';
```

The `nosync` function accepts a single path or an array of paths to not sync:
```javascript
// symlinks "node_modules" to ".nosync/node_modules" in the current working directory
nosync("./node_modules")

// symlinks "build" to ".nosync/build", "dist" to ".nosync/dist", and "types" to ".nosync/types"
nosync(["./build", "./dist", "./types"])
```

It can also accept an object mapping paths to where they should be located within
the `.nosync` folder:
```javascript
nosync({
	// symlinks "es6" to ".nosync/artifacts/build"
	"es6": "artifacts/build",

	// symlinks "cjs" to ".nosync/artifacts/dist"
	"cjs": "artifacts/dist",

	// symlinks "types" to ".nosync/artifacts/types"
	"types": "artifacts/types"
})
```

#### Options

The `nosync` function also accepts a second `options` argument.

There are currently three options:

<dl>
	<dt>base</dt>
	<dd>The folder to copy unsynced files and folders to. Defaults to `./.nosync`. Note that in order for
	iCloud to ignore it, it be named something iCloud ignores (such as containing ".nosync"). You could,
	however, point it to a folder outside of iCloud drive to prevent syncing.</dd>
	<dt>check</dt>
	<dd>If true, will only copy and symlink files if the path includes the iCloud drive folder. If false,
	it won't check iCloud status. Default is false.</dd>
	<dt>overwrite</dt>
	<dd>If a file or folder exists at the given path and already exists in the nosync folder, this option
	determines whether or not to overwrite the one in the nosync folder. Default is false.</dd>
</dl>

```javascript
nosync({ "node_modules": "node_modules.nosync" }, { base: "./", check: true, overwrite: true })
```

### Command Line

No Sync can also be used on the command line:

	nosync node_modules

You can pass multiple paths:

	nosync build dist types

Or pass options:

	nosync node_modules --check

Supported options are (check [above](#Options) for what they do):

<dl>
	<dt>-V, --version</dt>
	<dd>output the version number</dd>
	<dt>-b, --base &ltpath&gt</dt>
	<dd>Base folder to store non-synced files</dd>
	<dt>-c, --check</dt>
	<dd>Check that files are in iCloud folder</dd>
	<dt>-o, --overwrite</dt>
	<dd>Overwrite existing files in nosync folder</dd>
	<dt>-p, --paths &ltjson file&gt</dt>
	<dd>JSON file with paths to not sync</dd>
	<dt>-s, --silent</dt>
	<dd>Suppresses console information</dd>
	<dt>-h, --help</dt>
	<dd>output usage information</dd>
</dl>

#### Using the --paths option

The `-paths` options allows you to specify a JSON file to use to specify the paths that shouldn't be
synced by iCloud:

	nosync --paths nosync.json

This allows you to set a configuration file within an actual project, specifying which files and folders
not to sync, varying it based on the individual needs of that project. The json can be either an array of
paths, or an object mapping paths to where they should be located within the `.nosync` folder.

If paths are specified as both command line arguments and in a json file, then they will all be "nosynced".
If neither is specified, then `nosync` will look for a paths json file named "nosync.json" in the current
working directory.

## License

[ISC](https://opensource.org/licenses/ISC)
