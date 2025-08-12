/*
 * =================================================================
 * UTILITY: Standard API Error Class
 * =================================================================
 * This class provides a standardized way to handle and create errors
 * throughout the application. Instead of throwing a generic `Error` object,
 * we can use `ApiError` to create a more informative error object that includes
 * an HTTP status code and other details.
 *
 * It inherits from the built-in `Error` class, so it behaves like a
 * standard JavaScript error but with extra properties.
 */
class ApiError extends Error {
    /*
     * The constructor builds the error object.
     *
     * @param {number} statusCode - The HTTP status code (e.g., 400, 404, 500).
     * @param {string} [message="Something went wrong"] - A clear, user-friendly error message.
     * @param {Array} [errors=[]] - An optional array of more specific error details (e.g., validation errors).
     * @param {string} [stack=""] - An optional stack trace. If not provided, a new one will be generated.
     */
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        // `super(message)` calls the constructor of the parent `Error` class,
        // which sets the `message` property for this error instance.
        super(message);

        // The HTTP status code associated with this error.
        this.statusCode = statusCode;
        
        // Overwriting the `message` property from the parent class (optional but clear).
        this.message = message;
        
        // For an ApiError, the `success` flag is always `false`.
        this.success = false;
        
        // An array to hold any specific validation or related errors.
        this.errors = errors;

        // This part handles the stack trace for easier debugging.
        if (stack) {
            // If a custom stack trace is provided, use it.
            this.stack = stack;
        } else {
            // Otherwise, capture the stack trace for the current error instance,
            // excluding the constructor call from the trace.
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the class for use in other parts of the application.
export { ApiError };