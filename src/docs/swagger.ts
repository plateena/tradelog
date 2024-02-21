import tradelogPaths from './paths/tradelog';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Your API Title',
        version: '1.0.0',
        description: 'Your API Description',
    },
    paths: {
        ...tradelogPaths,
    },
};

export default swaggerDefinition;
