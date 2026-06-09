module.exports = (sequelize, DataTypes) => {
  const Tugas = sequelize.define('Tugas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    kelasId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    guruId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'tugas',
    timestamps: true
  });

  Tugas.associate = (models) => {
    Tugas.belongsTo(models.Kelas, { as: 'kelas', foreignKey: 'kelasId' });
    Tugas.belongsTo(models.User, { as: 'guru', foreignKey: 'guruId' });
    Tugas.hasMany(models.Pengumpulan, { as: 'pengumpulan', foreignKey: 'tugasId' });
  };

  return Tugas;
};