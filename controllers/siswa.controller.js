const { Tugas, Pengumpulan, Kelas, User } = require('../models');
const { response } = require('../helpers/response.formatter');

// GET kelas saya
const getKelasSaya = async (req, res) => {
    try {
        const semuaKelas = await Kelas.findAll({
            include: [{ model: User, as: 'guru', attributes: ['nama', 'email'] }]
        });
        
        const kelasSaya = semuaKelas.filter(kelas => {
            const siswaIds = kelas.siswaIds || [];
            return siswaIds.includes(req.user.id);
        });
        
        return res.status(200).json(response(200, "Berhasil", kelasSaya));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// GET tugas saya
const getTugasSaya = async (req, res) => {
    try {
        const semuaKelas = await Kelas.findAll();
        
        const kelasSayaIds = semuaKelas
            .filter(kelas => {
                const siswaIds = kelas.siswaIds || [];
                return siswaIds.includes(req.user.id);
            })
            .map(kelas => kelas.id);
        
        if (kelasSayaIds.length === 0) {
            return res.status(200).json(response(200, "Berhasil", []));
        }
        
        const tugas = await Tugas.findAll({
            where: { kelasId: kelasSayaIds },
            include: [{ model: Kelas, as: 'kelas', attributes: ['nama'] }],
            order: [['deadline', 'ASC']]
        });
        
        const tugasDenganStatus = await Promise.all(tugas.map(async (t) => {
            const sudahKumpul = await Pengumpulan.findOne({
                where: { tugasId: t.id, siswaId: req.user.id }
            });
            return {
                ...t.toJSON(),
                sudahKumpul: !!sudahKumpul,
                nilai: sudahKumpul?.nilai
            };
        }));
        
        return res.status(200).json(response(200, "Berhasil", tugasDenganStatus));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// POST submit tugas
const submitTugas = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json(response(400, "File wajib diupload"));
        }
        
        const fileUrl = `/uploads/${req.file.filename}`;
        const tugasId = req.params.id;
        
        const sudah = await Pengumpulan.findOne({
            where: { tugasId: tugasId, siswaId: req.user.id }
        });
        
        if (sudah) {
            return res.status(400).json(response(400, "Anda sudah mengumpulkan tugas ini"));
        }
        
        await Pengumpulan.create({
            tugasId: tugasId,
            siswaId: req.user.id,
            fileUrl: fileUrl
        });
        
        return res.status(201).json(response(201, "Tugas berhasil dikumpulkan"));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// GET riwayat saya
const getRiwayatSaya = async (req, res) => {
    try {
        const riwayat = await Pengumpulan.findAll({
            where: { siswaId: req.user.id },
            include: [{ model: Tugas, as: 'tugas', attributes: ['judul', 'deskripsi', 'deadline'] }],
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json(response(200, "Berhasil", riwayat));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

module.exports = {
    getKelasSaya,
    getTugasSaya,
    submitTugas,
    getRiwayatSaya
};