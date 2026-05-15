import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                // Browser globals
                window: "readonly",
                document: "readonly",
                fetch: "readonly",
                navigator: "readonly",
                console: "readonly",
                IntersectionObserver: "readonly",
                // Node globals
                process: "readonly",
                __dirname: "readonly",
                module: "readonly",
                require: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": ["warn", { allow: ["warn", "error", "info"] }]
        }
    }
];
