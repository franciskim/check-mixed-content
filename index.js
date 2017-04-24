#!/usr/bin/env node
'use strict';
const Crawler = require('easycrawler')
const cheerio = require('cheerio')
const argv = require('yargs').argv

let url = argv.url
let thread = argv.thread || 1
let depth = argv.depth || 3
let debug = argv.debug

if (argv.url.indexOf('https:') == -1) url = 'https://' + url
let goodCount = 0, badCount = 0, activeCount = 0
let crawler = new Crawler({
    thread: thread,
    logs: debug,
    depth: depth,
    headers: {'user-agent': 'foobar'},
    onlyCrawl: [url], //will only crawl urls containing these strings
    //reject : ['rutube'], //will reject links containing rutube
    onSuccess: function (data) {
        let bad = false
        let active = false
        let $ = cheerio.load(data.body)
        $('img').each(function () {
            if ($(this).attr('src')) bad = $(this).attr('src').indexOf('http:') > -1
            if ($(this).attr('srcset')) bad = $(this).attr('srcset').indexOf('http:') > -1
        })
        $('iframe').each(function () {
            if ($(this).attr('src')) active = $(this).attr('src').indexOf('http:') > -1
        })
        $('script').each(function () {
            if ($(this).attr('src')) active = $(this).attr('src').indexOf('http:') > -1
        })
        $('object').each(function () {
            if ($(this).attr('data')) active = $(this).attr('data').indexOf('http:') > -1
        })
        $('form').each(function () {
            if ($(this).attr('action')) bad = $(this).attr('action').indexOf('http:') > -1
        })
        $('embed').each(function () {
            if ($(this).attr('src')) active = $(this).attr('src').indexOf('http:') > -1
        })
        $('video').each(function () {
            if ($(this).attr('src')) bad = $(this).attr('src').indexOf('http:') > -1
        })
        $('audio').each(function () {
            if ($(this).attr('src')) bad = $(this).attr('src').indexOf('http:') > -1
        })
        $('source').each(function () {
            if ($(this).attr('src')) bad = $(this).attr('src').indexOf('http:') > -1
            if ($(this).attr('srcset')) bad = $(this).attr('srcset').indexOf('http:') > -1
        })
        $('param').each(function () {
            if ($(this).attr('value')) active = $(this).attr('value').indexOf('http:') > -1
        })
        $('link').each(function () {
            if ($(this).attr('href')) active = $(this).attr('href').indexOf('http:') > -1
        })
        if (active || bad) {
            if (active) {
                console.log(`===> ${data.url} has active mixed content!`)
                activeCount++
            }
            else {
                console.log(`===> ${data.url} has mixed content!`)
            }
            badCount++
        }
        else {
            console.log(`${data.url} is good!`)
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
        console.log(`${activeCount} pages have active mixed HTTP/HTTPS content`)
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
