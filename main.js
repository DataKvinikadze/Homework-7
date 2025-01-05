const fs = require("fs/promises");
const https = require("http");
const url = require("url");
const queryString = require("querystring");

const fetchUsers = async () => {
  const response = await fetch("https://dummyjson.com/users");
  const data = await response.json();
  await fs.writeFile("users.json", JSON.stringify(data));
};

// fetchUsers();

// 2

// const server = https.createServer(async (req, res) => {
//   res.write("hello World");
//   if (req.url == "/users") {
//     const data = await fs.readFile("users.json", "utf-8");
//     res.writeHead(200, { "content-type": "application/json" });
//     res.end(data);
//   }
// });

// server.listen(3000, () => {
//   console.log("Server is running at http://localhost:3000");
// });

// 3

const server = https.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.pathname;
  const query = queryString.parse(parsedUrl.query);

  if (path == "/users") {
    const data = await fs.readFile("users.json", "utf-8");
    console.log(data);
    const parsedData = JSON.parse(data);
    let filteredData = parsedData.users;
    if (query.age) {
      filteredData = filteredData.filter(
        (user) => user.age === Number(query.age)
      );
    }

    if (query.gender) {
      filteredData = filteredData.filter(
        (user) => user.gender.toLowerCase() === query.gender.toLowerCase()
      );
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(filteredData));
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
