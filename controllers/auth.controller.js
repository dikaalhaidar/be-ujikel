const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { response } = require('../helpers/response.formatter');
const { auth_secret } = require('../config/base.config');

const register = async (req, res) => {
    try {
        const { nama, email, password} = req.body;
        
        if (!nama || !email || !password ) {
            return res.status(400).json(response(400, "Semua field wajib diisi"));
        }
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json(response(400, "Email sudah terdaftar"));
        }
        
        const hashedPassword = passwordHash.generate(password);
        
        const user = await User.create({
            nama,
            email,
            password: hashedPassword,
        });
        
        return res.status(201).json(response(201, "Registrasi berhasil", {
            id: user.id,
            nama: user.nama,
            email: user.email,
        }));
        
    } catch (error) {
        console.error(error);
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json(response(400, "Email dan password wajib diisi"));
        }
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json(response(400, "Email tidak terdaftar"));
        }
        
        const isValid = passwordHash.verify(password, user.password);
        if (!isValid) {
            return res.status(400).json(response(400, "Password salah"));
        }
        
        const token = jwt.sign(
            { id: user.id, nama: user.nama, email: user.email, role: user.role },
            auth_secret,
            { expiresIn: '7d' }
        );
        
        return res.status(200).json(response(200, "Login Berhasil", {
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role,
            },
            token: token
        }));
        
    } catch (error) {
        console.error(error);
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

module.exports = { register, login };