const http = require("http");

const users = [];

const server = http.createServer((req, res) => {
    const url = req.url;

    if (url === "/") {
        res.write(
            "<html lang='en'>" +
            "<body>" +
                "<h1>Hello everyone!</h1>" +
                "<p>Click here to show users:</p>" +
                "<form action='/users' method='POST'>" +
                    "<button type='submit'>Show</button>" +
                "</form>" +
                "<p>Register new user:</p>" +
                "<form action='/new-user' method='POST'>" +
                    "<input type='text' placeholder='username' name='username'>" +
                    "<button type='submit'>Register</button>" +
                "</form>" +
            "</body>" +
            "</html>"
        );
        return res.end();
    } else if (url === "/users") {

        let html = "<html lang='en'><body><h1>Users:</h1><ul>";

        for (const user of users) {
            html += `<li>${user}</li>`;
        }

        html += "</ul>";
        html += "<form action='/' method='POST'>" +
                    "<button type='submit'>Back</button>" +
                "</form>";
        html += "</body></html>";
        res.write(html);
        return res.end();
    } else if (url === "/new-user") {
        const body = [];
        req.on("data", chunk => {
            body.push(chunk);
        });
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split("=")[1];
            users.push(username);
            res.statusCode = 302;
            res.setHeader("Location", "/");
            return res.end();
        });
    }
});

server.listen(4040);
