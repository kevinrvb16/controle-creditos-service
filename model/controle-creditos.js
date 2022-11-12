const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ControleCreditoschema = new Schema({
    cpf: {
        type: String, 
        required: [true, 'CPF Obrigatório']},
    creditos: {
        type: Number, 
        required: [true, 'Créditos Obrigatório']},
});
// Exportar o modelo
module.exports = mongoose.model('controleCreditos', ControleCreditoschema);