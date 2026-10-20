
const express = require('express');

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: true }));

function responder(req, res, status, dados) {
    const dataHora = new Date().toLocaleString('pt-BR');
    const endpoint = req.originalUrl;
    const saidaJSON = JSON.stringify(dados);

    console.log(`${dataHora} | ${endpoint} | ${saidaJSON}`);

    return res.status(status).json(dados);
}

app.get('/v1/hi', function(req, res) {
    const out = {
        msg: 'Hello, World!'
    };

    responder(req, res, 200, out);
});

app.get('/v1/hi/user/:name', function(req, res) {
    const out = {
        msg: 'Hello, ' + req.params.name
    };

    responder(req, res, 200, out);
});

app.post('/v1/hi', function(req, res) {
    const { name } = req.body;

    if (!name) {
        return responder(req, res, 400, {
            error: 'Name is required'
        });
    }

    const out = {
        msg: `Hello, ${name.toUpperCase()} from POST!`
    };

    responder(req, res, 200, out);
});

const mensagens = {
    'pt-br': 'Olá, Mundo!',
    'es': '¡Hola, Mundo!',
    'en': 'Hello, World!'
};

function obterMensagem(idioma) {
    return mensagens[idioma.toLowerCase()];
}

app.get('/v2/hi/:lang', function(req, res) {
    const idioma = req.params.lang;
    const mensagem = obterMensagem(idioma);

    if (!mensagem) {
        return responder(req, res, 400, {
            error: 'Idioma inválido. Use pt-br, es ou en.'
        });
    }

    const out = {
        msg: mensagem
    };

    responder(req, res, 200, out);
});

app.get('/v2/hi/user/:lang/:name', function(req, res) {
    const idioma = req.params.lang;
    const nome = req.params.name;
    const saudacoes = {
        'pt-br': `Olá, ${nome}!`,
        'es': `¡Hola, ${nome}!`,
        'en': `Hello, ${nome}!`
    };

    const mensagem = saudacoes[idioma.toLowerCase()];

    if (!mensagem) {
        return responder(req, res, 400, {
            error: 'Idioma inválido. Use pt-br, es ou en.'
        });
    }

    responder(req, res, 200, { msg: mensagem });
});

app.post('/v2/hi', function(req, res) {
    const { name, lang } = req.body;

    if (!name || !lang) {
        return responder(req, res, 400, {
            error: 'Nome e Idioma são necessários'
        });
    }

    const idioma = lang.toLowerCase();
    const saudacoes = {
        'pt-br': `Olá, ${name}!`,
        'es': `¡Hola, ${name}!`,
        'en': `Hello, ${name}!`
    };

    const mensagem = saudacoes[idioma];

    if (!mensagem) {
        return responder(req, res, 400, {
            error: 'Idioma inválido. Use pt-br, es ou en.'
        });
    }

    responder(req, res, 200, { msg: mensagem });
});

app.use(function(req, res) {
    responder(req, res, 404, {
        error: 'Invalid endpoint'
    });
});

app.listen(PORT, function() {
    console.log(`Hello API on port ${PORT}`);
});
