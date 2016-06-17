How to develop on this:

Build process is as suggested in the original readme:

`sudo npm install -g grunt-cli`
`npm install` (this doesn't actually work... but doesn't seem like it needs to work?)
`grunt build`

The react-0.12.0.js and react-0.12.0.min.js we have in rSERVER right now are build/react-with-addons.js and build/react-with-addons.min.js respectively, on the v12-dropbox branch.

To update:
* make your changes, then run `grunt build`
* `cp build/react-with-addons.js metaserver/metaserver/static/javascript/external/react-0.12.0.js`
* `cp build/react-with-addons.min.js metaserver/metaserver/static/javascript/external/react-0.12.0.min.js`
