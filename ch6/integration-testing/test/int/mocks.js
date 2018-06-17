import * as sinon from 'sinon';
import * as utils from '../../src/utils';

sinon.stub(utils, 'uuidv4')
  .returns('00000000-0000-0000-0000-000000000000');
