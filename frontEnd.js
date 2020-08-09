//const axios = require('axios').default;
let rightPlace = false;
let whichTask;
const root = document.querySelector("#root")
const productsList = document.createElement('div');
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
    productsList.innerHTML = '';
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
                draggable.draggable = false;
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
    productsList.classList.add('grid-container', 'container');
    data.forEach(element => {
        let product = document.createElement('div');
        product.classList.add('draggable', 'grid-item');
        product.value = element.id;
        let reorder = document.createElement('i');
        reorder.classList.add('fa', 'fa-reorder', 'drag');
        reorder.addEventListener('mousedown', (e) => {
            rightPlace = true;
            product.draggable = true;
        });
        product.appendChild(reorder);
        let span = document.createElement('span');
        span.textContent = element.title;
        let check = document.createElement('input');
        check.type = 'checkbox';
        check.classList.add('pointer');
        check.addEventListener('change', () => {
            if (check.checked && product.children[2].tagName == 'SPAN') {
                product.children[2].classList.add('checked');
                fetch(`http://localhost:3000/product/${product.value}`, {
                    method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ checked: true })
                });
            } else {
                product.children[2].classList.remove('checked');
                fetch(`http://localhost:3000/product/${product.value}`, {
                    method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ checked: false })
                });
            }
        });
        if (element.checked) {
            span.classList.add('checked');
            check.checked = true;
        }
        product.appendChild(check);
        product.appendChild(span);
        let set = document.createElement('i');
        set.classList.add('fa', 'fa-ellipsis-v', 'pointer');
        set.addEventListener('click', showSettings);
        product.appendChild(set);
        productsList.appendChild(product);
    });
    let addLine = document.createElement('div');
    addLine.classList.add('add');
    let newProduct = document.createElement('button');
    newProduct.classList.add('dot');
    newProduct.textContent = '+';
    newProduct.addEventListener('click', AddNewLine);
    addLine.appendChild(newProduct);
    productsList.appendChild(addLine);
    root.appendChild(productsList);
}

function showSettings(e) {
    // Show contextmenu
    $(".custom-menu").finish().toggle(100).css({
        top: event.pageY + "px",
        left: event.pageX + "px"
    });

    whichTask = e.target.parentElement;
}

document.addEventListener("mousedown", function (e) {

    // If the clicked element is not the menu
    if (!$(e.target).parents(".custom-menu").length > 0) {

        // Hide it
        $(".custom-menu").hide(100);
    }
});

//finding the menu element
window.onload = function () {
    let menu = document.getElementById('custom-menu');
    menu.addEventListener('click', removeOrEdit);
};

function removeOrEdit(e) {
    if (e.target.textContent == 'Edit') {
        edit(whichTask, 'edit');
    } else {
        fetch(`http://localhost:3000/product/${whichTask.value}`, { method: "DELETE" });
        productsList.removeChild(whichTask);
    }
    $(".custom-menu").hide(100);
}

function edit(whichTask, which) {
    let editProduct = document.createElement('input');
    editProduct.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            let final = document.createElement('span');
            final.textContent = editProduct.value;
            whichTask.insertBefore(final, whichTask.children[3]);
            whichTask.removeChild(whichTask.children[2]);
            whichTask.children[1].checked = false;
            let someProduct = {
                title: final.textContent,
                id: whichTask.value
            };
            if (which == 'edit') {
                fetch(`http://localhost:3000/product/${whichTask.value}`, {
                    method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(someProduct)
                });
            } else {
                fetch(`http://localhost:3000/product/${someProduct.id}`, {
                    method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(someProduct)
                });
            }
        }
    });
    whichTask.insertBefore(editProduct, whichTask.children[3]);
    whichTask.removeChild(whichTask.children[2]);
}

function AddNewLine(e) {
    let product = document.createElement('div');
    product.classList.add('draggable', 'grid-item');
    product.value = productsList.children[productsList.children.length - 2].value + 1;
    let reorder = document.createElement('i');
    reorder.classList.add('fa', 'fa-reorder', 'drag');
    reorder.addEventListener('mousedown', (e) => {
        rightPlace = true;
        product.draggable = true;
    });
    product.appendChild(reorder);
    let span = document.createElement('span');
    span.textContent = 'hey';
    let check = document.createElement('input');
    check.type = 'checkbox';
    check.classList.add('pointer');
    check.addEventListener('change', () => {
        if (check.checked && product.children[2].tagName == 'SPAN') {
            product.children[2].classList.add('checked');
        } else {
            product.children[2].classList.remove('checked');
        }
    });
    product.appendChild(check);
    product.appendChild(span);
    let set = document.createElement('i');
    set.classList.add('fa', 'fa-ellipsis-v', 'pointer');
    set.addEventListener('click', showSettings);
    product.appendChild(set);
    product.addEventListener('dragstart', (e) => {
        if (rightPlace) product.classList.add('dragging');
    });

    product.addEventListener('dragend', (e) => {
        product.classList.remove('dragging');
        rightPlace = false;
        product.draggable = false;
    });
    productsList.insertBefore(product, e.target.parentElement);
    whichTask = product;
    edit(whichTask, 'new');
    draggables = document.querySelectorAll(".draggable");
}