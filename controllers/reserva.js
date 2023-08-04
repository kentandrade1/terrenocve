const { response } = require('express');
const { Reserva, Producto } = require('../models');


const obtenerReservas = async(req, res = response ) => {

    const { } = req.query;
    const query = { estado: true };

    const [ total, reservas ] = await Promise.all([
        Reserva.countDocuments(query),
        Reserva.find(query)
            .populate('usuario', 'nombre')
            .populate('asesor', 'nombre')
            .populate('solar', 'ubicacion caracteristicas largo ancho')
    ]);

    res.json({
        total,
        reservas: reservas
    });
}
const obtenerReservasXusuario = async (req, res = response) => {
    const { id } = req.params; // Obtener el ID de la ruta
  
    const query = {
      estado: true,
      usuario: id // Filtrar por el mismo ID que se proporciona en la ruta
    };
  
    const [total, reservas] = await Promise.all([
      Reserva.countDocuments(query),
      Reserva.find(query)
        .populate('usuario', 'nombre')
        .populate('asesor', 'nombre')
        .populate('solar', 'ubicacion caracteristicas largo ancho')
    ]);
  
    res.json({
      total,
      reservas: reservas
    });
  };
  

const obtenerProducto = async(req, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( producto );

}

const crearReserva = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;
  
    // Generar la data a guardar
    const data = {
      ...body,
      entrada: body.entrada,
      solar: req.body.solar,
      usuario:req.body.usuario,
      asesor:req.body.asesor,// Cambio realizado aquí
    };
  
    const reserva = new Reserva(data);
  
    // Guardar en la base de datos
    const nuevaReserva = await reserva.save();
    await nuevaReserva
      .populate('usuario', 'nombre')
      .populate('asesor', 'nombre')
      .populate('solar', 'ubicacion caracteristicas largo ancho')
      .execPopulate();
  
    res.status(201).json(nuevaReserva);
  };
const actualizarOrden = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;


    data.usuario = req.usuario._id;

    const orden = await Orden.findByIdAndUpdate(id, data, { new: true });
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    await orden
        .populate('usuario', 'nombre')
        .populate('asesor', 'nombre')
        .populate('solar', 'ubicacion caracteristicas largo ancho')
        .execPopulate();
        
    res.json( orden );

}

const borrarOrden = async(req, res = response ) => {

    const { id } = req.params;
    const ordenBorrada = await Orden.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( ordenBorrada );
}




module.exports = {
    crearReserva,
    obtenerReservas,
    obtenerProducto,
    obtenerReservasXusuario,
    actualizarOrden,
    borrarOrden
}