import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
    user: { 
        type: 'ObjectId', 
        ref: 'User' 
    },
    title: String,
    items: [String]
})

const List = mongoose.model('list', ListSchema);

export default List;
