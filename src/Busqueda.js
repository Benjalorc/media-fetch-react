import React, {useRef, useState, useEffect} from 'react';
import './Busqueda.css';

function ResRow({el}){
  return (
    <div className="dato">
      <div className="id"><span>ID: </span> {el.id}</div>
      <div className="name"><span>Nombre: </span> {el.name}</div>
      <div className="service">
        <img src={el.imagen} alt="media_service" />
      </div>
    </div>
  )
}
function Results({media, sendToParent}){

  if(media.data && media.data.length){

    return (
      <div className="col-12 col-lg-10 offset-lg-1">
        <h3>Mostrando resultados de <strong>{media.param}</strong></h3>
        <div className="listado">

          <div className="dato">
            <div className="id">ID</div>
            <div className="name">Nombre</div>
            <div className="service">Servicio</div>
          </div>
          {
            media.data.map((res, i)=>{
              return <ResRow key={`${media.param}-${i}`} el={res} />
            })
          }
        </div>
      </div>
    )
  }
  else if(media.data && !media.data.length){

    if(media.err){
      return(
        <div className="col-12 col-lg-10 offset-lg-1">

            <div className="alert alert-info">
              <h4 className="alert-heading">
                {media.err.title}
                <button type="button" className="btn btn-sm btn-outline-danger float-right" onClick={()=> sendToParent({"data": null, "err": null})}>x</button>
              </h4>
              <hr />
              <p className="mb-0">{media.err.text}</p>
            </div>

        </div>
      )
    }
    else{

      return(
        <div className="col-12 col-lg-10 offset-lg-1">
          <h3>No se encontraron resultados para <strong>{media.param}</strong></h3>
        </div>
      )
    }

  }

  return null;
}

function fetchData(endpoint, nombre){

  return new Promise((resolve, reject)=>{
    fetch(`${endpoint}${nombre}`)
      .then(res => resolve(res.json()) )
      .catch(reject);
  })
}

function Cabecera({endpoint, sendToParent}){

  let entrada = useRef();
  let tiempo = useRef();
  let [loading, setLoading] = useState(false);

  function asignarImagen(arr){

    let images = [
      "/images/debian.png",
      "/images/lubuntu.png",
      "/images/mint.png"
    ];

    let servicios = [];
    for(let i = 0, j = arr.length; i<j; i++){

      let origen = arr[i].origen;
      if(!servicios.find((el)=> el === origen)) servicios.push(origen);

      let index = servicios.findIndex((el)=> el === origen);
      arr[i].imagen = images[index];
    }
  }

  function showHold(val){
    let holdAlert = document.getElementById("holdAlert");
    if(val === true) holdAlert.classList.remove("oculto");
    else holdAlert.classList.add("oculto");
  }
  function cleanTime(tiempo){
    clearTimeout(tiempo.current);
    tiempo.current = null;
  }

  useEffect(()=>{

    if(loading && !tiempo.current){

      tiempo.current = setTimeout(()=>{ showHold(true) }, 3000);

      fetchData(endpoint, entrada.current)
      .then((prom)=>{
        if(loading){
          cleanTime(tiempo)
          showHold(false);
          asignarImagen(prom);
          sendToParent({"data": prom, "param": entrada.current});
          setLoading(false);
        }
      })
      .catch((err)=>{
        cleanTime(tiempo);
        showHold(false);
        setLoading(false);
        sendToParent({
          "data": [],
          "param": entrada.current,
          "err": {
            title: "No se pudo conectar con el API.",
            text: "Verifique su conexión a internet y vuelva a intentar."
          }
        });
      });
    }

  }, [loading, endpoint, sendToParent]);

  function doSearch(e){
    e.preventDefault();
    sendToParent({"data": null, "err": null, "param": ""});
    setLoading(true);
  }

  return (
      <React.Fragment>
        <div className="col-12">

          <div className="tarjeta elevacion">

            <h3 className={`text-center buscando ${(loading ? "cargando" : "")}`}>Buscando resultados...</h3>
            <h3 className="text-center">Realice su búsqueda</h3>
            <form onSubmit={doSearch} className="form-inline">
              <div className="form-group">
                <input type="text" className="form-control form-control-lg" onChange={e => entrada.current = e.target.value } name="nombre" placeholder="Ej: Tobey Maguire" />
              </div>
              <button type="submit" className="btn btn-lg btn-primary">Buscar</button>
            </form>
            <div className="loading"></div>

          </div>
        </div>

        <div id="holdAlert" className="col-12 col-lg-10 offset-lg-1 oculto">
          <div className="alert alert-info">
            <h4 className="alert-heading">Esta consulta pudiera demorar un poco</h4>
            <p className="mb-0">Espere mientras encontramos su búsqueda</p>
            <hr />
            <p className="mb-0">O cancele en cualquier momento y realice una nueva búsqueda</p>
            <button type="button" className="btn btn-danger" onClick={()=>{ setLoading(false); showHold(false); } }>Cancelar</button>
          </div>
        </div>
      </React.Fragment>
  );
}

function Busqueda() {

  let [media, setMedia] = useState({"data": null,"err": null, "param": ""});

  return (
    <div className="container">
      <div className="row">
        <Cabecera endpoint="http://localhost:3000/media/" sendToParent={setMedia} />
        {media.data || media.err ? <Results media={media} sendToParent={setMedia} /> : ""}
      </div>
    </div>
  );
}

export default Busqueda;
