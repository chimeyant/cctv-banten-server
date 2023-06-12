import Cctv from "App/Models/MasterData/Cctv";


class HomeService {
  async cctvlist(){
    const model = await Cctv.query().orderBy("id",'asc')

    const datas:{}[]=[]

    model.forEach(element => {
      const row={}
      row['id']= element.id
      row['name']= element.name
      row['address']= element.address
      row['position']= {lat: element.lat, lng: element.lng}
      row['tooltip']= "<h4>" + element.name + "</h4><div>"+ element.address +"</div><div>Kondisi : <b>"+ element.status +"</b>",
      row['icon']= "/images/cctv-icon.png"
      row['rstp']= element.url
      row['draggable']= false
      row['visible']= true
      row['size']= [32,32]
      row['status']= element.status == 'baik' ? {color:'green', text:'Online'}:{color:"red",text:"Offline"}
      datas.push(row)
    });

    return datas;
  }
}

export default HomeService
