import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'index.ts',
    plugins: [typescript()],
    output: [
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
            file: 'dist/webview-bridge-umd.js',
            format: 'umd',
            name: 'webviewBridge',
        },
        {
            file: 'dist/webview-bridge.mjs',
            format: 'es',
        },
    ],
};
