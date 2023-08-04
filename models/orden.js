const { Schema, model } = require('mongoose');

const OrdenSchema = Schema({

    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    entrada: {
        type: Number,
        default: 0
    },
    meses: {
        type: Number,
        default: 0
    },
    solar: {
        type: Schema.Types.ObjectId,
        ref: 'Solares',
        required: true
    },
    

    imgPago: { type: String,default:''},
    fechaIngreso: {
        type: Date,
        default: Date.now
    }
});


OrdenSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Orden', OrdenSchema );
