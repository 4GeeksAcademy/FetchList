import React from "react";
import ButtonAdd from "./ButtonAdd";

// Para ocultar BottonAdd
const ButtonAddWrapper = ({ rows, addRow }) => {  
    return rows.some(row => row.visible) ? <ButtonAdd addRow={addRow} /> : null;
  };

  export default ButtonAddWrapper;