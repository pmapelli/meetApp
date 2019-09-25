import Schedule from '../models/Schedule';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const schedule = await Schedule.findOne({
      where: { user_id: req.userId, id: req.paramns.id },
    });

    if (!schedule) {
      return res
        .status(400)
        .json({ error: 'Only meetup owners can receive notifications ' });
    }

    const notifications = await Notification.find({
      user: req.userId,
      schedule: req.paramns.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }
}

export default new NotificationController();
