const { Schema, model } = require('mongoose');

const SolaresSchema = Schema({
    ubicacion: {
        type: String,
        required: [true, 'La ubicación es obligatoria'],
    },
    etapa: {
        type: String,
        required: [true, 'La etapa es obligatoria'],
    },
    manzana: {
        type: String,
        required: [true, 'La manzana es obligatoria'],
    },
    solare: {
        type: String,
        required: [true, 'el solar es obligatoria'],
    },
    
    ancho: {
        type: Number,
        required: [true, 'El ancho es obligatorio']
    },
    largo: {
        type: Number,
        required: [true, 'El largo es obligatorio']
    },
    caracteristicas: {
        type: String,
        default:'',
    },
    estadoR: {
        type: String,
        required: true,
        
        emun: ['disponible', 'en proceso','reservado']
    },
    precio: {
        type: Number,
        default: 0
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


SolaresSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Solares', SolaresSchema );
