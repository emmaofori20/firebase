const booklist = document.querySelector('#book-list');
const form = document.querySelector('#add-book-form');
// create element and render book
function renderBook(element) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let writer = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', element.id);
    name.textContent = element.data().name;
    writer.textContent = element.data().writer;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(writer);
    li.appendChild(cross);

    booklist.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');

        db.collection('books').doc(id).delete();
    })
}

//getting data
// db.collection('books').get().then((snapshot) => {
//     snapshot.docs.forEach(element => {
//         renderBook(element);
//     });
// });

//submitting data
form.addEventListener('submit', (e) => {

    e.preventDefault();

    db.collection('books').add({
        name: form.name.value,
        writer: form.writer.value
    });
    form.name.value = " ";
    form.writer.value = " ";
});

//real-time listener

db.collection('books').orderBy("name").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == "added") {
            renderBook(change.doc);
        } else if (change.type == 'removed') {
            let li = booklist.querySelector('[data-id=' + change.doc.id + ']');
            booklist.removeChild(li);
        }

    });
})