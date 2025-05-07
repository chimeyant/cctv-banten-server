import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CctvService from "App/Services/MasterData/CctvService";

export default class CctvsController {
  public async index({}: HttpContextContract) {
    const cctv = new CctvService();

    return cctv.lists();
  }

  public async list({}: HttpContextContract) {
    const cctv = new CctvService();
    return cctv.cctvlist();
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
