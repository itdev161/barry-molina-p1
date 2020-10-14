import express from 'express';
import connectDatabase from './config/db';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import User from './models/Users';
import List from './models/Lists';
import mongoose from 'mongoose';

const app = express();

connectDatabase();

// const barry = new User({ name: 'Barry', password: '1234abcd'});
// barry.save((err, barry) => {
//     if (err) return console.error(err);
//     console.log(barry.name);
// })

// User.find((err, users) => {
//     if (err) return console.error(err);
//     console.log(users);
// })


app.use(express.json({ extended: false }));

// enable all cors requests
app.use(cors())

app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

app.post('/api/getLists', async (req, res) => {
    const { id } = req.body;
    // const christmaslist = new List(
    //     {
    //         user: id,
    //         title: "Christmas List",
    //         items: [
    //             { desc: "A very big soccer ball"},
    //             { desc: "two pairs of footie pajamas"},
    //             { desc: "A small trombone"},
    //             { desc: "A saxophone"},
    //             { desc: "Rabbit feet (for luck)"},
    //         ]
    //     }
    // );
    // christmaslist.save((err, christmaslist) => {
    //     if (err) return console.error(err);
    //     console.log(christmaslist.title);
    // })
    // const birthdaylist = new List(
    //     {
    //         user: id,
    //         title: "Birthday Wish List",
    //         items: [
    //             { desc: "tools " },
    //             { desc: "Power tools" },
    //             { desc: "Dewalt angle grinder" },
    //             { desc: "etc." }
    //         ]
    //     }
    // );
    // birthdaylist.save((err, birthdaylist) => {
    //     if (err) return console.error(err);
    //     console.log(birthdaylist.title);
    // })
    let lists = await List.find({ user: id });
    return res.json(lists);
});
app.post('/api/addList', async (req, res) => {
    const { userId, title } = req.body;
    try {
        const newList = new List({ user: userId, title });
        newList.save((err, list) => {
            if(err) console.log(err);
            console.log('List Added');
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
                console.log("Successful deletion");
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
        // Equivalent to `parent.child = null`
        list.save();
        return res.send('Item deleted');
        // let deleted = await ListItem.findByIdAndDelete(itemId);
        // console.log(deleted);
        // if (!deleted) {
        //     return res.status(422).send('Item not found');
        // }
    } catch (error) {
        console.log(error);
        res.status(500).send('hi Server error');
    }
});
app.post('/api/addItem', async (req, res) => {
    const { listId, itemDesc } = req.body;
    // console.log(listId, itemDesc);
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
    '/api/users', 
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
                      .json({ errors: [{ msg: 'Invalid username or password'}] });
                }
                return res.json({ 'id': user._id, 'name': user.name });
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

app.listen(3000, () => console.log('Express server running on port 3000'));
