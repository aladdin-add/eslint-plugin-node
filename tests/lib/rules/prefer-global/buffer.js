/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("#test-helpers").RuleTester
const rule = require("../../../../lib/rules/prefer-global/buffer")

new RuleTester().run("prefer-global/buffer", rule, {
    valid: [
        "var b = Buffer.alloc(10)",
        {
            code: "var b = Buffer.alloc(10)",
            options: ["always"],
        },
        {
            code: "var { Buffer } = require('buffer'); var b = Buffer.alloc(10)",
            options: ["never"],
        },
        {
            code: "var { Buffer } = require('node:buffer'); var b = Buffer.alloc(10)",
            options: ["never"],
        },
    ],
    invalid: [
        {
            code: "var { Buffer } = require('buffer'); var b = Buffer.alloc(10)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { Buffer } = require('node:buffer'); var b = Buffer.alloc(10)",
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { Buffer } = require('buffer'); var b = Buffer.alloc(10)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var { Buffer } = require('node:buffer'); var b = Buffer.alloc(10)",
            options: ["always"],
            errors: [{ messageId: "preferGlobal" }],
        },
        {
            code: "var b = Buffer.alloc(10)",
            options: ["never"],
            errors: [{ messageId: "preferModule" }],
        },
    ],
})
