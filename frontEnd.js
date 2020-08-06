//const axios = require('axios').default;
let rightPlace = false;
const root = document.querySelector("#root")
const showButton = document.querySelector("#show");
const singleButton = document.querySelector("#single");
const addButton = document.querySelector("#add");
const editButton = document.querySelector("#edit");
const delButton = document.querySelector("#delete");
showButton.addEventListener('click', showList);
singleButton.addEventListener('click', showSingle);
addButton.addEventListener('click', addProduct);
editButton.addEventListener('click', editProduct);
delButton.addEventListener('click', deleteProduct);

let draggables = document.querySelectorAll(".draggable");;
let containers = document.querySelector(".container");

function showList() {
    root.innerHTML = '';
    fetch('http://localhost:3000/products').then(res => res.json()).then(data => {
        createLines(data);
        draggables = document.querySelectorAll(".draggable");
        containers = document.querySelector(".container");
        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', (e) => {
                if (rightPlace) draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                rightPlace = false;
            });
        });
        containers.addEventListener('dragover', (e) => {
            if (!rightPlace) return;
            e.preventDefault();
            const afterElement = getDragAfterElement(containers, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                containers.insertBefore(draggable, document.querySelector('.add'));
            } else {
                containers.insertBefore(draggable, afterElement);
            }
        });
    });
}

function showSingle() {
    root.innerHTML = '';
    let num = prompt('please enter product id: ');
    fetch(`http://localhost:3000/product/${num}`).then(res => res.json()).then(data => {
        let product = document.createElement('span');
        product.textContent = data.title;
        root.appendChild(product);
    });
}

function addProduct() {
    root.innerHTML = '';
    let someProduct = {
        id: 11,
        title: "Brownish eggs",
        type: "dairy",
        description: "Raw organic brown eggs in a basket",
        filename: "0.jpg",
        height: 600,
        width: 400,
        price: 28.1,
        rating: 4,
    };
    root.innerHTML = '';
    fetch(`http://localhost:3000/product/${someProduct.id}`, {
        method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(someProduct)
    }).then(res => res.json()).then(data => {
        let product = document.createElement('span');
        product.textContent = data.title;
        root.appendChild(product);
    });
}

function editProduct() {
    root.innerHTML = '';
    let someProduct = {
        id: 18,
        title: "Brownish eggs",
        type: "dairy",
        description: "Raw organic brown eggs in a basket",
        filename: "0.jpg",
        height: 600,
        width: 400,
        price: 28.1,
        rating: 4,
    };
    let num = prompt('please enter product id: ');
    fetch(`http://localhost:3000/product/${num}`, {
        method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(someProduct)
    }).then(res => res.json()).then(data => {
        let product = document.createElement('span');
        product.textContent = data.title;
        root.appendChild(product);
    });
}

function deleteProduct() {
    root.innerHTML = '';
    let num = prompt('please enter product id: ');
    fetch(`http://localhost:3000/product/${num}`, { method: "DELETE" });
}




function getDragAfterElement(container, y) {
    const draggableElements = [...containers.querySelectorAll('.draggable:not(.dragging)')]
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

function createLines(data) {
    let productsList = document.createElement('div');
    productsList.classList.add('grid-container', 'container');
    data.forEach(element => {
        let product = document.createElement('div');
        product.classList.add('draggable', 'grid-item');
        product.draggable = true;
        let reorder = document.createElement('i');
        reorder.classList.add('fa', 'fa-reorder', 'drag');
        reorder.addEventListener('mousedown', (e) => {
            rightPlace = true;
        });
        product.appendChild(reorder);
        let span = document.createElement('span');
        span.textContent = element.title;
        let check = document.createElement('input');
        check.type = 'checkbox';
        check.addEventListener('change', () => {
            if (check.checked) {
                span.classList.add('checked');
            } else {
                span.classList.remove('checked');
            }
        });
        product.appendChild(check);
        product.appendChild(span);
        let set = document.createElement('i');
        set.classList.add('fa', 'fa-ellipsis-v');
        product.appendChild(set);
        productsList.appendChild(product);
    });
    let addLine = document.createElement('div');
    addLine.classList.add('add');
    let newProduct = document.createElement('button');
    newProduct.classList.add('dot');
    newProduct.textContent = '+';
    addLine.appendChild(newProduct);
    productsList.appendChild(addLine);
    root.appendChild(productsList);
}