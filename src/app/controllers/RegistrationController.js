import Registration from '../models/Registration';
import Schedule from '../models/Schedule';

class RegistrationController {
  async store(req, res) {
    const schedule = await Schedule.findOne({ where: { id: req.params.id } });

    if (!schedule) {
      return res.status(400).json({ error: 'Scheduling not found' });
    }

    if (isBefore(schedule.date, new Date())) {
      return res.status(400).json({ error: 'Scheduling has passed' });
    }

    const registration = await Registration.findOne({
      where: { user_id: req.userId, schedule_id: req.params.id },
    });

    if (registration) {
      return res.status(400).json({ error: 'Already registered user' });
    }
  }
}

export default RegistrationController();
