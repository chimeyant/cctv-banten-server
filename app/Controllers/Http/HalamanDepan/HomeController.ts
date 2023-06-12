import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HomeService from 'App/Services/Home/HomeService'


export default class HomeController {
  public async index({}: HttpContextContract) {
    const homeservice = new HomeService

    return homeservice.cctvlist()

    } catch (error) {
      return []
    }


  }
}
