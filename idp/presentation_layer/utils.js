/**
 * Wraps an asynchronous express-style handler function, ensuring it handles errors correctly.
 *
 * This will become obsolete when using express 5.0.0 or above.
 *
 * @param {Function<Promise<any>>} fn An asynchronous express-style handler function.
 * @returns {Promise<any>} An asynchronous express-style handler function.
 */
function asyncHandler(fn) {
    return async function (req, res, next) {
        // if an asynchronous function throws an exception after awaiting, it is not catched by the express router.
        // this has the unexpected effect of making the request hang forever.
        // the code below ensures that exceptions are forwarded to the next handler.
        try {
            return await fn(req, res, next);
        } catch (e) {
            next(e);
        }
    }
}

module.exports.asyncHandler = asyncHandler;
