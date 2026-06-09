const { Kelas, Tugas, User, Pengumpulan } = require('../models');
const { response } = require('../helpers/response.formatter');

// GET semua kelas
const getAllKelas = async (req, res) => {
    try {
        const kelas = await Kelas.findAll({
            where: { guruId: req.user.id }
        });
        const kelasWithSiswa = await Promise.all(kelas.map(async (k) => {
            let siswaIds = k.siswaIds || [];
            if (typeof siswaIds === 'string') {
                siswaIds = JSON.parse(siswaIds);
            }

            const siswaList = await User.findAll({
                where: { id: siswaIds, role: 'siswa' },
                attributes: ['id', 'nama', 'email']
            });

            return {
                ...k.toJSON(),
                siswaList: siswaList
            };
        }));

        return res.status(200).json(response(200, "Berhasil", kelasWithSiswa));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// POST buat kelas
const createKelas = async (req, res) => {
    try {
        const { nama } = req.body;
        if (!nama) {
            return res.status(400).json(response(400, "Nama kelas wajib diisi"));
        }
        const kelas = await Kelas.create({
            nama,
            guruId: req.user.id,
            siswaIds: []
        });
        return res.status(201).json(response(201, "Kelas berhasil dibuat", kelas));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// PUT update kelas
const updateKelas = async (req, res) => {
    try {
        const { nama } = req.body;
        await Kelas.update({ nama }, { where: { id: req.params.id, guruId: req.user.id } });
        return res.status(200).json(response(200, "Kelas berhasil diupdate"));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// DELETE hapus kelas
const deleteKelas = async (req, res) => {
    try {
        await Kelas.destroy({ where: { id: req.params.id, guruId: req.user.id } });
        return res.status(200).json(response(200, "Kelas berhasil dihapus"));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// POST tambah siswa ke kelas
const addSiswaToKelas = async (req, res) => {
    try {
        const { emailSiswa } = req.body;
        const { kelasId } = req.params;
        console.log(' Mencari siswa dengan email:', emailSiswa);
        
        const siswa = await User.findOne({ where: { email: emailSiswa, role: 'siswa' } });
        if (!siswa) {
            return res.status(404).json(response(404, "Siswa tidak ditemukan"));
        }

        const kelas = await Kelas.findOne({ where: { id: kelasId, guruId: req.user.id } });
        if (!kelas) {
            return res.status(404).json(response(404, "Kelas tidak ditemukan"));
        }

        let siswaIds = kelas.siswaIds || [];
        if (typeof siswaIds === 'string') {
            siswaIds = JSON.parse(siswaIds);
        }

        if (siswaIds.includes(siswa.id)) {
            return res.status(400).json(response(400, "Siswa sudah terdaftar di kelas ini"));
        }

        siswaIds.push(siswa.id);
        await kelas.update({ siswaIds: JSON.stringify(siswaIds) });

        return res.status(200).json(response(200, "Siswa berhasil ditambahkan"));
    } catch (error) {
        console.error(' Error:', error);
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// DELETE hapus siswa dari kelas
const removeSiswaFromKelas = async (req, res) => {
    try {
        const { kelasId, siswaId } = req.params;

        const kelas = await Kelas.findOne({ where: { id: kelasId, guruId: req.user.id } });
        if (!kelas) {
            return res.status(404).json(response(404, "Kelas tidak ditemukan"));
        }

        let siswaIds = kelas.siswaIds || [];
        if (typeof siswaIds === 'string') {
            siswaIds = JSON.parse(siswaIds);
        }

        if (!siswaIds.includes(parseInt(siswaId))) {
            return res.status(400).json(response(400, "Siswa tidak terdaftar di kelas ini"));
        }

        siswaIds = siswaIds.filter(id => id != siswaId);
        await kelas.update({ siswaIds: JSON.stringify(siswaIds) });

        return res.status(200).json(response(200, "Siswa berhasil dihapus dari kelas"));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// GET semua tugas
const getAllTugas = async (req, res) => {
    try {
        const tugas = await Tugas.findAll({
            where: { guruId: req.user.id },
            include: [{ model: Kelas, as: 'kelas', attributes: ['nama'] }]
        });

        const tugasWithCount = await Promise.all(tugas.map(async (t) => {
            const totalDikumpulkan = await Pengumpulan.count({
                where: { tugasId: t.id }
            });
            return {
                ...t.toJSON(),
                totalDikumpulkan: totalDikumpulkan
            };
        }));

        return res.status(200).json(response(200, "Berhasil", tugasWithCount));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// POST buat tugas
const createTugas = async (req, res) => {
    try {
        const { judul, deskripsi, deadline, kelasId } = req.body;
        if (!judul || !deskripsi || !deadline || !kelasId) {
            return res.status(400).json(response(400, "Semua field wajib diisi"));
        }
        const tugas = await Tugas.create({
            judul,
            deskripsi,
            deadline,
            kelasId,
            guruId: req.user.id
        });
        return res.status(201).json(response(201, "Tugas berhasil dibuat", tugas));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// PUT update tugas
const updateTugas = async (req, res) => {
    try {
        const { judul, deskripsi, deadline } = req.body;
        await Tugas.update(
            { judul, deskripsi, deadline },
            { where: { id: req.params.id, guruId: req.user.id } }
        );
        return res.status(200).json(response(200, "Tugas berhasil diupdate"));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// DELETE hapus tugas
const deleteTugas = async (req, res) => {
    try {
        await Tugas.destroy({ where: { id: req.params.id, guruId: req.user.id } });
        return res.status(200).json(response(200, "Tugas berhasil dihapus"));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// GET pengumpulan by tugas
const getPengumpulanByTugas = async (req, res) => {
    try {
        const pengumpulan = await Pengumpulan.findAll({
            where: { tugasId: req.params.tugasId },
            include: [{ model: User, as: 'siswa', attributes: ['nama', 'email'] }]
        });
        return res.status(200).json(response(200, "Berhasil", pengumpulan));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// PUT beri nilai
const giveNilai = async (req, res) => {
    try {
        const { nilai } = req.body;
        await Pengumpulan.update(
            { nilai },
            { where: { id: req.params.id } }
        );
        return res.status(200).json(response(200, "Nilai berhasil diberikan"));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

// GET dashboard
const getDashboard = async (req, res) => {
    try {
        const tugasGuru = await Tugas.findAll({
            where: { guruId: req.user.id },
            attributes: ['id', 'judul', 'deadline']
        });

        const tugasIds = tugasGuru.map(t => t.id);
        const pengumpulan = await Pengumpulan.findAll({
            where: { tugasId: tugasIds },
            include: [
                {
                    model: Tugas,
                    as: 'tugas',
                    attributes: ['id', 'judul', 'deadline', 'kelasId'],
                    include: [{ model: Kelas, as: 'kelas', attributes: ['nama'] }]
                },
                {
                    model: User,
                    as: 'siswa',
                    attributes: ['id', 'nama', 'email']
                }
            ],
            order: [['waktuKumpul', 'DESC']]
        });

        const totalPengumpulan = pengumpulan.length;
        const sudahDinilai = pengumpulan.filter(p => p.nilai !== null).length;
        const belumDinilai = totalPengumpulan - sudahDinilai;

        const dashboard = {
            statistik: {
                totalTugas: tugasGuru.length,
                totalPengumpulan,
                sudahDinilai,
                belumDinilai
            },
            pengumpulan
        };

        return res.status(200).json(response(200, "Berhasil", dashboard));
    } catch (error) {
        return res.status(500).json(response(500, "Server Error", error.message));
    }
};

module.exports = {
    getAllKelas,
    createKelas,
    updateKelas,
    deleteKelas,
    addSiswaToKelas,
    removeSiswaFromKelas,
    getAllTugas,
    createTugas,
    updateTugas,
    deleteTugas,
    getPengumpulanByTugas,
    giveNilai,
    getDashboard
};