type EventCallback<T> = (data: T) => void;

class EventListener {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private eventCallbacks: { [event: string]: EventCallback<any>[] } = {};

  subscribe<T>(event: string, callback: EventCallback<T>) {
    if (!this.eventCallbacks[event]) {
      this.eventCallbacks[event] = [];
    }
    this.eventCallbacks[event].push(callback);
  }

  unsubscribe<T>(event: string, callback: EventCallback<T>) {
    if (!this.eventCallbacks[event]) return;

    const index = this.eventCallbacks[event].indexOf(callback);
    if (index !== -1) {
      this.eventCallbacks[event].splice(index, 1);
    }
  }

  notifySubscribers<T>(event: string, data: T) {
    if (!this.eventCallbacks[event]) return;

    this.eventCallbacks[event].forEach((callback) => {
      callback(data);
    });
  }
}

const EventListenerSingleton = (() => {
  const instance = new EventListener();
  return instance;
})();

export default EventListenerSingleton;
