import { spawnSync } from 'child_process';
import { searchItems } from '@/lib/content';

const allPlaces = [
  ...searchItems('', ['place']),
  ...searchItems('', ['monastery']),
  ...searchItems('', ['hotel']),
  ...searchItems('', ['restaurant']),
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt, days } = req.body;
    const pythonProcess = spawnSync('python', [
      'generate_itinerary.py',
      prompt,
      days.toString(),
      JSON.stringify(allPlaces),
    ]);

    if (pythonProcess.error) {
      console.error(pythonProcess.error);
      return res.status(500).json({ error: 'Error executing Python script' });
    }

    const output = pythonProcess.stdout.toString().trim();
    try {
      const itinerary = JSON.parse(output);
      return res.status(200).json(itinerary);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Error parsing Python output' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}