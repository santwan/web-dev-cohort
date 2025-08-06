import jwt from "jsonwebtoken";

/*
 * =================================================================
 * AUTHENTICATION MIDDLEWARE: isLoggedIn
 * =================================================================
 * Middleware in Express are functions that have access to the request (`req`),
 * the response (`res`), and the `next` function in the application's request-response cycle.
 *
 * This specific middleware acts as a gatekeeper for our protected routes. Its job is to:
 * 1. Check for an authentication token (JWT) in the incoming request's cookies.
 * 2. Verify that the token is valid and not expired.
 * 3. If valid, extract the user's information from the token and attach it to the request object (`req.user`).
 * 4. Pass control to the next function in the chain (either another middleware or the final route handler).
 *
 * If the token is missing or invalid, this middleware will stop the request chain
 * and send an "Unauthorized" error response.
 */
export const isLoggedIn = async (req, res, next) => {
    try {
        /*
         ! ✅ Step 1: Extract the Token from Cookies
         * We attempt to get the JWT from the `token` cookie in the incoming request.
         * The `req.cookies` object is made available by the `cookie-parser` middleware.
         * The `|| ""` provides a fallback to an empty string if the cookie is not found,
         * preventing potential errors.
         */
        const token = req.cookies.token || "";

        /*
         ! ✅ Step 2: Check if Token Exists
         * If no token is found, the user is not authenticated. We must stop the
         * request immediately and send a 401 (Unauthorized) status code.
         * The `return` statement is crucial to prevent further code execution.
         */
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request. Please log in.",
            });
        }

        /*
         ! ✅ Step 3: Verify the Token
         * This is the core of the authentication check. `jwt.verify()` does three things:
         * 1. Decodes the token's payload.
         * 2. Verifies the token's signature using our secret key to ensure it wasn't tampered with.
         * 3. Checks if the token is expired (based on the `exp` claim set during login).
         *
         * If verification fails for any reason (bad signature, expired), it will throw an error,
         * which will be caught by our `catch` block below.
         */
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

        /*
         ! ✅ Step 4: Attach User Info to the Request
         * If the token is successfully verified, `decodedPayload` will contain the
         * user information we stored during login (e.g., user ID, role).
         * We attach this payload to the `req` object as `req.user`. This is a standard
         * pattern that makes the authenticated user's data easily accessible in any
         * subsequent route handlers that are "downstream" from this middleware.
         */
        req.user = decodedPayload;

        /*
         ! ✅ Step 5: Pass Control to the Next Middleware
         * `next()` is the function that tells Express, "This middleware is done. Move on
         * to the next thing in the chain." The next thing could be another middleware
         * or the final controller function for the route.
         * If you forget to call `next()`, the request will hang and eventually time out.
         */
        next();

    } catch (error) {
        /*
         * ❌ Error Handling for Token Verification
         * This block catches errors thrown by `jwt.verify()`. This typically happens if:
         * - The token is expired (`TokenExpiredError`).
         * - The token's signature is invalid (`JsonWebTokenError`).
         *
         * In any of these cases, the user is not authorized. We return a 401 status,
         * as this is an authentication failure, not a server error.
         */
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please log in again.",
            error: error.message
        });
    }
};