/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/prefer-global/url-search-params")

new RuleTester({
    env: { node: true, es6: true },
}).run("prefer-global/url-search-params", rule, {
    valid: [
        "var b = new URLSearchParams(s)",
        {
            code: "var b = new URLSearchParams(s)",
            options: ["always"],
        },
        {
            code: "var { URLSearchParams } = require('url'); var b = new URLSearchParams(s)",
            options: ["never"],
        },
        {
            code: "var { URLSearchParams } = require('node:url'); var b = new URLSearchParams(s)",
            options: ["never"],
        },
    ],
    invalid: [
        {
            code: "var { URLSearchParams } = require('url'); var b = new URLSearchParams(s)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { URLSearchParams } = require('node:url'); var b = new URLSearchParams(s)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { URLSearchParams } = require('url'); var b = new URLSearchParams(s)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { URLSearchParams } = require('node:url'); var b = new URLSearchParams(s)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var b = new URLSearchParams(s)",
            options: ["never"],
            errors: [{ messageId: "preferModule" }],
        },
    ],
})
