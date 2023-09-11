# Disallow `import` declarations which import non-existence modules (`n/no-missing-import`)

💼 This rule is enabled in the following [configs](https://github.com/eslint-community/eslint-plugin-n#-configs): ☑️ `flat/recommended`, 🟢 `flat/recommended-module`, ✅ `flat/recommended-script`, ☑️ `recommended`, 🟢 `recommended-module`, ✅ `recommended-script`.

<!-- end auto-generated rule header -->

This is similar to [no-missing-require](no-missing-require.md), but this rule handles `import` and `export` declarations.

⚠️ ECMAScript 2015 (ES6) does not define the lookup logic and Node does not support modules yet. So this rule spec might be changed in future.

## 📖 Rule Details

This rule checks the file paths of `import` and `export` declarations.
If the file paths don't exist, this reports these.

Examples of 👎 **incorrect** code for this rule:

```js
/*eslint n/no-missing-import: "error" */

import typoFile from "./typo-file";   /*ERROR: "./typo-file" is not found.*/
import typoModule from "typo-module"; /*ERROR: "typo-module" is not found.*/
```

Examples of 👍 **correct** code for this rule:

```js
/*eslint n/no-missing-import: "error" */

import existingFile from "./existing-file";
import existingModule from "existing-module";
```

### Options

```json
{
    "rules": {
        "n/no-missing-import": ["error", {
            "allowModules": [],
            "resolvePaths": ["/path/to/a/modules/directory"]
        }]
    }
}
```

#### allowModules

This can also be configured as a shared setting [`settings.allowModules`](../shared-settings.md#allowmodules)

Some platforms have additional embedded modules.
For example, Electron has `electron` module.

We can specify additional embedded modules with this option.
This option is an array of strings as module names.

```json
{
    "rules": {
        "n/no-missing-import": ["error", {
            "allowModules": ["electron"]
        }]
    }
}
```

#### resolvePaths

This can also be configured as a shared setting [`settings.resolvePaths`](../shared-settings.md#resolvepaths)

Adds additional paths to try for when resolving imports.
If a path is relative, it will be resolved from CWD.

Default is `[]`

#### typescriptExtensionMap

This can also be configured as a shared setting [`settings.typescriptExtensionMap`](../shared-settings.md#typescriptextensionmap)

Adds the ability to change the extension mapping when converting between typescript and javascript

You can also use the [typescript compiler jsx options](https://www.typescriptlang.org/tsconfig#jsx) to automatically use the correct mapping.

If this option is left undefined we:

1. Check the Shared Settings
2. Check your `tsconfig.json` `compilerOptions.jsx`
3. Return the default mapping (jsx = `preserve`)

Default is:

```json
[
    [ "", ".js" ],
    [ ".ts", ".js" ],
    [ ".cts", ".cjs" ],
    [ ".mts", ".mjs" ],
    [ ".tsx", ".jsx" ],
]
```

#### tsconfigPath

This can also be configured as a shared setting [`settings.tsconfigPath`](../shared-settings.md#tsconfigpath)

Adds the ability to specify the tsconfig used by the typescriptExtensionMap tool.

## 🔎 Implementation

- [Rule source](../../lib/rules/no-missing-import.js)
- [Test source](../../tests/lib/rules/no-missing-import.js)
