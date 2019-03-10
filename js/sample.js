document.addEventListener('DOMContentLoaded', function() {
    let listNumber = new List();
});

function List() {
    let btn = document.querySelector('#btn');
    let list = document.querySelector('#ul');
    let listItems = list.querySelectorAll('li');

    listCount(listItems);

    btn.addEventListener('click', function() {
        addItem('./item.html', list);
    });

    function listCount(items) {
        for(let i = 0; i < items.length; i++) {
            items[i].innerHTML = i + 1 + " " + items[i].innerHTML;
        }
    }

    function addItem(address, holder) {
        let request = new XMLHttpRequest();
        request.open('GET', address);
        request.send();
        request.addEventListener('readystatechange', function() {
            if(request.readyState == 4 && request.status == 200) {
                let newItem = request.responseText;
                holder.insertAdjacentHTML('beforeend', newItem);
            }
        });
    }
}