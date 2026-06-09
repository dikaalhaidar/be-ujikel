const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { verifyToken, siswaOnly } = require('../middlewares/auth');
const siswaController = require('../controllers/siswa.controller');

router.use(verifyToken, siswaOnly);

router.get('/kelas-saya', siswaController.getKelasSaya);
router.get('/tugas-saya', siswaController.getTugasSaya);
router.post('/tugas/:id/kumpul', upload.single('file'), siswaController.submitTugas);
router.get('/riwayat-saya', siswaController.getRiwayatSaya);

module.exports = router;