import express, { Application, Request, Response, json, urlencoded } from 'express';

async function startServer() {
  const app: Application = express();

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.get('/', (_req: Request, res: Response) => {
    res.send('Hello PPAC');
  });

  app.listen(3000, () => {
    console.log('Ready to start server');
  });
}

setImmediate(startServer);
