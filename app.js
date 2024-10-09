const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pages'))); ///////////////////////////// Расположение статических файлов
app.use(express.static(path.join(__dirname, 'src'))); /////////////////////////////// Расположение файлов ресурсов 




//////////////////////////////////////////////////////// Подключение к базе данных 
mongoose.connect('mongodb://localhost:27017/Education-Practice-DB')
    .then(() => console.log('MongoDB подключен успшено!'))
    .catch(err => console.error('MongoDB ошибка подключения:', err));

////////////////////////////////////////////////////// API для работы с ключевыми словами и URL
const Keyword = require('./API/Keyword');




//////////////////////////////////////////////////////// Добавление слово и URL
app.post('/api/keywords', async (req, res) => {
    const { keyword, urls } = req.body;
    
    if (!keyword || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).send('Ключевое слово и список URL обязательны');
    }
    
    const newKeyword = new Keyword({ keyword, urls });
    await newKeyword.save();
    res.status(201).send(newKeyword);
});





////////////////////////////////////////////////////////////// Получение URL 
app.get('/api/keywords/:keyword', async (req, res) => {
    const { keyword } = req.params;
    const keywordData = await Keyword.findOne({ keyword });
    if (!keywordData) {
        return res.status(404).send('Keyword not found');
    }
    res.send(keywordData.urls);
});





//////////////////////////////////////////////////////////////// Скачивание контента по URL
app.get('/api/download', async (req, res) => {
    const { url } = req.query;
    
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.set('Content-Type', response.headers['content-type']);
        res.set('Content-Length', response.data.length);
        res.send(response.data);
    } catch (error) {
        console.error('Error downloading content:', error);
        res.status(500).send('Error downloading content');
    }
});






app.listen(PORT, () => {
    console.log(`Сервер отслеживает порт 3000`);
});
