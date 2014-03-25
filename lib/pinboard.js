var https = require('https'),
    querystring = require('querystring');

function Pinboard( auth_token ) {
    this.auth_token = auth_token;
}

Pinboard.prototype.getAllStream = function( cb ) {
    this._queryStream( "https://api.pinboard.in/v1/posts/all?format=json", cb );
};

Pinboard.prototype.getAll = function( cb ) {
    this._query( "https://api.pinboard.in/v1/posts/all?format=json", cb );
};

Pinboard.prototype.save = function( pin, cb ) {
    this._query( "https://api.pinboard.in/v1/posts/add?format=json&" + querystring.stringify( pin ), cb );
};

Pinboard.prototype._queryStream = function( query, cb ) {
    https.get( query + "&auth_token=" + this.auth_token, cb );
};

Pinboard.prototype._query = function( query, cb ) {
    var result = '';
    https.get( query + "&auth_token=" + this.auth_token, function( res ) {
        res.on( 'data', function( chunk ) {
            result += chunk.toString();
        });

        res.on( 'end', function() {
            return cb( null, result );
        } );
    } );
};

module.exports = Pinboard;
