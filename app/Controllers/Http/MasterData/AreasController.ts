import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AreasService from 'App/Services/MasterData/AreasServices'


export default class AreasController {
  public async index({}: HttpContextContract) {
    const areas = new AreasService

    return areas.lists()
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const {name, description}= request.all()
    const payload = {
      name:name,
      description:description
    }

    const area= new AreasService
    const store = await area.store(payload)

    if(store.success){
      return response.status(200).json(store)
    }else{
      return response.status(500).json(store)
    }

  }

  public async show({params}: HttpContextContract) {
    const area = new AreasService()
    const record = await area.show(params.id)

    return record;
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response}: HttpContextContract) {
    const {name, description}= request.all()
    const payload = {
      name:name,
      description
    }

    const area = new AreasService
    const record = await area.updated(payload, params.id)

    if(record.success){
      return response.status(record.code).json(record)
    }else{
      return response.status(record.code).json(record)
    }
  }

  public async destroy({params, response}: HttpContextContract) {
    const area = new AreasService
    const record = await area.destroy(params.id)

    if(record.success){
      return response.status(200).json(record)
    }else{
      return response.status(500).json(record)
    }
  }

  public async combo({}:HttpContextContract){
    const area = new AreasService
    return area.combo()
  }
}
