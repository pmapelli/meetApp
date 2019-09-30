import { Op } from 'sequelize';
import User from '../models/User';
import File from '../models/File';
import Schedule from '../models/Schedule';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

class MeetupController {
  async index(req, res) {
    const { date, page = 1 } = req.query;

    const parsedDate = parseISO(date);

    const meetups = await Schedule.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      attributes: ['id', 'title', 'description', 'location', 'date'],
      limit: 10,
      offset: (page - 1) * 20,
      order: ['date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(meetups);
  }
}

export default new MeetupController();
