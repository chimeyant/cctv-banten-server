import Area from "App/Models/MasterData/Area";

interface AreaInterface {
  name:"",
  description:""
}

class AreasService{
  /**
   *
   * @returns datas;
   */
  async lists(){
    const records = await Area.query().orderBy("name", 'asc')

    const datas:{}[]=[]

    records.forEach(element => {
      const row ={}
      row['id']= element.uuid;
      row['name'] = element.name
      row['description']= element.description
      datas.push(row)
    });

    return datas;
  }

  /**
   * Store Function
   * @param payload
   * @returns
   */

  async store(payload:AreaInterface){
    try {
      const record = new Area
      record.name = payload.name
      record.description = payload.description
      await record.save()

      return{
        success:true,
        response:{
          message:"Proses tambah data berhasil",
          data: record
        },
        error:false
      }
    } catch (error) {
      return {
        success:false,
        response:{
          message:"Opps..., terjadi kesalahan",
          data:{}
        },
        error:error
      }
    }
  }

  /**
   * Show Data
   * @param id
   * @returns record
   */
  async show(id:string){
    try {
      const record = await Area.findBy('uuid',id)
      return record?.record
    } catch (error) {
    }
  }

  /**
   * Update Data
   * @param payload
   * @param id
   * @returns record
   */

  async updated(payload:{name:string, description:string}, id:string){
    try {
      const record = await Area.findBy("uuid",id)
      record?.merge({name:payload.name,description:payload.description })

      await record?.save()

      return{
        code:200,
        success:true,
        response:{
          message:"Proses ubah data berhasil",
          data: record?.display
        }
      }

    } catch (error) {
      return{
        code:500,
        success:false,
        response:{
          message:"Opps..., terjadi kesalahan ",
          data:{}
        },
        error:error
      }
    }
  }



  /**
   * destroy function
   * @param id
   * @returns
   */

  async destroy(id:string){
    try {
      const record = await Area.findBy("uuid", id)
      await record?.delete()

      return {
        code:200,
        success:true,
        response:{
          message:"Proses hapus data berhasil...!",
          data:{
            id:id
          }
        },
        error:[]
      }
    } catch (error) {
      return {
        code :500,
        success:false,
        response:{
          message:"Opps..., terjadi kesalahan..!",
          data:{id:null}
        },
        error:error
      }
    }
  }

  async combo(){
    const areas = await Area.query().orderBy("name",'asc')

    const datas:{}[]=[]

    areas.forEach(element => {
      const row ={}
      row['value']= element.uuid
      row['text']= element.name
      datas.push(row)
    });

    return datas;
  }


}

export default AreasService;
