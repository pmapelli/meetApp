import { Model, Sequelize } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' });
  }
}

export default Schedule;
