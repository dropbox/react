How to develop on this:

Build process is as suggested in the original readme:

`sudo npm install -g grunt-cli`
`npm install` (this doesn't actually work... but doesn't seem like it needs to work?)
`grunt build`

The react-0.13.3.js and react-0.13.3.min.js we have in rSERVER right now are build/react-with-addons.js and build/react-with-addons.min.js respectively, on the v13-dropbox branch.

To update:
* make your changes, then run `grunt extract-errors` and `grunt build`
* `cp build/react-with-addons.js metaserver/metaserver/static/javascript/external/react-0.13.3-dev.js`
* `cp build/react-with-addons-debug.js metaserver/metaserver/static/javascript/external/react-0.13.3-debug.js`

Tips for editing react source:

While the core of the react build system is browserify+grunt, suggesting that it uses the usual node module layout conventions, the way module resolution works is that the build system actually copies all modules into build/modules/ as a flat structure; it does this for any module with the @providesModule comment that it uses as the module name.  So for resolving requires, the directory structure becomes irrelevant.
