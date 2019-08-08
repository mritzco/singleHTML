### react-app-singleHTML

Originally created to pack a build version of create-react-app into a single HTML file with no external references.

It replaces the Javascript, CSS, with the file content of the file.
It also removes manifest, favicon and maps.

The final page can be used in some restricted sytems. i.e. Sharepoint, NetSuite.


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
