/* DB Models */
var Pin = require("./pin");
/* Pinboard API */
var Pinboard = require('./pinboard'),
    auth_token = require('./token');

var async = require('async');
var read = require('node-readability');

var pinboard = new Pinboard( auth_token );

var routes = {
    index: function(req, res) {
        res.render('index.html', {date: new Date().toDateString()});
    },
    read: function(req, res) {
        var id = req.params.id;
        Pin.findOne({ hash: id }, function( err, doc ) {
            res.render( "read.html", { active: doc } );
        });
    },
    /*
        Scrape the content for a Pin's href.
        Add to the DB on success.
    */
    enrich: function(req, res) {
        var id = req.params.id;
        Pin.findOne({ hash: id }, function( err, doc ) {
            //res.render( "read.html", { active: doc } );
            if ( !doc.text ) {
                read( doc.href, function( err, article, meta ) {
                    doc.update({$set: {text: article.content} }, function( err, numberAffected, raw ) {
                        res.json({
                            numberAffected: numberAffected
                        });
                    });
                });
            }
        });
    },
    /*
        Mark a Pin as 'read' on Pinboard.
        On success, mark it as 'read' in the DB.
    */
    markAsRead: function( req, res ) {
        var id = req.params.id;
        Pin.findOne({ hash: id }, function( err, doc ) {
            doc.markAsRead( function( err, numberAffected, raw ) {
                if ( err ) {
                    return res.json( {error: "error"} );
                }
                return res.json( {success: "success"} );
            });
        });
    },
    /*
        Get the list of all unread Pins as JSON.
    */
    getPosts: function( req, res ) {
        Pin.find({ toread: true }, function( err, docs ) {
            docs = docs.sort( function( a, b ) {
                var result = a < b ? -1 : a > b ? 1 : 0;
                return result;
            });
            console.log( docs.length );
            res.json( docs );
        });
    },
    /*
        Get a Pin as JSON.
    */
    getPost: function(req, res) {
        var id = req.params.id;
        Pin.findOne({ hash: id }, function( err, docs ) {
            res.json( docs );
        });
    },
    /*
        Fetch/Update a Pin from Pinboard.
        Duplicated /enrich/.
    */
    /*sync: function(req, res) {
        var id = req.params.id;
        Pin.findOne({ hash: id }, function( err, doc ) {
            // Enrich stuff
            read( doc.href, function(err, article, meta) {
                if ( err ) {
                    console.error( "ERROR parsing " + post.description );
                    return res.json( {"error": "error"} );
                }
                try {
                    doc.content = article.content;
                } catch ( err ) {
                    console.error( "ERROR parsing " + post.description );
                    return res.json( {"error": "error"} );
                }
                res.json( doc );
            });
        });
    },*/
    /*
        Do an initial sync with Pinboard.
        Do this only once in a lifetime.
    */
    syncAll: function( req, res ) {
        pinboard.getAll( function( err, data ) {
            var numSaved = 0,
                numUpdated = 0;
            async.each( JSON.parse( data ), function( item, done ) {
                if ( item.toread !== "yes" ) {
                    return done( null );
                }
                Pin.findOne( { hash: item.hash }, function( err, doc ) {
                    if ( err || !doc ) {
                        var pin = new Pin ( item );
                        pin.save( function(err, d) {
                            numSaved++;
                            done( null );
                        } );
                        return;
                    }
                    doc.update( item, {}, function(err, d) {
                        numUpdated++;
                        done( null );
                    } );
                } );
            }, function( err ) {
                res.json({
                    saved: numSaved,
                    updated: numUpdated
                });
            });
        });
    }
};

module.exports = routes;
