import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Cctv from "App/Models/MasterData/Cctv";

export default class DashboardController {
  async index({ response }: HttpContextContract) {
    const cctv = await Cctv.query().preload("area").orderBy("id", "asc");

    const dataccv: {}[] = [];

    //data rambu
    if (cctv) {
      cctv.forEach(async (element) => {
        const row = {};
        row["id"] = element.id;
        row["position"] = { lat: element.lat, lng: element.lng };
        (row["tooltip"] =
          "<h4>" +
          element.name +
          "</h4><div>" +
          element.address +
          "</div><div>Kondisi : <b>" +
          element.status +
          "</b><br><button onclick='openCamera'>Lihat</button></div>"),
          (row["icon"] = "/images/cctv-icon.png");
        row["draggable"] = false;
        row["visible"] = true;
        row["size"] = [32, 32];
        dataccv.push(row);
      });
    }

    return response.json({
      cctvs: dataccv,
    });
  }
}
