# Api_rate_limiting-Hit_counting-Error_counting
Api_rate_limiting-Hit_counting-Error_counting in using Middleware with sending data(username) autherization header.
## Express Middleware Project

A beginner-level Node.js + Express.js project demonstrating how to use custom middleware for:

- ✅ Logging total number of incoming requests
- 🔒 Rate limiting requests per user (block after 5 hits for 1 minute)
- 🛑 Handling and logging server-side errors

---

## 📂 Files

- `middlewareServer.js` → Main Express server with middleware
- `README.md` → Project documentation

---

## 🛠️ Setup & Run

1. **Clone this repo**
   ```bash
   git clone https://github.com/saifulire/*name.git
   cd *name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node middlewareServer.js
   ```

Server will run at:  
➡️ `http://localhost:3000/`

---

## 🧪 Testing with Postman

### 🔹 Route 1: `/` (GET)

- In "Header" section:
  ```
  Key: username
  Value: saifulire
  ```
- Behavior:
  - ✅ First 5 requests → `Welcome to the server!`
  - ❌ After 5th request → `Rate limit exceeded. Blocked for 1 minute`

---

### 🔹 Route 2: `/error` (GET)

- In "Header" section:
  ```
  username: saifulire
  ```
- Behavior:
  - 🔥 Throws an error intentionally
  - ❌ Response: `Internal Server Error`
  - 🪵 Console logs the error number and message
