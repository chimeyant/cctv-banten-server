import { EventEmitter } from "node:events";
import WebSocket, { Server } from "ws";
import { Mpeg1Muxer, MuxerOptions } from "./Mpeg1Muxers";
import CctvService from "../MasterData/CctvService";

interface StreamOptions extends Omit<MuxerOptions, "url"> {
  wsPort?: number;
}

interface WebSocketMeta extends WebSocket.WebSocket {
  id: string;
  liveUrl: string;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
type MpegListener = (...args: Array<unknown>) => void;

function getUrl(url: string): string | null {
  try {
    const parsedUrl: URL = new URL(url, "http://localhost");
    return parsedUrl.searchParams.get("url");
  } catch {
    return null;
  }
}

export class VideoStream extends EventEmitter {
  public liveMuxers: Map<string, Mpeg1Muxer> = new Map<string, Mpeg1Muxer>();

  private wsServer?: Server<WebSocketMeta>;

  private readonly options?: StreamOptions;

  private liveMuxerListeners: Map<string, MpegListener> = new Map<
    string,
    MpegListener
  >();

  public constructor(opt?: StreamOptions) {
    super();
    this.options = opt;

    process.on("beforeExit", () => {
      this.stop();
    });
  }

  public start(): void {
    try {
      this.wsServer = new Server<WebSocketMeta>({
        port: this.options?.wsPort || 9999,
        host: "0.0.0.0",
      });

      this.wsServer.on("connection", async (socket, request) => {
        if (!request.url) {
          return;
        }

        console.log(request.url);

        const newurl = new String(request.url);

        const id = newurl.replace("/play?id=", "");

        console.log(id);

        const cctv = new CctvService();

        const rtsp = await cctv.show(id);

        const rtspurl = "/?url=" + encodeURIComponent(rtsp?.url);

        const liveUrl: string | null = getUrl(rtspurl);

        if (!liveUrl) {
          return;
        }

        //console.info("Socket connected", request.url);

        socket.id = Date.now().toString();
        socket.liveUrl = liveUrl;

        if (this.liveMuxers.has(liveUrl)) {
          const muxer: Mpeg1Muxer | undefined = this.liveMuxers.get(liveUrl);

          if (muxer) {
            const listenerFunc: MpegListener = (data) => {
              socket.send(data);
            };
            muxer.on("mpeg1data", listenerFunc);

            this.liveMuxerListeners.set(
              `${liveUrl}-${socket.id}`,
              listenerFunc
            );
          }
        } else {
          const muxer: Mpeg1Muxer = new Mpeg1Muxer({
            ...this.options,
            url: liveUrl,
          });
          this.liveMuxers.set(liveUrl, muxer);

          muxer.on("liveErr", (errMsg: string | Buffer) => {
            console.info("Error go live", errMsg);

            socket.send(4104);

            // code should be in [4000,4999] ref https://tools.ietf.org/html/rfc6455#section-7.4.2
            socket.close(4104, errMsg);
          });

          const listenerFunc: MpegListener = (data) => {
            socket.send(data);
          };
          muxer.on("mpeg1data", listenerFunc);

          this.liveMuxerListeners.set(`${liveUrl}-${socket.id}`, listenerFunc);
        }

        socket.on("close", () => {
          // console.info("Socket closed");

          if (this.wsServer?.clients.size == 0) {
            if (this.liveMuxers.size > 0) {
              [...this.liveMuxers.values()].forEach((skt) => {
                skt.stop();
              });
            }
            this.liveMuxers = new Map<string, Mpeg1Muxer>();
            this.liveMuxerListeners = new Map<string, MpegListener>();
            return;
          }

          const socketLiveUrl: string = socket.liveUrl;
          const socketId: string = socket.id;

          if (this.liveMuxers.has(socketLiveUrl)) {
            const muxer: Mpeg1Muxer | undefined =
              this.liveMuxers.get(socketLiveUrl);
            if (!muxer) {
              return;
            }
            const listenerFunc: MpegListener | undefined =
              this.liveMuxerListeners.get(`${socketLiveUrl}-${socketId}`);
            if (listenerFunc) {
              muxer.removeListener("mpeg1data", listenerFunc);
            }
            if (muxer.listenerCount("mpeg1data") == 0) {
              muxer.stop();
              this.liveMuxers.delete(socketLiveUrl);
              this.liveMuxers.delete(`${socketLiveUrl}-${socketId}`);
            }
          }
        });
      });

      console.info("Video Stream server started!");
    } catch (error) {
      console.log(error);
    }
  }

  public stop(): void {
    this.wsServer?.close();
    if (this.liveMuxers.size > 0) {
      [...this.liveMuxers.values()].forEach((skt) => {
        skt.stop();
      });
    }
  }
}
