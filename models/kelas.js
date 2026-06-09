module.exports = (sequelize, DataTypes) => {
  const Kelas = sequelize.define('Kelas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    guruId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    siswaIds: {
      type: DataTypes.TEXT,  // Simpan sebagai JSON string
      allowNull: true,
      defaultValue: '[]',
      get() {
        const rawValue = this.getDataValue('siswaIds');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('siswaIds', JSON.stringify(value));
      }
    }
  }, {
    tableName: 'kelas',
    timestamps: true
  });

  Kelas.associate = (models) => {
    Kelas.belongsTo(models.User, { as: 'guru', foreignKey: 'guruId' });
  };

  return Kelas;
};