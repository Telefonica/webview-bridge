import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'index.ts',
    plugins: [
        typescript({
            tsconfig: './tsconfig.production.json',
        }),
    ],
    output: [
        {
            file: 'dist/webview-bridge-amd.js',
            format: 'amd',
            name: 'webviewBridge',
        },
        {
            file: 'dist/webview-bridge-cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/webview-bridge-umd.js',
            format: 'umd',
            name: 'webviewBridge',
        },
        {
            file: 'dist/webview-bridge-iife.js',
            format: 'iife',
            name: 'webviewBridge',
        },
        {
            file: 'dist/webview-bridge.mjs',
            format: 'es',
        },
    ],
};
