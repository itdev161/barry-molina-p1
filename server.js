import express from 'express';
import connectDatabase from './config/db';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import User from './models/Users';
import List from './models/Lists';

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

app.post('/api/lists', async (req, res) => {
    const { id } = req.body;
    // const christmaslist = new List(
    //     {
    //         user: id,
    //         title: "Christmas List",
    //         items: [
    //             "A very big soccer ball",
    //             "two pairs of footie pajamas",
    //             "A small trombone",
    //             "A saxophone",
    //             "Rabbit feet (for luck)",
    //             "$20"
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
    //             "Tools",
    //             "Power tools",
    //             "Dewalt angle grinder",
    //             "etc."
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
                console.log(user)
                return res.json({ 'id': user._id, 'name': user.name });
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

app.listen(3000, () => console.log('Express server running on port 3000'));
