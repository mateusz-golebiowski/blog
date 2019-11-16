import express from 'express';

import api from './api';


const app = express();

const port = process.env.PORT || 4000;

app.use('/api/v1', api);

app.listen(port, () => {

});

export default  app;