const express = require('express');
const { urlencoded, json } = require('express');
const router = require('./routes/signos.routes.js');
const cors = require('cors');

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

// Configurar las rutas para signos y autenticación
app.use('/v1/signos', router);


app.listen(4000, () => {
    console.log('Listening at port 4000');
});


