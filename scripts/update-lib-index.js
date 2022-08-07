/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const fs = require("fs")
const path = require("path")
const { ESLint } = require("eslint")
const { rules } = require("./rules.js")

const filePath = path.resolve(__dirname, "../lib/index.js")
const rawContent = `/* DON'T EDIT THIS FILE. This is generated by 'scripts/update-lib-index.js' */
"use strict"

module.exports = {
    configs: {
        "recommended-module": require("./configs/recommended-module"),
        "recommended-script": require("./configs/recommended-script"),
        get recommended() {
            return require("./configs/recommended")()
        },
    },
    rules: {
        ${rules
            .filter(rule => !rule.deprecated)
            .map(rule => `"${rule.name}": require("./rules/${rule.name}"),`)
            .join("\n        ")}

        // Deprecated rules.
        ${rules
            .filter(rule => rule.deprecated)
            .map(rule => `"${rule.name}": require("./rules/${rule.name}"),`)
            .join("\n        ")}
    },
}
`
const linter = new ESLint({ fix: true })

// tla is not allowed in scripts. :)
linter.lintText(rawContent, { filePath }).then(lintResult => {
    const content = lintResult[0].output || rawContent
    fs.writeFileSync(filePath, content)
})
