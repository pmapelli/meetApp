import * as Yup from 'yup';
import Schedule from '../models/Schedule';
import { startOfHour, parseISO, isBefore } from 'date-fns';

class ScheduleController {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { date, title, description, location } = req.body;

    const hourStart = startOfHour(parseISO(date));

    // Check for past date
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // Check date availability
    const checkAvailability = await Schedule.findOne({
      where: {
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Schedule date is not available' });
    }

    console.log(req.userId);

    const schedule = await Schedule.create({
      title,
      description,
      location,
      date,
      user_id: req.userId,
    });

    return res.json(schedule);
  }
}

export default new ScheduleController();
