import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createServer, Server } from 'http';
import logger from 'morgan';
import { cubeRouter } from '@routes/CubeRouter';
import { sfRouter } from '@routes/SnowFlakeRouter';
import { dummyRouter } from '@routes/DummyRouter';

export class MockApiServer {
  public static readonly DELAYMS: number = 0;
  public static readonly PORT: number = 3004;
  private app: express.Application;
  private delayMs: string | number;
  private port: string | number;
  private server: Server;

  constructor() {
    this.createApp();
    this.config();
    this.middleware();
    this.createServer();
    this.restRoutes();
    this.listen();
  }

  public getApp(): express.Application {
    return this.app;
  }

  private config() {
    this.port = process.env.PORT || MockApiServer.PORT;
    this.delayMs = process.env.DELAYMS || MockApiServer.DELAYMS;
  }

  private createApp() {
    this.app = express();
  }

  private createServer() {
    this.app.set("port", this.port);
    this.server = createServer(this.app);
  }

  private listen() {
    this.server.listen(this.port);
    console.log(`Mock API server started on :${this.port}`);
  }

  private middleware() {
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.options("*", cors());
    this.app.use((_req, _res, next) => {
      return setTimeout(next, parseInt(this.delayMs as string, 0));
    });
  }

  private restRoutes() {
    this.app.use('/api/cube/', cubeRouter.router);
    this.app.use('/api/sf/', sfRouter.router);
    this.app.use('/api/dummy/', dummyRouter.router);
  }
}
