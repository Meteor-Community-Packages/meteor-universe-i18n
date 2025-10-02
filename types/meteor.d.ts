/// <reference types="meteor" />

declare module 'meteor/meteor' {
  namespace Meteor {
    interface Connection {
      id: string;
      close: () => void;
      onClose: (callback: () => void) => void;
      clientAddress: string;
      httpHeaders: Record<string, string>;
    }

    interface MethodThisType {
      connection: Connection | null;
      userId: string | null;
      setUserId(userId: string | null): void;
      isSimulation: boolean;
      unblock(): void;
    }

    interface SubscriptionHandle {
      stop(): void;
      ready(): void;
      error(error: Error): void;
      connection: Connection;
      userId: string | null;
    }

    interface PublishThisType {
      connection: Connection;
      userId: string | null;
      added(collection: string, id: string, fields: Record<string, any>): void;
      changed(collection: string, id: string, fields: Record<string, any>): void;
      removed(collection: string, id: string): void;
      ready(): void;
      onStop(callback: () => void): void;
      error(error: Error): void;
      stop(): void;
    }

    function onConnection(callback: (connection: Connection) => void): void;
  }
}

export {};
