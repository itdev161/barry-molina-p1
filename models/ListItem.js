import mongoose from 'mongoose';

const ListItemSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true
    }
})

const ListItem = mongoose.model('list', ListItemSchema);

export default ListItem;
