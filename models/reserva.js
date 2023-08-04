const { Schema, model } = require('mongoose');

const ReservaSchema = Schema({

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
    asesor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    solar: {
        type: Schema.Types.ObjectId,
        ref: 'Solares',
        required: true
    },
    meses: {
        type: Number,
        default: 0
    },

    fechaIngreso: {
        type: Date,
        default: Date.now
    }
});


ReservaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Reserva', ReservaSchema );
