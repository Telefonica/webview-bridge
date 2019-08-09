type Message = {id: string; type: string; payload?: any};

export const createFakeAndroidPostMessage = ({
    checkMessage = () => {},
    getResponse = msg => msg,
}: {
    checkMessage?: (msg: Message) => void;
    getResponse?: (msg: Message) => Message | Promise<Message>;
} = {}) => {
    window.tuentiWebView = {
        postMessage: async jsonMessage => {
            const message: Message = JSON.parse(jsonMessage);

            checkMessage(message);

            window.__tuenti_webview_bridge!.postMessage(
                JSON.stringify(await getResponse(message)),
            );
        },
    };
};

export const createFakeWebKitPostMessage = ({
    checkMessage = () => {},
    getResponse = msg => msg,
}: {
    checkMessage?: (msg: Message) => void;
    getResponse?: (msg: Message) => Message;
} = {}) => {
    window.webkit = {
        messageHandlers: {
            tuentiWebView: {
                postMessage: jsonMessage => {
                    const message = JSON.parse(jsonMessage);

                    checkMessage(message);

                    window.__tuenti_webview_bridge!.postMessage(
                        JSON.stringify(getResponse(message)),
                    );
                },
            },
        },
    };
};

export const removeFakeAndroidPostMessage = () => delete window.tuentiWebView;
export const removeFakeWebKitPostMessage = () => delete window.webkit;
