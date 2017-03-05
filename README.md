### Usage
```
npm i check-mixed-content
check-mixed-content --url franciskim.co
```

### Options
```
--thread 3 // use 3 threads to crawl (default: 1)
--depth 3 // crawl 3 levels deep (default: 3)
--debug // show moar info
```

### Sample Output
```
https://franciskim.co/ is good!
https://franciskim.co/about/ is good!
https://franciskim.co/my-work/ is good!
https://franciskim.co/posts/ is good!
https://franciskim.co/contact/ is good!
https://franciskim.co/about is good!
https://franciskim.co/author/franciskim/ is good!
https://franciskim.co/2016/10/14/aws-expert-melbourne/ is good!
https://franciskim.co/2016/09/29/create-bundled-intermediate-ssl-certificate-crazy-domains/ is good!
https://franciskim.co/2016/09/01/samsung-recalls-galaxy-note-7-battery/ is good!

Crawled 11 pages
11 pages are good
0 pages have mixed HTTP/HTTPS content
```
