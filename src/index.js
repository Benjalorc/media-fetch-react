import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import Busqueda from './Busqueda';

function App(){
	return <Busqueda />
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);