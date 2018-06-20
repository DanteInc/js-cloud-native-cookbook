import { response201, response500, uuidv4 } from '../utils';
import Connector from '../connector/db';

export class Handler {
  constructor(tableName) {
    this.connector = new Connector(tableName);
  }

  handle(request) {
    const thing = JSON.parse(request.body);
    const id = thing.id || uuidv4();
    const location = `https://${request.headers.Host}/${request.requestContext.stage}/things/${id}`;

    return this.connector.save(id, thing)
      .then(() => location);
  }
}

export const handle = (request, context, cb) => {
  new Handler(process.env.TABLE_NAME)
    .handle(request)
    .then(response201(cb))
    .catch(response500(cb));
};
