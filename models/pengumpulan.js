module.exports = (sequelize, DataTypes) => {
  const Pengumpulan = sequelize.define('Pengumpulan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tugasId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    siswaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    waktuKumpul: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    nilai: {
      type: DataTypes.INTEGER,
      validate: { min: 0, max: 100 }
    },
  }, {
    tableName: 'pengumpulan',
    timestamps: true
  });

  Pengumpulan.associate = (models) => {
    Pengumpulan.belongsTo(models.Tugas, { as: 'tugas', foreignKey: 'tugasId' });
    Pengumpulan.belongsTo(models.User, { as: 'siswa', foreignKey: 'siswaId' });
  };

  return Pengumpulan;
};