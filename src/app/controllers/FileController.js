import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    console.log(req.file);
    console.log(name);
    console.log(path);

    if (!name) {
      return res.status(401).json({ error: 'Name not found' });
    }

    if (!path) {
      return res.status(401).json({ error: 'Path not found' });
    }

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
