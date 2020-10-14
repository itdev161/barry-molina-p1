const lists = document.getElementById('lists');
const welcomeBanner = document.getElementById('welcomeBanner');
const addListBtn = document.getElementById('addListBtn');
const newTitleText = document.getElementById('newTitleText');
const getListsURL = 'http://localhost:3000/api/getlists'; 
const addItemURL = 'http://localhost:3000/api/addItem'; 
const delItemURL = 'http://localhost:3000/api/delItem'; 
const delListURL = 'http://localhost:3000/api/delList'; 
const addListURL = 'http://localhost:3000/api/addList'; 
const user = JSON.parse(sessionStorage.getItem("currentUser"));

let currList = 1;
let listArray = [];

function createList(mongoListId, title, items) {
    let listId = 'list' + currList;
    currList++;
    let currItem = 1;
    items.forEach(item => {
        item.itemId = listId + '-item' + currItem;
        currItem++;
    });
    return {
        currItem,
        listId,
        mongoListId,
        title,
        items,
        pushItem(item) {
            item.itemId = listId + '-item' + currItem;
            currItem++;
            items.push(item);
            return item;
        }
    }
}

function loadList(list) {
    listArray.push(createList(list._id, list.title, list.items));
}
function displayList(thisList) {
    let title = newEl(
        'h3', 
        { 'class': 'list-title'}, 
        [ newText(thisList.title) ]
    );

    let newList = newEl(
        'ol', 
        {
            'class': 'list',
            'id': thisList.listId
        }
    );

    thisList.items.forEach(item => {
        let listItem = createListItem(thisList, newList, item);
        newList.appendChild(listItem);
    });
    
    let addItemBtn = newEl(
        'button', 
        { 'type': 'button' }, 
        [ newText('Add Item') ]
    );

    addItemBtn.addEventListener('click', e => {
        let newItemText = newEl( 'input', { 'type': 'text' });
        let newItemAdd = newEl('button', { 'type': 'submit' }, [ newText('Add') ]);
        let newItemCancel = newEl('button', { 'type': 'reset' }, [ newText('Cancel') ]);
        let newItemInput = newEl(
            'li',
            {},
            [
                newItemText,
                newItemAdd,
                newItemCancel
            ]
        )
        newList.appendChild(newItemInput);

        newItemAdd.addEventListener('click', e => {
            const listId = thisList.mongoListId;
            const itemDesc = newItemText.value;
            fetch(addItemURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ listId, itemDesc }),
            })
            .then(res => res.json())
            .then(({ itemId }) => {
                // newItem = { _id: itemId, desc: itemDesc };
                newItem = thisList.pushItem({ _id: itemId, desc: itemDesc }); // add itemid
                newList.insertBefore(createListItem(thisList, newList, newItem), newItemInput);
                newItemText.value = '';
            })
            .catch(err => {
                console.log(err);
            })
        })
        newItemCancel.addEventListener('click', e => {
            newList.removeChild(newItemInput);
        })
    });
    let delListBtn = newEl(
        'button', 
        { 'type': 'button' }, 
        [ newText('Delete List') ]
    );

    let listContainer = newEl(
        'div', 
        { 'class': 'list-container' },
        [ title, newList, addItemBtn, delListBtn]
    );

    lists.appendChild(listContainer);

    delListBtn.addEventListener('click', e => {
        const listId = thisList.mongoListId;
        fetch(delListURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ listId }),
        })
        .then(res => {
            if (res.ok) {
                lists.removeChild(listContainer);
            }
            return res.text();
        })
        .then(msg => {
            console.log(msg);
        })
        .catch(err => {
            console.log(err);
        })
    })
}
function createListItem(thisList, newList, item) {
    let listItem = newEl(
        'li',
        {
            'class': 'list-item',
            'id': item._id
        },
        [ newText(item.desc) ]
    );
    listItem.addEventListener('click', e => {
        const listId = thisList.mongoListId;
        const itemId = item._id;
        fetch(delItemURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ listId, itemId }),
        })
        .then(res => {
            if (res.ok) {
                newList.removeChild(listItem);
                console.log(listArray);
            }
            return res.text();
        })
        .then(msg => {
            console.log(msg);

        })
        .catch(err => {
            console.log(err);
        })
    })
    return listItem;
}

async function addDbItem(listId, itemDesc) {
    //update db here
    let newItem = {};
    fetch(addItemURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listId, itemDesc }),
    })
    .then(res => res.json())
    .then(({ itemId }) => {
        // newItem = { _id: itemId, desc: itemDesc };
        newItem = { itemId, itemDesc };
        console.log(newItem);
    })
    .catch(err => {
        console.log(err);
    })
    // console.log(newItem);
    return newItem;
}

function newEl(type, attr={}, children=[]) {
    let el = document.createElement(type);
    for (var n in attr) {
        el[n] = attr[n];
    }
    if (children) {
        children.forEach(child => {
            el.appendChild(child)
        });
    }
    return el;
}

function newText(text) {
    return document.createTextNode(text);
}

function start() {
    welcomeBanner.textContent = `Welcome, ${user.name}`;

    addListBtn.addEventListener('click', e => {
        const title = newTitleText.value;
        fetch(addListURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id, title }),
        })
        .then(res => res.json())
        .then(({ mongoListId }) => {
            let addedList = createList(mongoListId, title, []);
            listArray.push(addedList);
            displayList(addedList);
            newTitleText.value = '';
        })
        .catch(err => {
            console.log(err);
        })
    })

    fetch(getListsURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'id': user.id }),
    })
    .then(res => res.json())
    .then(listsData => {
        listsData.forEach(list => {
            // displayList(list);
            loadList(list);
        });
        listArray.forEach(list => {
            displayList(list);
        })
        console.log(listArray);
    })
    .catch(err => {
        console.log(err);
    })
}

start();