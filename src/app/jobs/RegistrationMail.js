import Mail from '../../lib/Mail';

class RegistrationMail {
  get Key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registrationMail, count } = data;

    await Mail.sendMail({
      to: `${registrationMail.schedule.user.name} <${registrationMail.schedule.user.email}>`,
      subject: 'Novo inscrito Meetup',
      template: 'registration',
      context: {
        owner: registrationMail.schedule.user.name,
        user: registrationMail.user.name,
        event: registrationMail.schedule.title,
        count,
      },
    });
  }
}

export default new RegistrationMail();
