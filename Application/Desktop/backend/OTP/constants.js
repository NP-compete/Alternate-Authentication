function define(obj, name, value) {
    Object.defineProperty(obj, name, {
        value:        value,
        enumerable:   true,
        writable:     false,
        configurable: false
    });
}

exports.responseFlags = {};
define(exports.responseFlags, "ACTION_FAILED"       , 144);
define(exports.responseFlags, "ACTION_COMPLETE"     , 143);
define(exports.responseFlags, "NOT_LOGGED_IN"       , 401);
define(exports.responseFlags, "NOT_AUTHORIZED"      , 403);
define(exports.responseFlags, "INTERNAL_SERVER_ERR" , 500);
define(exports.responseFlags, "NOT_FOUND"           , 404);

exports.databaseErrorResponse = {
  "log": "Server execution error",
  "flag": 144
};

exports.parameterMissingResponse = {
    "log": "Some parameters are missing/invalid",
    "flag": 144
};

