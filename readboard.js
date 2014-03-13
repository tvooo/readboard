var Pinboard = require('./pinboard'),
    auth_token = require('./token');

var fs = require('fs'),
    async = require('async'),
    readingtime = require('readingtime'),
    url = require('url');
var webshot = require('webshot');

var read = require('node-readability');

var program = require('commander');

program
    .version('0.1.0')
    .option('-f, --fetch', 'Fetch all pins from Pinboard')
    .option('-e, --enhance', 'Process reading list')
    .parse(process.argv);

if (program.fetch) {
    var pinboard = new Pinboard( auth_token );

    pinboard.getAll( function( res ) {
        res.pipe( fs.createWriteStream( "raw.json" ) );
    });

    return console.log('Fetching');
}

if (program.enhance) {
    var pinboard = new Pinboard( auth_token ),
        input = "raw.json",
        output = "all.json";

    fs.readFile( input, { encoding: 'utf8'}, function( err, data ) {
        if ( err ) {
            return console.error( err );
        }
        enhance( data, output );
    } );

    return console.log('Processing');
}

function processPost( post, cb ) {
    async.waterfall([
        function( callback ) {
            getMarkup( post, callback );
        },
        getSite,
        getReadingtime,
        getScreenshot
    ], cb );
}

function getSite( post, callback ) {
    site = url.parse( post.href );
    post.site = site.hostname;
    callback( null, post );
}

function getReadingtime( post, callback ) {
    console.log( "Get reading time for " + post.description );
    if ( !post.content ) {
        return callback( null, post );
    }
    readingtime( function(data) {
        post.readingtime = data;
        return callback( null, post );
    }, post.content, 200);
}

function getMarkup( post, callback ) {
    console.log( "Get markup for " + post.description );
    read( post.href, function(err, article, meta) {
        if ( err ) {
            console.error( "ERROR parsing " + post.description );
            return callback( null, post );
        }
        try {
            post.content = article.content;
        } catch ( err ) {
            console.error( "ERROR parsing " + post.description );
            return callback( null, post );
        }

        callback( null, post );
    });
}

function getScreenshot( post, callback ) {
    console.log( "Get screenshot for " + post.description );
    webshot(post.href, 'thumbnails/' + post.hash + '.png', {
        screenSize: {
            width: 1024,
            height: 1024
        },
        timeout: 10000
    }, function( err ) {
        if ( err ) {
            console.error( err );
            return callback( null, post );
        }
        return callback( null, post );
    });
}

function enhance( data, output ) {
    var posts = JSON.parse( data ).filter( function( post ) {
        return "yes" === post.toread;
    });

    async.mapSeries( posts, processPost, function( err, results ) {
        if ( err ) {
            return console.error( err );
        }
        console.log( "Writing file...");
        fs.writeFile( output, JSON.stringify( results ), function( err ) {
            if ( err ) {
                return console.error( err );
            }
            console.log( "Done." );
        } );

    } );
}
