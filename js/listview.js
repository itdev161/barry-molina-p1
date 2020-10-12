const lists = document.getElementById('lists');
const welcomeBanner = document.getElementById('welcomeBanner');
const serverURL = 'http://localhost:3000/api/lists'; 
const user = JSON.parse(sessionStorage.getItem("currentUser"));

welcomeBanner.textContent = `Welcome, ${user.name}`;

let currList = 0;
let listArray = [];

function listFactory(mongoListId, title, items) {
    let listId = currList;
    currList++;
    return {
        listId,
        mongoListId,
        title,
        items
    }
}


fetch(serverURL, {
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
    console.log(listArray);
    let addListBtn = newEl(
        'button',
        { 'type': 'button' },
        [ newText('Create New List') ]
    );
    addListBtn.addEventListener('click', e => {
        addList(e);
    })
    lists.appendChild(addListBtn);
})
.catch(err => {
    console.log(err);
})

function loadList(list) {
    listArray.push(listFactory(list._id, list.title, list.items));
}
function displayList(list) {
    let title = newEl(
        'h3', 
        { 'class': 'list-title'}, 
        [ newText(list.title) ]
    );

    newList = newEl('ol', {'class': 'list'});

    list.items.forEach(item => {
        listItem = newEl(
            'li',
            {'class': 'list-item'},
            [ newText(item) ]
        );
        newList.appendChild(listItem);
    });
    
    let addItemBtn = newEl(
        'button', 
        { 'type': 'button' }, 
        [ newText('Add Item') ]
    );
    addItemBtn.addEventListener('click', e => {
        // e.target.parentElement.firstChild
    });

    let listContainer = newEl(
        'div', 
        { 'class': 'list-container' },
        [ title, newList, addItemBtn ]
    );

    lists.appendChild(listContainer);
}

function addList(e) {

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