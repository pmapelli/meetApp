import Notification from '../schemas/Notification';
import Registration from '../models/Registration';
import Schedule from '../models/Schedule';
import User from '../models/User';

import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';
import { scheduled } from 'rxjs';

class RegistrationController {
  async store(req, res) {
    const schedule = await Schedule.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
        },
      ],
    });

    if (!schedule) {
      return res.status(400).json({ error: 'Scheduling not found' });
    }

    if (schedule.past) {
      return res.status(400).json({ error: 'Scheduling has passed' });
    }

    const registration = await Registration.findOne({
      where: { user_id: req.userId, schedule_id: req.params.id },
    });

    if (registration) {
      return res.status(400).json({ error: 'Already registered user' });
    }

    const checkDate = await Registration.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Schedule,
          as: 'schedule',
          required: true,
          where: {
            date: schedule.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    const { id, userId, scheduleId } = await Registration.create({
      user_id: req.userId,
      schedule_id: req.params.id,
    });

    await Notification.create({
      content: `O usuário ${schedule.user.name} se inscreveu para o Meetup: ${schedule.title}`,
      user: req.userId,
      schedule: req.params.id,
    });

    const registrationMail = await Registration.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: Schedule,
          as: 'schedule',
          attributes: ['title'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'email'],
            },
          ],
        },
      ],
    });

    const quantityRegistrations = await Registration.findAndCountAll({
      where: { schedule_id: req.params.id },
    });

    await Queue.add(RegistrationMail.key, {
      registrationMail,
      count: quantityRegistrations.count,
    });

    return res.json(id, userId, scheduleId);
  }
}

export default new RegistrationController();
