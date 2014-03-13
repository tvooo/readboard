var https = require('https');

function Pinboard( auth_token ) {
    this.auth_token = auth_token;

}

Pinboard.prototype.getAll = function( cb ) {
    this._queryStream( "https://api.pinboard.in/v1/posts/all?format=json", cb );
};

Pinboard.prototype._queryStream = function( query, cb ) {
    https.get( query + "&auth_token=" + this.auth_token, cb );
};

Pinboard.prototype._query = function( query, cb ) {
    var result = '';
    https.get( allurl, function( res ) {
        res.on( 'data', function( chunk ) {
            result += chunk.toString();
        });

        res.on( 'end', function() {
            return cb( result );
        } );
    } );
};

module.exports = Pinboard;
