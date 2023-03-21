
const bcrypt = require('bcryptjs')
const { response } = require('express')
const { generarJWT } = require('../helpers/jwt')
const Evento = require('../models/Evento')

const getEventos = async(req, res = response) => {

  const eventos = await Evento.find().populate('user', 'name')

  try{
    res.json({
      ok: true,
      eventos
    })
  }catch(error){

  }
}

const crearEvento = async(req, res = response) => {

  const evento = new Evento(req.body)
  try {
    evento.user = req.uid
    const eventoGuardado = await evento.save()
    res.json({
      ok: true,
      evento: eventoGuardado
    })
  }catch(error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const actualizarEvento = async(req, res = response) => {
  const eventoId = req.params.id
  const uid = req.uid
  try{
    const evento = await Evento.findById(eventoId)
    if ( !evento ){
      return res.status(404).json({
        ok: false,
        msg: 'No existe el evento'
      })
    }

    if(evento.user.toString() !== uid ){
      return res.status(401).json({
        ok: false,
        msg: 'No tiene permisos para editar'
      })
    }

    const nuevoEvento = {
      ...req.body,
      user: uid
    }


    const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})

    res.json({
      ok: true,
      evento: eventoActualizado
    })


  }catch(error){
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
 }
}

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id
  const uid = req.uid
  try{
    const evento = await Evento.findById(eventoId)
    if ( !evento ){
      return res.status(404).json({
        ok: false,
        msg: 'No existe el evento'
      })
    }

    if(evento.user.toString() !== uid ){
      return res.status(401).json({
        ok: false,
        msg: 'No tiene permisos para eliminar'
      })
    }



    const eliminado = await Evento.findByIdAndDelete(eventoId)

    res.json({
      ok: true,
      evento: eliminado
    })


  }catch(error){
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
 }
}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}