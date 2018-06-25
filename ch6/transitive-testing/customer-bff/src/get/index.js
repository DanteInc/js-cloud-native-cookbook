import { response200, response404, response500 } from '../utils';
import Connector from '../connector/db';

export class Handler {
  constructor(tableName) {
    this.connector = new Connector(tableName);
  }

  handle(request) {
    const { id } = request.pathParameters;
    return this.connector.getById(id);
  }
}

export const handle = (request, context, cb) => {
  new Handler(process.env.TABLE_NAME)
    .handle(request)
    .then(data => (data ?
      response200(cb, data) :
      response404(cb)))
    .catch(response500(cb));
};
