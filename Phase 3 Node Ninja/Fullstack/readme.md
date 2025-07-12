
## `app.use(express.json());` and `app.use(express.urlencoded({ extended: true }));`
<details>
    <summary><strong>Know What this line of code do</strong></summary>

---

```js
app.use(express.json());
```
- Middleware to parse incoming JSON requests
- This allows your server to accept and understand JSON data in request bodies (e.g., POST, PUT requests)

### Purpose: 
- Parses incoming requests with JSON payloads and makes the data available in `req.body`.

--- 

```js
app.use(express.urlencoded({ extended: true }));
```
- When a user submits a form on a website (like a login or contact form), the browser sends that data to the server in a format called URL-encoded.

- This format looks like this: `name=Santwan&age=21`
- But Express (the server) doesn’t automatically understand this format. 
- So we use:
#### `app.use(express.urlencoded({ extended: true }));`

#### This line tells Express:
> "Hey, please understand and extract the form data sent from the client, and put it inside req.body so I can use it."
</details>