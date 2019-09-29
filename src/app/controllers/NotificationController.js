import Schedule from '../models/Schedule';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const schedule = await Schedule.findOne({
      where: { user_id: req.userId, id: req.params.id },
    });

    if (!schedule) {
      return res
        .status(400)
        .json({ error: 'Only meetup owners can receive notifications ' });
    }

    const notifications = await Notification.find({
      user: req.userId,
      schedule: req.params.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    console.log(notifications);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
