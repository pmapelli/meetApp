import Mail from '../../lib/Mail';

class RegistrationMail {
  get Key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration, quantity } = data;

    await Mail.sendMail({
      to: `${registration.schedule.user.name} <${registration.schedule.user.email}>`,
      subject: 'Novo inscrito Meetup',
      template: 'registration',
      context: {
        owner: registration.schedule.user.name,
        user: registration.user.name,
        event: registration.schedule.title,
        quantity,
      },
    });
  }
}

export default new RegistrationMail();
