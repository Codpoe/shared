type Events = Record<string, Handler[]>;

interface Host {
  [key: string]: any;
  __sharedEvents__: Events;
}

export interface Handler {
  (payload?: any): void;
  (name: string, payload?: any): void;
  __sharedOnce__?: boolean;
}

export default (container?: Record<string, any>) => {
  let host: Host;

  if (typeof container === 'undefined') {
    host = { __sharedEvents__: {} };
  } else {
    container.__sharedEvents__ = {};
    host = container as Host;
  }

  const add = (name: string, handler: Handler) => {
    if (!host.__sharedEvents__[name]) {
      host.__sharedEvents__[name] = [];
    }

    if (host.__sharedEvents__[name].indexOf(handler) < 0) {
      host.__sharedEvents__[name].push(handler);
    }
  };

  const execute = (name: string, ...rest: any[]) => {
    const handlers = host.__sharedEvents__[name];

    if (!handlers) {
      return;
    }

    handlers.slice().forEach((handler, index) => {
      handler(...rest);

      if (handler.__sharedOnce__) {
        handlers.splice(index, 1);
      }
    });
  };

  const fns = {
    on(name: string, handler: Handler) {
      add(name, handler);
    },

    once(name: string, handler: Handler) {
      handler.__sharedOnce__ = true;
      add(name, handler);
    },

    off(name: string, handler: Handler) {
      if (host.__sharedEvents__[name]) {
        host.__sharedEvents__[name].splice(
          host.__sharedEvents__[name].indexOf(handler),
          1,
        );
      }
    },

    emit(name: string, payload?: any) {
      if (host.__sharedEvents__[name]) {
        execute(name, payload);
      }

      if (name.indexOf('__sharedSet__') < 0) {
        execute('*', name, payload);
      }
    },

    set(name: string, value: any) {
      host[name] = value;
      fns.emit(`__sharedSet__${name}`, value);
    },

    get(name: string): Promise<any> {
      return new Promise(resolve => {
        if (name === '*') {
          return resolve(host);
        }

        if (name in host) {
          return resolve(host[name]);
        }

        fns.once(`__sharedSet__${name}`, resolve);
      });
    },
  };

  return fns;
};
