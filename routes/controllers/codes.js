const pool  = require('../../db/mongo');
//const CryptoJS = require('crypto-js');
const moment = require('moment-timezone');

//---------------Validar código promocional---------------------
const validateCredentials = async (req, res) => {
    const { code, userId } = req.body; // Se recibe el código y el ID del usuario desde el frontend
    try {
        // Buscar si el código existe en la base de datos
        const existingCode = await pool.db('promocion').collection('codigos').findOne({ code });

        if (existingCode) {
            // Verificar si el código ya ha sido usado por otro usuario
            if (existingCode.status !== 'libre') {
                return res.status(400).json({ status: "Error", message: "¡Código ya registrado!" });
            }

            // Obtener la fecha y hora actual en formato Bogotá
            const currentDateTime = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

            // Actualizar el código en la base de datos: cambiar el estado a ocupado y asignar el userId y la fecha
            await pool.db('promocion').collection('codigos').updateOne(
                { code }, // Filtro para encontrar el código
                { 
                    $set: { 
                        status: userId, // Cambia el estado a userId para indicar que está ocupado
                        date: currentDateTime // Registra la fecha en la que se usó el código
                    }
                }
            );

            // Responder con el valor del premio
            const prizeValue = existingCode.value;
            let message = "";

            if (prizeValue === 0) {
                message = "No ganaste";
            } else {
                message = `¡Ganaste ${prizeValue}!`;
            }

            return res.status(200).json({ status: "Success", message, prizeValue });

        } else {
            // Si el código no existe
            return res.status(404).json({ status: "Error", message: "Código no válido" });
        }
    } catch (error) {
        console.error('Error fetching code:', error);
        return res.status(500).json({ status: "Error", message: "Error interno del servidor" });
    }
};

module.exports = { validateCredentials };
