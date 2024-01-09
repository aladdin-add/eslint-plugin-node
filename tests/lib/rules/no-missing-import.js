/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const path = require("path")
const { Linter } = require("eslint")
const { RuleTester } = require("#eslint-rule-tester")
const rule = require("../../../lib/rules/no-missing-import")

const DynamicImportSupported = (() => {
    const config = { languageOptions: { ecmaVersion: 2020 } }
    const messages = new Linter().verify("import(s)", config)
    return messages.length === 0
})()

if (!DynamicImportSupported) {
    console.warn(
        "[%s] Skip tests for 'import()'",
        path.basename(__filename, ".js")
    )
}

const tsReactExtensionMap = [
    ["", ".js"],
    [".ts", ".js"],
    [".cts", ".cjs"],
    [".mts", ".mjs"],
    [".tsx", ".js"],
]

/**
 * Makes a file path to a fixture.
 * @param {string} name - A name.
 * @returns {string} A file path to a fixture.
 */
function fixture(name) {
    return path.resolve(__dirname, "../../fixtures/no-missing", name)
}

const ruleTester = new RuleTester({
    languageOptions: {
        sourceType: "module",
    },
})
ruleTester.run("no-missing-import", rule, {
    valid: [
        {
            filename: fixture("test.js"),
            code: "import eslint from 'eslint';",
        },
        {
            filename: fixture("test.js"),
            code: "import fs from 'fs';",
        },
        {
            filename: fixture("test.js"),
            code: "import fs from 'node:fs';",
        },
        {
            filename: fixture("test.js"),
            code: "import eslint from 'eslint'",
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.js';",
        },
        {
            filename: fixture("test.ts"),
            code: "import a from './a.js';",
        },
        {
            filename: fixture("test.ts"),
            code: "import a from './d.js';",
        },
        {
            filename: fixture("test.js"),
            code: "import aConfig from './a.config.js';",
        },
        {
            filename: fixture("test.js"),
            code: "import b from './b.json';",
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c.coffee';",
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha';",
        },
        {
            filename: fixture("test.js"),
            code: "import something from 'cjs-module-with-no-main';",
        },
        {
            filename: fixture("test.js"),
            code: "import something from 'esm-module';",
        },
        {
            filename: fixture("test.js"),
            code: "import something from 'esm-module/sub';",
        },
        {
            filename: fixture("test.js"),
            code: "import mocha from 'mocha!foo?a=b&c=d';",
        },
        {
            filename: fixture("test.tsx"),
            code: "import a from './e.jsx';",
        },

        // Ignores it if the filename is unknown.
        "import abc from 'no-exist-package-0';",
        "import b from './b';",

        // no source.
        {
            filename: fixture("test.js"),
            code: "const foo=0, bar=1; export {foo, bar};",
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import eslint from 'eslint'",
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import a from './a.js';",
        },

        // allow option.
        {
            filename: fixture("test.js"),
            code: "import electron from 'electron';",
            options: [{ allowModules: ["electron"] }],
        },

        // resolvePaths
        {
            filename: fixture("test.js"),
            code: "import a from './fixtures/no-missing/a.js';",
            settings: {
                node: { resolvePaths: [path.resolve(__dirname, "../../")] },
            },
        },
        {
            filename: fixture("test.js"),
            code: "import a from './fixtures/no-missing/a.js';",
            options: [{ resolvePaths: ["tests"] }],
        },

        // typescriptExtensionMap
        {
            // name: "settings.node - [] as react - d.ts as d.js",
            filename: fixture("test.tsx"),
            code: "import d from './d.js';",
            settings: { node: { typescriptExtensionMap: tsReactExtensionMap } },
        },
        {
            // name: "settings.node - [] as react - e.tsx as e.js",
            filename: fixture("test.tsx"),
            code: "import e from './e.js';",
            settings: { node: { typescriptExtensionMap: tsReactExtensionMap } },
        },
        {
            // name: "options[0] - [] as react - d.ts as d.js",
            filename: fixture("test.tsx"),
            code: "import d from './d.js';",
            options: [{ typescriptExtensionMap: tsReactExtensionMap }],
        },
        {
            // name: "options[0] - [] as react - e.tsx as e.js",
            filename: fixture("test.tsx"),
            code: "import e from './e.js';",
            options: [{ typescriptExtensionMap: tsReactExtensionMap }],
        },

        // tsx mapping by name
        {
            // name: "options[0] - preserve - e.tsx as e.jsx",
            filename: fixture("test.tsx"),
            code: "import e from './e.jsx';",
            options: [{ typescriptExtensionMap: "preserve" }],
        },
        {
            // name: "options[0] - react - e.tsx as e.js",
            filename: fixture("test.tsx"),
            code: "import e from './e.js';",
            options: [{ typescriptExtensionMap: "react" }],
        },
        {
            // name: "settings.node - preserve - e.tsx as e.jsx",
            filename: fixture("test.tsx"),
            code: "import e from './e.jsx';",
            settings: { node: { typescriptExtensionMap: "preserve" } },
        },
        {
            // name: "settings.node - react - e.tsx as e.js",
            filename: fixture("test.tsx"),
            code: "import e from './e.js';",
            settings: { node: { typescriptExtensionMap: "react" } },
        },

        // explicit tsx from config
        {
            // name: "options[0] - preserve - e.tsx as e.jsx",
            filename: fixture("ts-react/test.tsx"),
            code: "import e from './e.jsx';",
            options: [{ tsconfigPath: fixture("ts-preserve/tsconfig.json") }],
        },
        {
            // name: "options[0] - react - e.tsx as e.js",
            filename: fixture("ts-preserve/test.tsx"),
            code: "import e from './e.js';",
            options: [{ tsconfigPath: fixture("ts-react/tsconfig.json") }],
        },
        {
            // name: "settings.node - preserve - e.tsx as e.jsx",
            filename: fixture("ts-react/test.tsx"),
            code: "import e from './e.jsx';",
            settings: {
                node: { tsconfigPath: fixture("ts-preserve/tsconfig.json") },
            },
        },
        {
            // name: "settings.node - react - e.tsx as e.js",
            filename: fixture("ts-preserve/test.tsx"),
            code: "import e from './e.js';",
            settings: {
                node: { tsconfigPath: fixture("ts-react/tsconfig.json") },
            },
        },

        // implicit tsx from config
        {
            // name: "tsconfig - jsx: react - e.tsx as e.js",
            filename: fixture("ts-react/test.tsx"),
            code: "import e from './e.js';",
        },
        {
            // name: "tsconfig - jsx: react - d.ts as d.js",
            filename: fixture("ts-react/test.ts"),
            code: "import d from './d.js';",
        },
        {
            // name: "tsconfig - jsx: preserve - e.tsx as e.jsx",
            filename: fixture("ts-preserve/test.tsx"),
            code: "import e from './e.jsx';",
        },
        {
            // name: "tsconfig - jsx: preserve - d.ts as d.js",
            filename: fixture("ts-preserve/test.ts"),
            code: "import d from './d.js';",
        },
        {
            // name: "tsconfig - extends: base (jsx: react) - e.tsx as e.js",
            filename: fixture("ts-extends/test.tsx"),
            code: "import e from './e.js';",
        },
        {
            // name: "tsconfig - extends: base (jsx: react) - d.ts as d.js",
            filename: fixture("ts-extends/test.ts"),
            code: "import d from './d.js';",
        },

        {
            // name: "tsconfig - compilerOptions.paths - direct reference",
            filename: fixture("ts-paths/test.ts"),
            code: "import before from '@direct';",
            env: { node: true },
        },
        {
            // name: "tsconfig - compilerOptions.paths - wildcard reference",
            filename: fixture("ts-paths/test.ts"),
            code: "import before from '@wild/where.js';",
            env: { node: true },
        },

        {
            // name: 'Ensure type only packages can be imported',
            filename: fixture("test.ts"),
            parser: path.join(
                __dirname,
                "../../../node_modules/@typescript-eslint/parser"
            ),
            code: "import type d from 'types-only';",
            env: { node: true },
        },

        {
            filename: fixture("ts-allow-extension/test.ts"),
            code: "import './file.js';",
            env: { node: true },
        },
        {
            filename: fixture("ts-allow-extension/test.ts"),
            code: "import './file.ts';",
            env: { node: true },
        },

        // import()
        ...(DynamicImportSupported
            ? [
                  {
                      filename: fixture("test.js"),
                      code: "function f() { import(foo) }",
                      languageOptions: { ecmaVersion: 2020 },
                  },
              ]
            : []),
    ],
    invalid: [
        {
            filename: fixture("test.js"),
            code: "import abc from 'no-exist-package-0';",
            errors: ['"no-exist-package-0" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import abcdef from 'esm-module/sub.mjs';",
            errors: ['"esm-module/sub.mjs" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import test from '@mysticatea/test';",
            errors: ['"@mysticatea/test" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import c from './c';",
            errors: ['"./c" is not found.'],
        },
        {
            filename: fixture("test.ts"),
            code: "import d from './d';",
            errors: ['"./d" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import d from './d';",
            errors: ['"./d" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './a.json';",
            errors: ['"./a.json" is not found.'],
        },

        // Should work fine if the filename is relative.
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import eslint from 'no-exist-package-0';",
            errors: ['"no-exist-package-0" is not found.'],
        },
        {
            filename: "tests/fixtures/no-missing/test.js",
            code: "import c from './c';",
            errors: ['"./c" is not found.'],
        },

        // Relative paths to a directory should work.
        {
            filename: fixture("test.js"),
            code: "import a from './bar';",
            errors: ['"./bar" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './bar/';",
            errors: ['"./bar/" is not found.'],
        },
        // Relative paths to an existing directory should not work.
        {
            filename: fixture("test.js"),
            code: "import a from '.';",
            errors: ['"." is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './';",
            errors: ['"./" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './foo';",
            errors: ['"./foo" is not found.'],
        },
        {
            filename: fixture("test.js"),
            code: "import a from './foo/';",
            errors: ['"./foo/" is not found.'],
        },

        // Case sensitive
        {
            filename: fixture("test.js"),
            code: "import a from './A.js';",
            errors: ['"./A.js" is not found.'],
        },

        // import()
        ...(DynamicImportSupported
            ? [
                  {
                      filename: fixture("test.js"),
                      code: "function f() { import('no-exist-package-0') }",
                      languageOptions: { ecmaVersion: 2020 },
                      errors: ['"no-exist-package-0" is not found.'],
                  },
              ]
            : []),
    ],
})
