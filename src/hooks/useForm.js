import { useState } from 'react';

export const useForm = (initialState = {}) => {
    const [values, setValues] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Esta forma de actualizar asegura que no se pierdan caracteres al escribir rápido
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    // Agregamos una función para resetear el formulario si hace falta
    const reset = () => {
        setValues(initialState);
    };

    return [values, handleChange, reset];
};