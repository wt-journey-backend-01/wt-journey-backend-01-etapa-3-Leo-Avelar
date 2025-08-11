require('dotenv').config();

const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000;

const setupSwagger = require('./docs/swagger');
const errorHandler = require('./utils/errorHandler');

const agentesRouter = require("./routes/agentesRoutes");
const casosRouter = require("./routes/casosRoutes");

app.use(express.json());

app.use('/agentes', agentesRouter);
app.use('/casos', casosRouter);

setupSwagger(app);
app.use(errorHandler.errorHandler);

app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada. Verifique as rotas disponiveis em /docs' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});