import express from 'express';
import connectDatabase from './config/db';
import cors from 'cors';

const app = express();

connectDatabase();

app.use(express.json({ extended: false }));

// enable all cors requests
app.use(cors())

app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

app.post('/api/users', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

app.listen(3000, () => console.log('Express server running on port 3000'));
