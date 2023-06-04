const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');
const Word = require('./DataModel')

AWS.config.update({ region: 'ap-southeast-1' });

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer();

// Set up AWS Textract
const textract = new AWS.Textract();
const polly = new AWS.Polly();
const translate = new AWS.Translate();

// Handle image upload and text extraction
app.post('/extract-text', upload.single('image'), (req, res) => {  
  const imageBuffer = req.file.buffer;

  const params = {
    Document: {
      Bytes: imageBuffer,
    },
  };

  textract.detectDocumentText(params, (error, data) => {
    if (error) {
      console.error('Error extracting text:', error);
      res.status(500).json({ error: 'Text extraction failed' });
    } else {
      const extractedText = data.Blocks
        .filter(block => block.BlockType === 'LINE')
        .map(block => block.Text)
        .join('\n');

      res.json({ text: extractedText });
    }
  });
});


// Text-to-speech route
app.post('/synthesize-speech', async (req, res) => {
    try {
      const { text, voiceId } = req.body;
      
      if (!text || !voiceId) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
  
      const speechParams = {
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: voiceId
      };
  
      polly.synthesizeSpeech(speechParams, (err, data) => {
        if (err) {
          console.error('Error synthesizing speech:', err);
          return res.status(500).json({ error: 'Error synthesizing speech' });
        }
  
        res.set('Content-Type', 'audio/mpeg');
        res.send(data.AudioStream);
      });
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      res.status(500).json({ error: 'Error synthesizing speech' });
    }
});

// Text translation

app.post('/translate-text', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const translateParams = {
      Text: text,
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'vi',
    };

    const result = await translate.translateText(translateParams).promise();
    res.json({ text: result.TranslatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Error translating text' });
  }
});

app.get('/flashcards', async (req, res) => {
  const words = await Word.findAll();

  res.json(words);
});

app.post('/words', async (req, res) => {
  try {
    const { word, definition, translation } = req.body;

    // Create word
    await Word.create({ word, definition, translation });

    res.status(201).json({ message: 'Word added successfully.' });
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
})

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
