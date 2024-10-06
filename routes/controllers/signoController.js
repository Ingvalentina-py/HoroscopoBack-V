const fs = require('fs/promises');
const path = require('path');

// Obtener todos los signos
const getAllSignos = async (req, res) => {
    const signo = await fs.readFile(path.join(__dirname, '../../db/signos.json'));
    const signosJson = JSON.parse(signo);
    res.json(signosJson);
}

// Obtener un signo específico
const getOneSigno = async (req, res) => {
    const oneSigno = req.params.signo;
    const allSignos = await fs.readFile(path.join(__dirname, '../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);
    const result = objSignos[oneSigno];
    res.json(result);
}

// Actualizar un signo
const updateSigno = async (req, res) => {
    const signoEditar = req.params.signoEditar;
    const { textoEditar } = req.body;
    const allSignos = await fs.readFile(path.join(__dirname, '../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);

    const objUpdate = {
        ...objSignos,
        [signoEditar]: textoEditar
    }

    await fs.writeFile(path.join(__dirname, '../../db/signos.json'), JSON.stringify(objUpdate, null, 2), { encoding: 'utf-8' });

    res.json({
        message: "Updated"
    });
}

// Controlador para manejar la autenticación
const login = async (req, res) => {
    const credencialesFilePath = path.join(__dirname, '../../db/credenciales.json');
    const { username, password } = req.body;

    const data = await fs.readFile(credencialesFilePath, 'utf-8');
    const users = JSON.parse(data).users;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        return res.json({ role: username });
    } else {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }
};

// Cambiar contraseña de usuario
const changePassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const credencialesFilePath = path.join(__dirname, '../../db/credenciales.json');

    try {
        // Leer el archivo de credenciales
        const data = await fs.readFile(credencialesFilePath, 'utf-8');
        const credenciales = JSON.parse(data);

        // Buscar el usuario
        const userIndex = credenciales.users.findIndex(user => user.username === username && user.password === oldPassword);

        if (userIndex === -1) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Actualizar la contraseña
        credenciales.users[userIndex].password = newPassword;

        // Guardar el archivo actualizado
        await fs.writeFile(credencialesFilePath, JSON.stringify(credenciales, null, 2), { encoding: 'utf-8' });

        res.json({ message: 'Contraseña cambiada con éxito.' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ error: 'Error al cambiar la contraseña.' });
    }
}

const createUser = async (req, res) => {
    const { username, password } = req.body;
    const credencialesFilePath = path.join(__dirname, '../../db/credenciales.json');

    try {
        const data = await fs.readFile(credencialesFilePath, 'utf-8');
        const credenciales = JSON.parse(data);

        // Verificar si el usuario ya existe
        const existingUser = credenciales.users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe.' });
        }

        // Agregar nuevo usuario
        credenciales.users.push({ username, password });
        
        // Guardar el archivo actualizado
        await fs.writeFile(credencialesFilePath, JSON.stringify(credenciales, null, 2), { encoding: 'utf-8' });

        res.status(201).json({ message: 'Usuario creado con éxito.' });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario.' });
    }
};

module.exports = {
    getAllSignos,
    getOneSigno,
    updateSigno,
    login,
    changePassword,
    createUser // Exportar la nueva función
}
