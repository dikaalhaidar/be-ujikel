const jwt = require('jsonwebtoken');
const { response } = require('../helpers/response.formatter');
const { auth_secret } = require('../config/base.config');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json(response(401, "Akses ditolak, token tidak ditemukan"));
    }
    
    try {
        const decoded = jwt.verify(token, auth_secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(response(401, "Token tidak valid"));
    }
};

const guruOnly = (req, res, next) => {
    if (req.user.role !== 'guru') {
        return res.status(403).json(response(403, "Akses hanya untuk guru"));
    }
    next();
};

const siswaOnly = (req, res, next) => {
    if (req.user.role !== 'siswa') {
        return res.status(403).json(response(403, "Akses hanya untuk siswa"));
    }
    next();
};

module.exports = { verifyToken, guruOnly, siswaOnly };