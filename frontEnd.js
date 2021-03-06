let rightPlace = false;
let whichTask;
let highestID = 0;
let elementOrder;
let prevElement;
const root = document.querySelector("#root")
const productsList = document.createElement('div');

let draggables = document.querySelectorAll(".draggable");;
let containers = document.querySelector(".container");

(function showList() {
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
                console.log(elementOrder);
                fetch(`http://localhost:3000/product/${draggable.value}`, {
                    method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: elementOrder })
                }).then(() => {
                    draggable.key = elementOrder;
                });
                fetch(`http://localhost:3000/product/${prevElement.value}`, {
                    method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: prevElement.key + 1 })
                }).then(() => {
                    prevElement.key++;
                });
            });
        });
        containers.addEventListener('dragover', (e) => {
            if (!rightPlace) return;
            e.preventDefault();
            const afterElement = getDragAfterElement(containers, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                containers.insertBefore(draggable, document.querySelector('.add'));
                elementOrder += 2
            } else {
                containers.insertBefore(draggable, afterElement);
                elementOrder = afterElement.key - 1;
                prevElement = afterElement;
            }
        });
    });
})();


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
        highestID = element.id > highestID ? element.id : highestID;
        let product = document.createElement('div');
        product.classList.add('draggable', 'grid-item');
        product.value = element.id;
        product.key = element.order;
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
        if (productsList.children.length == 0) {
            productsList.appendChild(product);
        }
        for (let i = 0; i < productsList.children.length; i++) {
            const prev = productsList.children[i];
            if (product.key < prev.key) {
                productsList.insertBefore(product, prev);
                break;
            } else if (i === productsList.children.length - 1) {
                productsList.appendChild(product);
            }
        }

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
    console.log(highestID);
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
        if (e.key == 'Enter' && editProduct.value !== '') {
            let final = document.createElement('span');
            final.textContent = editProduct.value;
            whichTask.insertBefore(final, whichTask.children[3]);
            whichTask.removeChild(whichTask.children[2]);
            whichTask.children[1].checked = false;
            if (which == 'edit') {
                fetch(`http://localhost:3000/product/${whichTask.value}`, {
                    method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: final.textContent, id: whichTask.value })
                });
            } else {
                fetch(`http://localhost:3000/product/${highestID + 1}`, {
                    method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: final.textContent, id: highestID + 1, order: (highestID + 1) * 1000 })
                }).then(() => {
                    highestID++;
                    console.log(highestID);
                });
            }
        }
    });
    whichTask.insertBefore(editProduct, whichTask.children[3]);
    editProduct.focus();
    whichTask.removeChild(whichTask.children[2]);
}

function AddNewLine(e) {
    let value;
    if (productsList.children.length > 1) {
        if (productsList.children[productsList.children.length - 2].children[2].tagName !== 'SPAN') return;
        value = highestID;
    } else {
        value = 0;
    }
    let product = document.createElement('div');
    product.classList.add('draggable', 'grid-item');
    product.value = value + 1;
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