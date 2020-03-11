const https = require('https');
const http = require('http');

let data = '';
https.get('https://assets-es-prodref.myvdf.aws.cps.vodafone.com/mves/content', (resp) => {

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        console.log(JSON.parse(data));
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.write(data);
    res.end();
})

server.listen(5000);