import Area from "App/Models/MasterData/Area";
import Cctv from "App/Models/MasterData/Cctv";

interface CctvInterface {
  area_uuid: "";
  name: "";
  description: "";
  contact_person: "";
  phone: "";
  url: "";
  address: "";
  lat: "";
  lng: "";
  public_access: false;
  foto: "";
  status: "";
}

class CctvService {
  async lists() {
    const records = await Cctv.query()
      .preload("area")
      .orderBy("area_uuid", "asc");

    const datas: {}[] = [];
    records.forEach((element) => {
      const row = {};
      row["id"] = element.uuid;
      row["area"] = element.area.name;
      row["name"] = element.name;
      row["address"] = element.address;
      row["url"] = element.url;
      row["public_access"] = element.publicAccess
        ? { color: "green", text: "AKTIF" }
        : { color: "red", text: "TIDAK AKTIF" };
      datas.push(row);
    });

    return datas;
  }

  async cctvlist() {
    const records = await Area.query().preload("cctvs").orderBy("id", "asc");

    const datas: {}[] = [];
    const cctvs: {}[] = [];

    records.forEach((element) => {
      const row = {};
      row["uuid"] = element.uuid;
      row["area"] = element.name;
      element.cctvs.forEach((item) => {
        const cctv = {};
        cctv["id"] = item.uuid;
        cctv["name"] = item.name;
        cctv["address"] = item.address;
        cctvs.push(cctv);
      });
      row["cctvs"] = cctvs;

      datas.push(row);
    });

    return datas;
  }

  async store(payload: CctvInterface) {
    try {
      const model = new Cctv();
      model.areaUuid = payload.area_uuid;
      model.name = payload.name;
      model.description = payload.description;
      model.contactPerson = payload.contact_person;
      model.phone = payload.phone;
      model.url = payload.url;
      model.address = payload.address;
      model.lat = payload.lat;
      model.lng = payload.lng;
      model.publicAccess = payload.public_access;
      model.foto = payload.foto;
      model.status = payload.status;
      await model.save();

      const area = await Area.findBy("uuid", payload.area_uuid);

      return {
        code: 200,
        success: true,
        response: {
          message: "Proses tambah cctv berhasil...!",
          data: {
            id: model.uuid,
            name: model.name,
            area: area?.name,
            address: model.address,
            url: model.url,
          },
        },
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        response: {
          message: "Opps..., terjadi kesalahan",
          data: {},
        },
        error: error,
      };
    }
  }

  async show(id: string) {
    const model = await Cctv.findBy("uuid", id);

    return model?.datarecord;
  }

  async update(payload: CctvInterface, id: string) {
    try {
      const model = await Cctv.findBy("uuid", id);
      model?.merge({
        areaUuid: payload.area_uuid,
        name: payload.name,
        description: payload.description,
        contactPerson: payload.contact_person,
        phone: payload.phone,
        url: payload.url,
        address: payload.address,
        lat: payload.lat,
        lng: payload.lng,
        publicAccess: payload.public_access,
        foto: payload.foto,
        status: payload.status,
      });

      await model?.save();

      const area = await Area.findBy("uuid", model?.areaUuid);

      return {
        code: 300,
        success: true,
        response: {
          message: "Proses ubah data berhasil...!",
          data: {
            id: model?.uuid,
            name: model?.name,
            description: model?.description,
            area: area?.name,
          },
        },
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        response: {
          message: "Opps..., terjadi kesalahan ",
          data: {},
        },
        error: error,
      };
    }
  }

  async delete(id: string) {
    try {
      const model = await Cctv.findBy("uuid", id);
      await model?.delete();

      return {
        code: 200,
        success: true,
        response: {
          message: "Proses hapus data berhasil...!",
          data: { id: id },
        },
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        response: {
          message: "Opps..., terjadi kesalahan",
        },
        error: error,
      };
    }
  }
}

export default CctvService;
