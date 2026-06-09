module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'siswa'
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    // Guru membuat banyak kelas
    User.hasMany(models.Kelas, { as: 'kelasDibuat', foreignKey: 'guruId' });
    
    // Guru membuat banyak tugas
    User.hasMany(models.Tugas, { as: 'tugasDibuat', foreignKey: 'guruId' });
    
    // Siswa mengumpulkan banyak tugas
    User.hasMany(models.Pengumpulan, { as: 'pengumpulan', foreignKey: 'siswaId' });
  };

  return User;
};