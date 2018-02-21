#!/usr/bin/env node
'use strict';
const Crawler = require('easycrawler')
const cheerio = require('cheerio')
const colors = require('colors');
const argv = require('yargs').argv

let url = argv.url
let thread = argv.thread || 1
let depth = argv.depth || 3
let debug = argv.debug

if (argv.url.indexOf('https:') == -1) url = 'https://' + url
let goodCount = 0, badCount = 0

//These are the elements to check for mixed content
let elementsToCheck = ['img','iframe','script','object','form','embed','video','audio','source','param','link']

//Check these attributes for mixed content
var attributeTypes = ['src','srcset','href'];

let crawler = new Crawler({
    thread: thread,
    logs: debug,
    depth: depth,
    headers: {'user-agent': 'foobar'},
    onlyCrawl: [url], //will only crawl urls containing these strings
    //reject : ['rutube'], //will reject links containing rutube
    onSuccess: function (data) {
        let bad = false
        let $ = cheerio.load(data.body)
        let currAttr;

        for(let element of elementsToCheck) {
            $(element).each((index, item) => {
                for(let attribute of attributeTypes) {
                    currAttr = $(item).attr(attribute);
                    if(currAttr && currAttr.indexOf('http:') > -1) {
                        bad = true;
                    }
                }
            })
        }

        if(bad) {
            console.log(colors.red(`===> ${data.url} has active mixed content!`));
            badCount++
        } else {
            console.log(colors.green(`${data.url} is good!`));
            goodCount++
        }

    },
    onError: function (data) {
        console.log(data.url)
        console.log(data.status)
    },
    onFinished: function (urls) {
        console.log(`\nCrawled ${urls.crawled.length} pages`)
        console.log(`${goodCount} pages are good`)
        console.log(`${badCount} pages have mixed HTTP/HTTPS content`)
        if (debug) {
            console.log(urls.discovered)
            console.log(urls.crawled)
        }
        if (badCount) {
            process.exitCode = 1
        }
    }
})
crawler.crawl(url)
