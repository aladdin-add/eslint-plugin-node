/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../../lib/rules/prefer-global/url")

new RuleTester({
    env: { node: true, es6: true },
}).run("prefer-global/url", rule, {
    valid: [
        "var b = new URL(s)",
        {
            code: "var b = new URL(s)",
            options: ["always"],
        },
        {
            code: "var { URL } = require('url'); var b = new URL(s)",
            options: ["never"],
        },
        {
            code: "var { URL } = require('node:url'); var b = new URL(s)",
            options: ["never"],
        },
    ],
    invalid: [
        {
            code: "var { URL } = require('url'); var b = new URL(s)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { URL } = require('node:url'); var b = new URL(s)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { URL } = require('url'); var b = new URL(s)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { URL } = require('node:url'); var b = new URL(s)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var b = new URL(s)",
            options: ["never"],
            errors: [{ messageId: "preferModule" }],
        },
    ],
})
