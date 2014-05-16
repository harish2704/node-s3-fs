var AWS = require('aws-sdk'),
    _ = require('underscore');

var s3Settings = {};
var env = process.env;
s3Settings.accessKeyId= env.AWS_ACCESS_KEY_ID;
s3Settings.secretAccessKey = env.AWS_SECRET_ACCESS_KEY;
s3Settings.bucket = env.AWS_S3_BUCKET;
s3Settings.endpoint = env.AWS_S3_ENDPOINT;
s3Settings.useSsl = env.AWS_S3_USE_SSL? true: false;


function parseFname( fname ){
    if (fname[0] != '/') fname = '/' + fname;
    var parts = fname.split('/');
    var bucketName = parts.splice(0,2)[1];
    var filename = parts.join('/');
    
    var args = {
        Bucket: bucketName,
        Key: filename
    };
    return args;
}

function parseConfig( data ){

    if(data.endpoint){
        var endpoint = new AWS.Endpoint( data.endpoint );
        data.endpoint = endpoint;
    }
    return data;
}


var Fs = {};
var S3 = new AWS.S3( parseConfig(s3Settings) );

Fs.configure = function(data){
    S3.config.update( parseConfig( data) );
}
	

Fs.exists = function(fname, cb){
    var args = parseFname( fname );
    S3.headObject( args, function(err, data){
        // console.log( arguments );
        if (err) return cb();
        return cb(1);
    });
};

Fs.readFile = function( fname, encoding, cb){
    if (arguments.length == 2){
        cb = encoding;
        encoding = null;
    }
    var args = parseFname( fname );
    S3.getObject( args, function(err, data){
        if(err) return cb(err);
        var out = encoding? data.Body.toString(encoding): data.Body;
        return cb(null, out );
    });
};

Fs.readdir = function( fname, cb ){
    var args = parseFname(fname);
    args.Prefix = args.Key;
    delete args.Key;

    S3.listObjects( args, function(err, data){
        if (err) return cb(err);
        var out = [];
        data.Contents.forEach(function(content){
            out.push( content.Key.substr(args.Prefix.length+1));
        });
        _.pluck( data.Contents, 'Key');
        return cb(null, out);
    });
};

Fs.outputFile = function( fname, data, cb ){
    var args = parseFname(fname);
    args.ACL = 'private';
    args.Body = data;
    
    S3.putObject(args, function(err, res){
        if(err) return cb(err);
        return cb(null);
    });
};

module.exports = Fs;
