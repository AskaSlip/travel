import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintImport from "eslint-plugin-import";

export default [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: "tsconfig.json",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "prettier": prettier,
            "simple-import-sort": simpleImportSort,
            "import": eslintImport,
        },
        rules: {
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["warn"],
            "@typescript-eslint/return-await": ["error", "always"],

            "simple-import-sort/imports": "error",
            "import/first": "error",
            "import/newline-after-import": ["error", { "count": 1 }],
            "import/no-duplicates": "error",

            "prettier/prettier": ["error", { "endOfLine": "auto" }],
            "no-console": "warn",

            "sort-imports": ["error", {
                "ignoreCase": true,
                "ignoreDeclarationSort": true,
                "ignoreMemberSort": false,
                "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
                "allowSeparatedGroups": false
            }],
        },
        ignores: [".eslintrc.js", "**/*.generated.ts", "**/migrations/*.ts"],
    }
];
