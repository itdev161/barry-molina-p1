import express from 'express';
import connectDatabase from './config/db';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import User from './models/Users';
import List from './models/Lists';
import mongoose from 'mongoose';

const app = express();

connectDatabase();

app.use(express.json({ extended: false }));

// enable all cors requests
app.use(cors())

app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

app.post('/api/getLists', async (req, res) => {
    const { id } = req.body;
    let lists = await List.find({ user: id });
    return res.json(lists);
});
app.post('/api/addList', async (req, res) => {
    const { userId, title } = req.body;
    try {
        const newList = new List({ user: userId, title });
        newList.save((err, list) => {
            if(err) console.log(err);
            return res.json({ mongoListId: list._id });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('hi Server error');
    }
});
app.post('/api/delList', async (req, res) => {
    const { listId } = req.body;
    try {
        List.findByIdAndDelete(listId, function (err, deleted) {
            if(err) console.log(err);
            if (deleted) {
                return res.send('List deleted');
            } else {
                return res.status(422).send('List not found');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('hi Server error');
    }
});

app.post('/api/delItem', async (req, res) => {
    const { listId, itemId } = req.body;
    console.log(itemId);
    try {
        let list = await List.findById(listId);
        list.items.id(itemId).remove();
        list.save();
        return res.send('Item deleted');
    } catch (error) {
        console.log(error);
        res.status(500).send('hi Server error');
    }
});
app.post('/api/addItem', async (req, res) => {
    const { listId, itemDesc } = req.body;
    try {
        let list = await List.findById(listId);
        if (!list) {
            return res.status(422).send('List not found');
        }
        const itemId = mongoose.Types.ObjectId();
        list.items.push({ _id: itemId, desc: itemDesc });
        list = await list.save();
        return res.json({ itemId });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});
app.post(
    '/api/login', 
    [
        check('name', 'Please enter your name').not().isEmpty(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })

    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { name, password } = req.body;
            try {
                let user = await User.findOne({ name: name, password: password });
                if (!user) {
                    return res
                      .status(422)
                      .json({ errors: [{ msg: 'Invalid username or password. Please sign up to create and account'}] });
                }
                return res.json({ 'id': user._id, 'name': user.name });
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

app.post(
    '/api/signup', 
    [
        check('name', 'Please enter your name').not().isEmpty(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })

    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { name, password } = req.body;
            try {
                let user = await User.findOne({ name: name, password: password });
                if (user) {
                    return res
                      .status(422)
                      .json({ errors: [{ msg: 'User already exists. Please log in to access your account'}] });
                }
                const newUser = new User({ name, password });
                newUser.save(( err, user ) => {
                    if(err) console.log(err);
                    return res.json({ 'id': user._id, 'name': user.name });
                })
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);
app.listen(3000, () => console.log('Express server running on port 3000'));
