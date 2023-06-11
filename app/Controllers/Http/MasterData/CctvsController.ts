import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CctvService from 'App/Services/MasterData/CctvService';


export default class CctvsController {
  public async index({}: HttpContextContract) {
    const cctv = new CctvService

    return cctv.lists()
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const payload = request.only(['area_uuid', 'name','description','contact_person','phone','url','address','lat','lng','public_access','foto','status'])
    const cctv = new CctvService
    const result =await cctv.store(payload)

    if(result.success){
      return response.status(200).json(result)
    }else{
      return response.status(result.code).json(result)
    }

  }

  public async show({params}: HttpContextContract) {
    const cctv = new CctvService
    const result = await cctv.show(params.id)
    return result;
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request}: HttpContextContract) {
    const cctv = new CctvService
    const payload = request.only(['area_uuid', 'name','description','contact_person','phone','url','address','lat','lng','public_access','foto','status'])

    return cctv.update(payload, params.id)
  }

  public async destroy({params}: HttpContextContract) {
    const cctv = new CctvService
    return cctv.delete(params.id)
  }
}
