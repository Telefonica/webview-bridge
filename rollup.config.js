import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'webview-bridge.ts',
    plugins: [typescript()],
    output: [
        {
            file: 'dist/webview-bridge-iife.js',
            format: 'iife',
            name: 'ReconnectingWebSocket',
        },
        {
            file: 'dist/webview-bridge-amd.js',
            format: 'amd',
            name: 'ReconnectingWebSocket',
        },
        {
            file: 'dist/webview-bridge-cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/webview-bridge.mjs',
            format: 'es',
        },
        {
            file: 'dist/webview-bridge-mjs.js',
            format: 'es',
        },
    ],
};
