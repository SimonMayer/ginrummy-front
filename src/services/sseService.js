import store from '@/store';

const BASE_URL = process.env.VUE_APP_BASE_URL;

class SSEService {
    constructor(endpoint, params = {}, maxRetries = 3, retryDelay = 1000) {
        this.endpoint = endpoint;
        this.params = params;
        this.maxRetries = maxRetries;
        this.retryDelay = retryDelay;
        this.eventSource = null;
        this.retryCount = 0;
        this.forcedClose = false;
        this.url = '';
    }

    async setUrl() {
        const token = await store.getters['auth/tokens/sseAccessToken'];
        const url = new URL(`${BASE_URL}${this.endpoint}`);

        for (const [key, value] of Object.entries(this.params)) {
            url.searchParams.set(key, value);
        }
        url.searchParams.set('token', token);

        this.url = url.toString();
    }

    async reconnect(onMessage, onError) {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            try {
                await store.dispatch('auth/tokens/refreshSseAccessToken');
                setTimeout(() => this.connect(onMessage, onError), this.retryDelay);
            } catch (refreshError) {
                if (onError) {
                    onError(refreshError);
                }
            }
        } else {
            if (onError) {
                onError(new Error('Cannot reconnect SSE: Maximum number of retries reached'));
            }
        }
    }

    async connect(onMessage, onError) {
        try {
            await this.setUrl();
            this.eventSource = new EventSource(this.url);

            this.eventSource.onopen = () => {
                this.retryCount = 0;
            };

            this.eventSource.onmessage = (event) => {
                if (onMessage) {
                    onMessage(JSON.parse(event.data));
                }
            };

            this.eventSource.onerror = async () => {
                this.eventSource.close();
                if (!this.forcedClose) {
                    await this.reconnect(onMessage, onError);
                }
            };
        } catch (error) {
            if (!this.forcedClose) {
                await this.reconnect(onMessage, onError);
            } else if (onError) {
                onError(error);
            }
        }
    }

    disconnect() {
        if (this.eventSource) {
            this.forcedClose = true;
            this.eventSource.close();
        }
    }
}

export default SSEService;
