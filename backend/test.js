const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Server is working!");
});

server.listen(5000, () => {
  console.log("Listening on port 5000");
});

setInterval(() => {
  console.log("Still alive...");
}, 5000);