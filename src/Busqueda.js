import React, {useState, useEffect} from 'react';
import './Busqueda.css';

function fetchData(nombre){

  return new Promise((resolve, reject)=>{
    let data = null;
    fetch(`http://localhost:3000/media/${nombre}`)
      .then(res => resolve(res.json()) )
      .catch(reject);
  })
}

function Busqueda() {

  let datos_init = {
    "media": {
      "param": "",
      "data": null,
      "err": null
    },
  };
  let [entrada, setEntrada] = useState("");
  let [datos, setDatos] = useState(datos_init);
  let [hold, setHold] = useState(false);
  let [loading, setLoading] = useState(false);

  useEffect(()=>{

    if(datos.media.param){

      fetchData(datos.media.param)
      .then((prom)=>{
        setLoading(false); setHold(false);
        datos.media.data = prom;
      })
      .catch((err)=>{
        console.log(err);
      });      
    }

  }, [datos.media.param]);


  function doSearch(dato){
    setLoading(true);
    datos.media.data = [];
    datos.media.param = dato;
    let tiempo = setTimeout(()=>{
      if(loading) setHold(true);
    },2000);
  }

  return (
    <div className="container">
      <div className="row">

        <div className="col-12">

          <div className="tarjeta elevacion">

            <h3 className={`text-center buscando ${(loading ? "cargando" : "")}`}>Buscando resultados...</h3>
            <h3 className="text-center">Realice su búsqueda</h3>
            <form onSubmit={(event)=>{event.preventDefault(); doSearch(entrada) }} className="form-inline">
              <div className="form-group">
                <input type="text" className="form-control form-control-lg" value={entrada} name="nombre" onChange={(e)=> setEntrada(e.target.value)} placeholder="Ej: Tobey Maguire" />
              </div>
              <button type="submit" className="btn btn-lg btn-primary">Buscar</button>
            </form>
            <div className="loading"></div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Busqueda;
