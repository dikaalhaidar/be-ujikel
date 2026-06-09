const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { verifyToken, guruOnly } = require('../middlewares/auth');
const guruController = require('../controllers/guru.controller');

router.use(verifyToken, guruOnly);

router.get('/dashboard', guruController.getDashboard);
router.get('/kelas', guruController.getAllKelas);
router.post('/kelas', upload.none(), guruController.createKelas);
router.put('/kelas/:id', upload.none(), guruController.updateKelas);
router.delete('/kelas/:id', guruController.deleteKelas);
router.delete('/kelas/:kelasId/siswa/:siswaId', guruController.removeSiswaFromKelas);
router.post('/kelas/:kelasId/siswa', upload.none(), guruController.addSiswaToKelas);

router.get('/tugas', guruController.getAllTugas);
router.post('/tugas', upload.none(), guruController.createTugas);
router.put('/tugas/:id', upload.none(), guruController.updateTugas);
router.delete('/tugas/:id', guruController.deleteTugas);

router.get('/tugas/:tugasId/pengumpulan', guruController.getPengumpulanByTugas);
router.put('/pengumpulan/:id/nilai', upload.none(), guruController.giveNilai);

module.exports = router;