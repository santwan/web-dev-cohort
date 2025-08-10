/*
! This code defines a standardized ApiResponse class for creating consistent JSON responses in an API.

* It's a utility class that structures every successful server response in the same way, making the API more predictable and easier for frontend developers to work with.

? How It Works
    * Instead of manually creating an object like { success: true, data: ... } in every controller, you can create a new ApiResponse(...). This class automatically handles the structure.

    * Constructor: It takes a statusCode, the data to be sent, and an optional message.

    * Properties: It assigns the statusCode, data, and message to the new object.

    * Automatic Success Flag: It intelligently sets the this.success property to true if the statusCode is a success code (like 200, 201) and false otherwise.
*/


/*
 * =================================================================
 * UTILITY: Standard API Response Class
 * =================================================================
 * This class provides a standardized structure for all successful API responses
 * sent from the server. Using a consistent response format across all endpoints
 * makes the API more predictable and easier for client-side applications to consume.
 */
class ApiResponse {
    /*
     * The constructor builds the response object.
     *
     * @param {number} statusCode - The HTTP status code for the response (e.g., 200, 201).
     * @param {any} data - The data payload to be sent (e.g., a user object, a list of products).
     * @param {string} [message="Success"] - An optional descriptive message. Defaults to "Success".
     */
    constructor(statusCode, data, message = "Success") {
        // The HTTP status code of the response.
        this.statusCode = statusCode;
        
        // The actual data being sent back.
        this.data = data;
        
        // A descriptive message for the response.
        this.message = message;
        
        // A boolean flag indicating the success of the request.
        // This is automatically determined based on the HTTP status code.
        // Standard success codes are in the 2xx and 3xx range (i.e., less than 400).
        this.success = statusCode < 400;
    }
}

// Export the class to be used in other parts of the application.
export { ApiResponse };