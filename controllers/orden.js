const { response } = require('express');
const { Orden, Producto } = require('../models');


const obtenerOrdenes = async(req, res = response ) => {

    const { } = req.query;
    const query = { estado: true };

    const [ total, ordenes ] = await Promise.all([
        Orden.countDocuments(query),
        Orden.find(query)
            .populate('usuario', 'nombre')
            .populate('solar', 'ubicacion solare manzana etapa caracteristicas largo ancho')

    ]);

    res.json({
        total,
        ordenes: ordenes
    });
}

const obtenerOrdenesXusuario = async (req, res = response) => {
    const { id } = req.params; // Obtener el ID de la ruta
  
    const query = {
      estado: true,
      usuario: id // Filtrar por el mismo ID que se proporciona en la ruta
    };
  
    const [total, ordenes] = await Promise.all([
      Orden.countDocuments(query),
      Orden.find(query)
        .populate('usuario', 'nombre')
        .populate('solar', 'ubicacion solare manzana etapa caracteristicas largo ancho')
    ]);
  
    res.json({
      total,
      ordenes: ordenes
    });
  };
  

const obtenerProducto = async(req, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( producto );

}

const crearOrden = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;
  
    // Generar la data a guardar
    const data = {
      ...body,
      entrada: body.entrada,
      solar: req.body.solar,
      usuario:req.usuario._id// Cambio realizado aquí
    };
  
    const orden = new Orden(data);
  
    // Guardar en la base de datos
    const nuevaOrden = await orden.save();
    await nuevaOrden
      .populate('usuario', 'nombre')
      .populate('solar', 'ubicacion solare manzana etapa caracteristicas largo ancho')
      .execPopulate();
  
    res.status(201).json(nuevaOrden);
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
        .populate('solar', 'ubicacion solare manzana etapa caracteristicas largo ancho')
        .execPopulate();
        
    res.json( orden );

}

const borrarOrden = async(req, res = response ) => {

    const { id } = req.params;
    const ordenBorrada = await Orden.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( ordenBorrada );
}




module.exports = {
    crearOrden,
    obtenerOrdenes,
    obtenerProducto,
    obtenerOrdenesXusuario,
    actualizarOrden,
    borrarOrden
}