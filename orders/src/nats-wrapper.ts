import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS From wrapper!!');
        resolve();
      });
      this.client.on('error', (error) => {
        reject(error);
      });
    });
  }

  get client() {
    if (!this._client) {
      throw new Error("nats-client can't be accessed before connecting");
    }

    return this._client;
  }
}

export const natsWrapper = new NatsWrapper();
