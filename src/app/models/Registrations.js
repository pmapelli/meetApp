import { Model } from 'sequelize';

class Registrations extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Schedule, {
      foreignKey: 'schedule_id',
      as: 'schedule',
    });
  }
}

export default Registrations;
