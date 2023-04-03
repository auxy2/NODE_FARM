const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemp = require('./modules/replacetemplete')
const slugify = require('slugify');

const overview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const product = fs.readFileSync('./templates/template-product.html', 'utf-8');
const data = fs.readFileSync('./data.json', 'utf-8');
const dataobj = JSON.parse(data);
const slugs = dataobj.map(prd => slugify(prd.productName, { lower: true }));
console.log(slugs)

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const { query, pathname } = url.parse(req.url, true);

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const htmlobj = dataobj.map(el => replaceTemp(tempCard, el)).join('');
        const output = overview.replace('{%PRODUCT_CARDS%}', htmlobj);
        res.end(output);

    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html ' });
        const pdc = dataobj[query.id];
        const out = replaceTemp(product, pdc);
        res.end(out);

    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data);

    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-head': 'Hello world'
        })
        res.end('<h1> Page Not Found </h1>')
    }

})
server.listen(8000, () => {
    console.log('Your Server Is Now Runing On Port 8000')
});
