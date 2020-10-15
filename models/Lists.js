import mongoose from 'mongoose';

const ListItemSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true
    }
})

const ListSchema = new mongoose.Schema({
    user: { 
        type: 'ObjectId', 
        ref: 'User' 
    },
    title: String,
    items: [ListItemSchema]
})

const List = mongoose.model('list', ListSchema);

export default List;
