import '../types';
import '../post-message';

it('installs bridge', () => {
    expect(typeof window.__tuenti_webview_bridge!.postMessage).toBe('function');
});
