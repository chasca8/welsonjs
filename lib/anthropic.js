// anthropic.js
// Namhyeon Go <abuse@catswords.net>
// https://github.com/gnh1201/welsonjs
// 
// ***SECURITY NOTICE***
// Anthropic/Claude requires an internet connection, and data may be transmitted externally. Users must adhere to the terms of use and privacy policy.
// - Privacy Policy: https://www.anthropic.com/legal/privacy
//
var FILE = require("lib/file");
var HTTP = require("lib/http");

function loadApiKey() {
    var s = FILE.readFile("data/anthropic-apikey.txt", FILE.CdoCharset.CdoUTF_8);
    return s.trim();
}

function chat(content) {
    var answers = [];

    var apikey = loadApiKey();
    console.log("Anthropic (Claude) API KEY:", apikey);

    var response = HTTP.create("MSXML")
        .setVariables({
            "ANTHROPIC_API_KEY": apikey
        })
        .setContentType("application/json")
        .setHeaders({
            "x-api-key": "{ANTHROPIC_API_KEY}",
            "anthropic-version": "2023-06-01"
        })
        .setRequestBody({
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 1024,
            "messages": [{
                "role": "user",
                "content": content
            }]
        })
        .open("post", "https://api.anthropic.com/v1/messages")
        .send()
        .responseBody;

    if ("error" in response) {
        answers.push("Error: " + response.error.message);
    } else if ("content" in response && response.content.length > 0) {
        response.content.forEach(function(x) {
            if (x.type == "text") {
                answers.push(x.text);
            } else {
                answers.push("Not supported type: " + x.type);
            }
        });
    }

    return answers.join(' ');
}

exports.chat = chat;

exports.VERSIONINFO = "Anthropic (Claude) interface (anthropic.js) version 0.1.1";
exports.AUTHOR = "abuse@catswords.net";
exports.global = global;
exports.require = global.require;
