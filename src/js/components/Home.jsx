import React, { useState, useEffect } from "react";
import ButtonAddWrapper from "./ButtonAddWrapper";

const Home = () => {
  const [rows, setRows] = useState([
    { id: 1, visible: true, placeholder: "Hacer la comida", isEditing: true, text: "" },
    { id: 2, visible: true, placeholder: "Hacer la compra", isEditing: true, text: "" },
	  { id: 3, visible: true, placeholder: "Tener una colonia en RimWorld", isEditing: true, text: "" },
	  { id: 4, visible: true, placeholder: "Acabar este proyecto", isEditing: true, text: "" },
  ]);

  useEffect(() => {
    fetch("https://playground.4geeks.com/todo/todos/adrian", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then(resp => resp.json())
      .then(data => console.log("Usuario creado:", data))
      .catch(error => console.error("Error al crear usuario:", error));

      // Cargar las tareas desde la API
    fetch("https://playground.4geeks.com/todo/todos/adrian")
    .then(resp => resp.json())
    .then(data => {
      console.log("Tareas obtenidas:", data);
      setRows(data.map((task) => ({
        id: task.id,
        visible: true,
        placeholder: task.label,
        isEditing: false,
        text: task.label
      })));
    })
    .catch(error => console.error("Error al obtener tareas:", error));
  }, []);

  const handleKeyDown = (index, e) => {
    if (e.key === "Enter") {
      setRows((prev) =>
        prev.map((input, i) =>
          i === index ? { ...input, isEditing: false } : input
        )
      );
    }
  };

  const handleTextChange = (index, e) => {
    setRows((prev) =>
      prev.map((input, i) =>
        i === index ? { ...input, text: e.target.value } : input
      )
    );
  };


  //estado para el botón al pasar el cursor
  const [hoveredRowId, setHoveredRowId] = useState(null);
  
  const rowDelete = (id) => {
    // Ocultar la tarea visualmente primero
    setRows(rows.map(row => 
      row.id === id ? { ...row, visible: false } : row
    ));
  
    // Luego eliminar en la API. ${id} valor de una variable dentro de un string
    fetch(`https://playground.4geeks.com/todo/todos/adrian/${id}`, {
      method: "DELETE"
    })
      .then(resp => {
        if (!resp.ok) throw new Error("No se pudo eliminar la tarea");
        console.log("Tarea eliminada:", id);
      })
      .catch(error => console.error("Error al eliminar tarea:", error));
  };

  //Crear un nuevo objeto. Date.now genera un identificador único
  const addRow = () => {
    const newTodo = { label: "Nueva tarea", done: false };
  
    fetch("https://playground.4geeks.com/todo/todos/adrian", {
      method: "POST",
      body: JSON.stringify(newTodo),
      headers: { "Content-Type": "application/json" }
    })
      .then(resp => resp.json())
      .then(data => {
        console.log("Tarea agregada:", data);
        const newRow = { id: Date.now(), visible: true, placeholder: "Nueva tarea", isEditing: true };
        setRows([...rows, newRow]);
      })
      .catch(error => console.error("Error al agregar tarea:", error));
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="d-flex flex-wrap justify-content-center align-content-center col-6 m-4">
        <h1 className="text-center mt-5 col-12">Tareas pendientes</h1>
        <div className="w-100">
          {rows.some(row => row.visible) ? (      //método .some() para ver si se cumple al menos 1 vez la condición
            rows.map((row, index) =>
              row.visible && (
                <div key={row.id} className="text-center input-group my-2" 
                  onMouseEnter={() => setHoveredRowId(row.id)}
                  onMouseLeave={() => setHoveredRowId(null)}>
                    {row.isEditing ? (
                  <input type="text"
                    className="form-control"
                    placeholder={row.placeholder}
                    aria-label={row.placeholder}
                    aria-describedby="basic-addon2"
                    onChange={(e) => handleTextChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoFocus
                    />
                  ) : (
                    <p className="form-control">{row.text}</p>
                  )}
                  {hoveredRowId === row.id &&
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary btn-danger text-white" 
                        type="button" 
                        onClick={() => rowDelete(row.id)}>
                        x
                      </button>
                    </div>
                  }
                </div>
              )
            )
          ) : (
            <button onClick={addRow} 
                    className="btn btn-primary mt-2">No hay tareas, añadir tareas.</button>
          )}
          <ButtonAddWrapper addRow={addRow} rows={rows} />
        </div>
      </div>
    </div>
  );
}

export default Home;