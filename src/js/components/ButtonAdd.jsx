import React from "react";

const ButtonAdd = ({ addRow }) => {
    return (
      <button onClick={addRow} className="btn btn-primary mt-2">
        Añadir tarea
      </button>
    );
  };
  

export default ButtonAdd;