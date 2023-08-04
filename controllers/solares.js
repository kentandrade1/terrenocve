const { response } = require('express');
const { Solares } = require('../models');

const obtenerSolares = async (req, res = response) => {

    const query = { estado: true };

    try {
        const [total, solares] = await Promise.all([
            Solares.countDocuments(query),
            Solares.find(query)
                .populate('usuario', 'nombre')
        ]);

        res.json({
            total,
            solares // Utilizar la variable "solares" obtenida de la consulta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener los solares'
        });
    }
}


const obtenerSolar = async (req, res = response) => {
    const { id } = req.params;

    try {
        const solar = await Solares.findById(id).populate('usuario', 'nombre');

        if (!solar) {
            return res.status(404).json({
                msg: 'No se encontró ningún solar con el ID proporcionado'
            });
        }

        res.json(solar);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener el solar'
        });
    }
}
const crearSolar = async (req, res = response) => {
    const { ubicacion, manzana, etapa, solare, ancho, largo, caracteristicas, precio, estadoR } = req.body;

    const data = {
        ubicacion,
        manzana,
        etapa,
        solare,
        ancho,
        largo,
        estadoR,
        caracteristicas,
        precio,
        usuario: req.usuario._id
    };

    try {
        // Verificar si existe un registro con los mismos valores en solare, ubicacion, manzana y etapa
        const existingSolar = await Solares.findOne({
            $and: [{ solare }, { ubicacion }, { manzana }, { etapa }]
        });

        if (existingSolar) {
            return res.status(400).json({ msg: 'Ya existe un solar con los mismos valores en solare, ubicacion, manzana y etapa' });
        }

        // Si no existe, crear el nuevo solar
        const solar = new Solares(data);
        await solar.save();
        await solar.populate('usuario', 'nombre').execPopulate();

        res.status(201).json(solar);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrió un error al crear el solar'
        });
    }
};


const actualizarSolar = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.usuario = req.usuario._id;

    try {
        // Verificar si existe un registro con los mismos valores en solare, ubicacion, manzana y etapa
        const existingSolar = await Solares.findOne({
            _id: { $ne: id }, // Excluir el documento actual de la búsqueda
            $and: [{ solare: data.solare }, { ubicacion: data.ubicacion }, { manzana: data.manzana }, { etapa: data.etapa }]
        });

        if (existingSolar) {
            return res.status(400).json({ msg: 'Ya existe un solar con los mismos valores en solare, ubicacion, manzana y etapa' });
        }

        const solar = await Solares.findByIdAndUpdate(id, data, { new: true });

        if (!solar) {
            return res.status(404).json({
                msg: 'No se encontró ningún solar con el ID proporcionado'
            });
        }

        await solar.populate('usuario', 'nombre').execPopulate();
        res.json(solar);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrió un error al actualizar el solar'
        });
    }
};


const borrarSolar = async (req, res = response) => {
    const { id } = req.params;

    try {
        const solarBorrado = await Solares.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!solarBorrado) {
            return res.status(404).json({
                msg: 'No se encontró ningún solar con el ID proporcionado'
            });
        }

        res.json(solarBorrado);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Ocurrió un error al borrar el solar'
        });
    }
}




module.exports = {
    crearSolar,
    obtenerSolares,
    obtenerSolar,
    actualizarSolar,
    borrarSolar
}