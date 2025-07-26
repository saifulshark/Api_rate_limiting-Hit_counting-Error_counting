const express = require('express');
const app = express();
app.use(express.json()); // To parse JSON request bodies

// Global counters
let requestCount = 0;
let errorCount = 0;

// To track how many requests each user made
const userRequestCount = {};//1

// ✅ Middleware 1: Log total number of requests
function requestLogger(req, res, next) {
  requestCount++;
  console.log(`✅ Total Requests So Far: ${requestCount}`);
  next();
}
// function rateLimiter(req, res, next) {
//   const username = req.headers['username'];
//   console.log("🔍 Username from header:", username);

//   if (!username) {
//     return res.status(400).send("❌ Username header missing.");
//   }

//   if (!userRequestCount[username]) {
//     userRequestCount[username] = 1;
//   } else {
//     userRequestCount[username]++;
//   }

//   console.log(`🧾 ${username} has made ${userRequestCount[username]} requests`);

//   if (userRequestCount[username] > 5) {
//     return res.status(429).send("❌ Rate limit exceeded (max 5 requests allowed).");
//   }

//   next();
// }
// To track blocked users
//const userRequestCount = {};
const blockedUsers = {};//2
// ✅ Middleware 2: Rate limiter per username (max 5 requests in 1 minute)
// If a user exceeds the limit, they are blocked for 1 minute
function rateLimiter(req, res, next) {
  const username = req.headers['username'];

  if (!username) {
    return res.status(400).send("❌ Username header missing.");
  }

  // Check if user is blocked
  if (blockedUsers[username]) {
    const timePassed = Date.now() - blockedUsers[username];
    if (timePassed < 60_000) { // 1 minute = 60,000 ms
      return res.status(429).send("⏳ You're blocked. Try again after 1 minute.");
    } else {
      // Unblock after 1 minute
      delete blockedUsers[username];
      userRequestCount[username] = 1;
    }
  }

  // Count requests
  if (!userRequestCount[username]) {
    userRequestCount[username] = 1;
  } else {
    userRequestCount[username]++;
  }

  console.log(`🧾 ${username} has made ${userRequestCount[username]} requests`);

  if (userRequestCount[username] > 5) {
    blockedUsers[username] = Date.now(); // store block start time
    return res.status(429).send("❌ Rate limit exceeded. Blocked for 1 minute.");
  }

  next();
}


// ✅ Middleware 3: Error Logger (for logging total number of errors)
function errorLogger(err, req, res, next) {
  errorCount++;
  console.error(`🚨 Error #${errorCount}: ${err.message}`);
  res.status(500).send("❌ Internal Server Error");
}

// 👉 Use middlewares globally
app.use(requestLogger);
app.use(rateLimiter);

// ✅ Route 1: Normal route
app.get("/", (req, res) => {
  res.send("✅ Welcome to the server!");
});

// ✅ Route 2: Intentionally throws error
app.get("/error", (req, res) => {
  throw new Error("This is a test error.");
});

// ✅ Use error-handling middleware (must be after routes)
app.use(errorLogger);

// ✅ Start the server
app.listen(3000, () => {
  console.log("🚀 Server is running at http://localhost:3000");
});
