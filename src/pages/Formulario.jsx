import { useState } from "react"
function Formulario(){
    const [formData, setFormData] = useState({
        nombre:'',
        email:'',
        direccion:'',
        password:'',
    })

    return(
        <main>
            <h2>Formulario de Registro</h2>
            <form action="">
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" name="nombre" id="nombre" />

                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" />

                <label htmlFor="direccion">Direccion:</label>
                <input type="direccion" name="direccion" id="direccion" />

                <label htmlFor="password">Contraseña:</label>
                <input type="password" name="password" id="password" />

                <input type="submit" value="Enviar" />
            </form>
        </main>
    )
}
export default Formulario;