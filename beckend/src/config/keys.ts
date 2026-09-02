//"mongodb://localhost:27017/tec2Center"

import serverConfig from './server.config';

const keys = {
  mongoURI: serverConfig.mongoUri,
  jwt: serverConfig.jwtSecret,
};

export default keys;
