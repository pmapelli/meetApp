import { Model } from 'sequelize';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Schedule, {
      foreignKey: 'schedule_id',
      as: 'schedule',
    });
  }
}

export default Registration;
