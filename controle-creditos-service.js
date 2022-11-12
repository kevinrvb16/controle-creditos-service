const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Servidor
let porta = 8092;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});

const ControleCreditos = require('./model/controle-creditos');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/";
const dataBaseDB = "MinhaLOjaDB";
const collectionDB = "controleCreditos";
let db = null;

MongoClient.connect(uri, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        console.log('Erro ao conectar no banco de dados ' + dataBaseDB + '!');
        throw error;
    }
    db = client.db(dataBaseDB).collection(collectionDB);
    console.log('Conectado a base de dados: ' + dataBaseDB + '!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Retorna todos os controles de créditos
app.get('/ControleCreditos', (req, res) => {
    db.find({}).toArray((err, result) => {
        if (err) return console.log("Error: " + err);
        res.send(result);
    });
});

// Retorna o controle de créditos de um determinado cpf
app.get('/ControleCreditos/:cpf', (req, res) => {
    db.findOne({ "cpf": req.params.cpf }, (err, result) => {
        if (err) return console.log("Controle de créditos não encontrado")
    });
    res.send(result);
});

// Cria um novo controle de créditos
app.post('/ControleCreditos', (req, res) => {
    const controleCreditos = new ControleCreditos({
        "cpf": req.body.cpf,
        "creditos": req.body.creditos,
    });
    db.insertOne(controleCreditos, (err, result) => {
        if (err) return console.log("Error: " + err);
        res.send('Controle de vagas cadastrado com sucesso no BD!');
    });
});

// Atualiza o controle de créditos de um determinado cpf
app.put('/ControleCreditos/:cpf', (req, res) => {
    db.updateOne({"cpf": req.params.cpf }, {
        $set: {
            "creditos": req.body.creditos,
        }
    }, (err, result) => {
        if (err) return console.log("Error: " + err);
        res.send('Controle de créditos atualizado com sucesso no BD!');
    });
});

// Remove o controle de créditos de um determinado cpf
app.delete('/ControleCreditos/:cpf', (req, res) => {
    db.deleteOne({cpf: req.params.cpf },(err, result) => {
        if (err) return console.log("Error: " + err);
        res.send('Controle de créditos removido do BD!');
    });
});