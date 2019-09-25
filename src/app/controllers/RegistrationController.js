import Registration from '../models/Registration';
import Schedule from '../models/Schedule';
class RegistrationController {
  async store(req, res) {
    const schedule = await Schedule.findOne({ where: { id: req.params.id } });

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

    const checkDate = Registration.findOne({
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

    return res.json(id, userId, scheduleId);

    // return res.json('Ok');
  }
}

export default new RegistrationController();
