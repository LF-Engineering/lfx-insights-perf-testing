import { NextFunction, Request, Response, Router } from 'express';
import axios from 'axios';

class DummyRouterClass {
  public router: Router;
  constructor() {
    this.initRouter();
  }
  private initRouter() {
    this.router = Router();
    this.router.get('/crocodiles', this.getCrocodiles);
    this.router.get('/todos', this.getTodos);
  }
  private getCrocodiles = async (request: Request, response: Response, _next: NextFunction) => {
    try {
      const responseData = await axios.get('https://test-api.k6.io/public/crocodiles/');
      return response.status(200).send(responseData.data);
    } catch (e) {
      return response.status(400).send(e);
    }
  };
  private getTodos = async (request: Request, response: Response, _next: NextFunction) => {
    try {
      const responseData = await axios.get('https://jsonplaceholder.typicode.com/todos/');
      return response.status(200).send(responseData.data);
    } catch (e) {
      return response.status(400).send(e);
    }
  };
}

export const dummyRouter = new DummyRouterClass();

