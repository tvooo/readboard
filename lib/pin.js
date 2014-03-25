var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var _ = require("lodash");
var Pinboard = require('./pinboard'),
    auth_token = require('./token');

var pinboard = new Pinboard( auth_token );

var PinSchema = Schema({
    hash: String,
    meta: String,
    description: String,
    extended: String,
    toread: Boolean,
    href: String,
    tags: [String],
    time: Date, // change do Date
    shared: Boolean,
    text: String,
    duration: Number
});

PinSchema.methods.markAsRead = function( cb ) {
    var pin = {
        url: this.href,
        description: this.description,
        extended: this.extended,
        tags: this.tags.join(" "),
        dt: this.time,
        shared: this.shared ? "yes" : "no",
        replace: "yes", // no way around this
        toread: "no" // after all, we want to mark it as 'read', right?
    };
    pinboard.save( pin, _.bind( function( err, result ) {
        if ( err ) {
            console.error( err );
            return cb( err );
        }
        console.log( result );
        this.update( {$set: { "toread": false }}, cb );
    }, this ) );

    // $args = array(
    /*        'url' => $bookmark->url,
            'description' => $bookmark->title,
            'extended' => $bookmark->description,
            'tags' => $this->_normalize_tags($bookmark->tags),
            'replace' => $replace ? 'yes' : 'no',
        );*/
};

PinSchema.pre('save', function (next) {
    // toread : Boolean
    if ( typeof this.toread === "string" ) {
        this.toread = this.toread === "yes";
    }
    // shared : Boolean
    if ( typeof this.shared === "string" ) {
        this.shared = this.shared === "yes";
    }
    // tags : [String]
    if ( typeof this.tags === "string" ) {
        this.tags = this.tags.split(" ").map( function( tag ) {
            return tag.trim();
        });
    }
    // time : Date - automatic conversion?
    /*item.time = new Date( item.time );*/

    next();
});

var Pin = mongoose.model( "pin", PinSchema );

module.exports = Pin;
