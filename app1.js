const http=require('http')
const fs=require('fs')

const hostname='127.0.0.1'
const port='3000'

const index=fs.readFileSync('index.html')

const server=http.createServer((req,res)=>{
    console.log(req.url);
    url=req.url;
    res.statusCode=200;
    res.setHeader('Content-type','text/html');
    if(url=='/'){res.end(index)}
    else{
        res.statusCode=404;
        res.end(`<h1>Page not found</h1>`);
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });