node-s3-fs
==========

A wrapper over AWS.S3  library which is compatible with Node.Js's fs module

##Usage
```js
    var fs = require('s3-fs');
    fs.configure({
        //S3.config.update arguments
    });

    fs.exist('/bucketname/directory1/file.ext', function(exist){
        
    });
    // or 
    fs.exist('bucketname/directory1/file.ext', callback );
    // The leading '/' is optional.

```

## Currently implemented methods.
```
fs.exist
fs.readFile
fs.writeFile
fs.readdir
```
