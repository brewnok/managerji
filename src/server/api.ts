import express from 'express';
import fs from 'fs/promises';
import path from 'path';



const router = express.Router();

router.post('/api/saveCheckout', async (req, res) => {
  try {
    const checkoutData = req.body;
    const filePath = path.join(process.cwd(), 'roomdata.json');

    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
    }

    existingData.push(checkoutData);
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving checkout data:', error);
    res.status(500).json({ error: 'Failed to save checkout data' });
  }


});

export default router;