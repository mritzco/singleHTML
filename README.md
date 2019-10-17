### react-app-singleHTML

Packs a build version of create-react-app into a single self-contained HTML file with no external references. The output can be used in some restricted sytems. i.e. Sharepoint, NetSuite.

It replaces references to Javascript and CSS with their codes and removes manifest, favicon and maps.

This library uses streams and keeps minimal info in memory.


## Installation
```
npm install --save-dev react-app-singlehtml
```
## Use from command line
```
node cli.js [/your/build/index.html] [targetPath]
```

## Use for building
Add a script in your project *package.json*
```
"scripts": {
  "singlepage": "react-app-singlehtml build/index.html build/singlepage.html"
}
```
## Auto build
If you want to use as part of your create-react-app or other app worflow:
Modify the *package.json*
```
"scripts": {
  "postbuild": "react-app-singlehtml build/index.html build/singlepage.html"
}
```
*Update to use your actual paths*
