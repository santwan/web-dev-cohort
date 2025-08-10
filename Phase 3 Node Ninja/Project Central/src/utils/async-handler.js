/*
    ! This code is a higher-order function called a utility wrapper designed to handle errors in asynchronous Express.js route handlers without needing a try...catch block in every function.

    * It ensures that if any asynchronous operation inside your route handler fails (e.g., a database query), the error is automatically caught and passed to Express's error-handling middleware.

    ? How It Works
    * The asyncHandler is a function that accepts another function (requestHandler) as its argument. It then returns a new function that Express will actually execute when a request comes in.

    * Wrapping the Handler: It takes your async route handler (like registerUser) and wraps it.

    * Executing and Resolving: Inside the returned function, Promise.resolve() immediately executes your requestHandler. If your handler is successful, the promise resolves, and nothing further happens here.

    * Catching Errors: If your requestHandler throws an error at any point (e.g., a database query fails), the promise will be rejected. The .catch() block then catches this error.

    * Passing to Express: The catch block calls next(error). This is the crucial step. It passes the error along to Express's centralized error-handling middleware, preventing your server from crashing.

*/

/*
 * =================================================================
 ! UTILITY: Async Handler Wrapper
 * =================================================================
 * This is a higher-order function that acts as a utility wrapper for our
 * asynchronous route handlers (controllers). Its primary purpose is to
 * eliminate the need for repetitive `try...catch` blocks inside every
 * single async controller.
 *
 * It works by taking an async function as an argument and returning a new
 * function. This new function ensures that any promise rejections (errors)
 * are caught and passed to Express's error handling middleware via `next()`.
 */
function asyncHandler(requestHandler) {
    // This wrapper returns a new function that Express will execute.
    // It accepts the standard (req, res, next) arguments.
    return function (req, res, next) {
        // `Promise.resolve()` is used to ensure that the result of the
        // `requestHandler` is treated as a promise, even if the handler
        // itself isn't explicitly returning one.
        Promise
            .resolve(requestHandler(req, res, next))
            // If the promise from the `requestHandler` is rejected (meaning an
            // error was thrown), the `.catch()` block will execute.
            .catch(function (error) {
                // We then pass the caught `error` to the `next()` function.
                // This invokes the next error-handling middleware in the
                // Express stack, centralizing our error management.
                next(error);
            });
    };
}