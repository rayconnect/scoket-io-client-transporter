import { io } from "socket.io-client";

import { Socket } from "socket.io-client";
import { useRayconnectRealtimeEvent } from "@rayconnect/realtime/src/core/event";
import { TRANSFORM } from "@rayconnect/realtime/src/core/transform";
import { RayconnectRealtimeEventSubscribtion } from "@rayconnect/types/event";
import {
  RayconnectRealtimeTransporter,
  RayconnectRealtimeTransporterPublishParam,
} from "@rayconnect/types/transporter";

export class RayconnectRealtimeTransporterSocketIOClientAbstract extends RayconnectRealtimeTransporter<RayconnectRealtimeTransporterSocketIOClientContext> {
  constructor(context: RayconnectRealtimeTransporterSocketIOClientContext) {
    super(context);
  }

  subscribe<NEXT_DATA = any, ERROR_DATA = any>(
    event: string,
    subscription: RayconnectRealtimeEventSubscribtion<NEXT_DATA, ERROR_DATA>
  ): void {
    if (subscription.start) subscription.start();

    this.context.socket.on(event, (data) => {
      const json = TRANSFORM.parse(data);
      useRayconnectRealtimeEvent(json, subscription, this.context.socket);
    });
  }

  publish<DATA_TYPE = any>(
    param: RayconnectRealtimeTransporterPublishParam<DATA_TYPE>
  ): void {
    this.context.socket.emit(param.event, TRANSFORM.convert(param));
  }
}

export interface RayconnectRealtimeTransporterSocketIOClientContext {
  socket: Socket;
}

export const RayconnectRealtimeTransporterSocketIOClient = (
  config: RayconnectRealtimeTransporterSocketIOClientConfig
) => {
  const socket = io(config.uri);

  return new RayconnectRealtimeTransporterSocketIOClientAbstract({
    socket: socket,
  });
};

export interface RayconnectRealtimeTransporterSocketIOClientConfig {
  uri: string;
}
