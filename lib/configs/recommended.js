"use strict"

const getPackageJson = require("../util/get-package-json")
const moduleConfig = require("./recommended-module")
const scriptConfig = require("./recommended-script")

const isModule = getPackageJson()?.type === "module"
const recommendedConfig = isModule ? moduleConfig : scriptConfig

/**
 * https://eslint.org/docs/latest/use/configure/configuration-files
 * @type {import('eslint').ESLint.ConfigData}
 */
module.exports.eslintrc = {
    ...recommendedConfig.eslintrc,
    overrides: [
        { files: ["*.cjs", ".*.cjs"], ...scriptConfig.eslintrc },
        { files: ["*.mjs", ".*.mjs"], ...moduleConfig.eslintrc },
    ],
}

module.exports.flat = recommendedConfig.flat
