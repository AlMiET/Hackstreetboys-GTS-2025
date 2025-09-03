const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send', async (req, res) => {
  const { navn, epost, melding } = req.body;

  // Sett opp transport (bruk din egen e-post og app-passord)
  let transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: 'morteneidseter@outlook.com',
      pass: 'Passordet' // Bruk app-passord, ikke vanlig passord!
    }
  });

  try {
    await transporter.sendMail({
      from: '"Nettside Kontakt" <morteneidseter@outlook.com>',
      to: 'morteneidseter@outlook.com',
      subject: 'Ny henvendelse fra nettsiden',
      text: `Navn: ${navn}\nE-post: ${epost}\nMelding: ${melding}`
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log('Server kjører på http://localhost:3000'));