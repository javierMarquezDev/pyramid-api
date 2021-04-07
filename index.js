const http = require('http');
const fs = require('fs');

fs.readFile('./index.html', function(err, html) {

    if (err) {
        throw err;
    }

    const handleServer = function(req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(html);
        res.end();
    }

    const server = http.createServer(handleServer);

    server.listen(3000, function() {
        console.log('Server on port 3000')
    });
})