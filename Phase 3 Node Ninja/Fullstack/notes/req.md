# Understanding req object 


- Think of the req (short for request) object as a giant, organized package of information that arrives at your server every time someone visits one of your URLs. This package contains everything you could possibly need to know about the incoming request.

- The key thing to understand is that this req object is built in stages.

## Express Core Properties: 

- When a request first arrives, Express.js creates the req object and fills it with basic information.

### Middleware Properties: 

- Then, the request passes through your middleware functions, one by one. Each middleware can add new properties to the req object.

- This is why you see things like req.body, req.cookies, and req.user appearing. They aren't there initially; they are added by middleware.

**Let's break it down.**

### 1. Part 1: The Built-in req Properties
These are the properties that Express gives you for free. They are always there.

- req.params: For route parameters. If your route is /users/:id, and the user visits /users/123, then req.params will be { id: '123' }.

- req.query: For query strings (the part of the URL after ?). If the user visits /search?term=dogs&page=2, then req.query will be { term: 'dogs', page: '2' }.

- req.method: The type of HTTP request (e.g., 'GET', 'POST', 'PUT').

- req.path: The path part of the URL (e.g., /users/profile).

- req.headers: An object containing all the request headers sent by the client.

### 2. Part 2: Properties Added by Middleware (This is the key part!)
This is where the magic happens and where your confusion likely comes from. The req object is mutable, meaning middleware can attach new information to it before passing it along.

### req.body
- Where does it come from? 
    - The express.json() and express.urlencoded() middleware.

- What does it do? 
    - When a POST or PUT request arrives with data in its body (like from a form submission), these middleware functions parse that data, create a body property on the req object, and put the parsed data inside it.

- Without app.use(express.json()), req.body would be undefined!

### req.cookies
- Where does it come from? 
    - The cookie-parser middleware.

- What does it do? 
    - This middleware looks at the Cookie header of the request, parses all the cookies into a convenient object, and attaches it to req as req.cookies.

- Without app.use(cookieParser()), req.cookies would be undefined!

### req.user (or req.anything)
- Where does it come from? 
    - From YOU! You create this property in your own custom middleware.

- What does it do? 
    - In our isLoggedIn middleware, after we verified the JWT, we did this: req.user = decodedPayload;. We literally created a new property on the req object called user and stored the decoded token information there.

- This is an incredibly powerful pattern! It allows your authentication middleware to provide user information to every subsequent route handler in the chain.

Putting It All Together: A Visual Example
Imagine this route in your routes.js file:

JavaScript

// This route uses two middleware functions before the final handler
router.post('/posts/:postId/comment', isLoggedIn, (req, res) => {
    
    // Let's see what's in our `req` object by this point:

    // 1. From Express Core:
    const thePostId = req.params.postId; // e.g., 'abc-123' from the URL
    
    // 2. From `express.json()` middleware:
    const commentText = req.body.text; // e.g., "This is a great post!"
    
    // 3. From `cookie-parser` middleware:
    // (We don't usually access this here, but isLoggedIn did)
    const allCookies = req.cookies;
    
    // 4. From OUR OWN `isLoggedIn` middleware:
    const currentUser = req.user; // e.g., { id: 'user-456', role: 'member' }

    console.log(`User with ID ${currentUser.id} is commenting "${commentText}" on post ${thePostId}.`);

    res.send("Comment received!");
});
Summary:

You are absolutely correct. You can have req.anything. The rule is simple: if it's not a built-in property like req.params or req.query, then it was added by a middleware function that ran before your final route handler. This is the fundamental design pattern of Express.js.