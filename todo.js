const inputHandler = {
    set(target, prop, value) {
        target[prop] = value;

        taskListProxy.value = value;
        return true;
    }
}

const taskHandler = {
    get(target, prop) {
        console.log('get', target, prop);
        if (prop === "tasks") {
            const taskList = target[prop];
            return taskList;
        }

        return [];
    },

    set(target, prop, value) {
        if (prop === "tasks") {
            target[prop] = value;
            target.tasks = value;
            return true;
        }

        target[prop] = value;
        target.tasks.push(value);
        return true;
    }
}
const doneHandler = {
    get(target, prop) {
        console.log('get', target, prop);
        if (prop === "tasks") {
            const doneList = target[prop];
            return doneList;
        }

        return [];
    },
    set(target, prop, value) {
        if (prop === "tasks") {
            target[prop] = value;
            target.tasks = value;
            return true;
        }

        target[prop] = value;
        target.tasks.push(value);
        return true;
    }
}

const inputProxy = new Proxy({ value: "" }, inputHandler);
const taskListProxy = new Proxy({ value: "", tasks: [] }, taskHandler);
const doneListProxy = new Proxy({ value: "", tasks: [] }, doneHandler);
const ul = document.getElementById('content');

function renderTasks(tasks) {

    ul.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add('contentLi')
        li.textContent = `${index + 1}` + '. ' + task;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.textContent = 'Delete';

        const doneBtn = document.createElement('button');
        doneBtn.classList.add('doneBtn');
        doneBtn.textContent = 'Done';

        doneBtn.addEventListener('click', () => doneFunc(index));
        deleteBtn.addEventListener('click', () => delFunc(index));

        li.appendChild(deleteBtn);
        li.appendChild(doneBtn);

        ul.insertAdjacentElement('beforeend', li)
    });


}

function delFunc(index) {
    const list = taskListProxy.tasks;
    const filterList = list.filter((v, i) => i !== index);
    taskListProxy.tasks = filterList;
    renderTasks(filterList)
}

function doneFunc(index) {
    const list = taskListProxy.tasks;
    const doneList = doneListProxy.tasks

    delFunc(index)

    // const doneList = list.sort((v, i) => i === index);
    // if (index >= 0 && index < taskListProxy.tasks.length) {
    //     const item = taskListProxy.tasks.splice(index, 1)[0];
    //     doneListProxy.tasks.push(item);
    //     console.log(item);
    // } else {
    //     console.log('error');
    // }
    doneList.push(list[index])

    const doneUl = document.getElementById('doneContent');
    doneUl.innerHTML = "";
    doneList.forEach((val, i) => {
        const liElement = document.createElement("li");
        const revButton = document.createElement('button')
        revButton.textContent = 'revert';
        revButton.classList.add('doneBtn');
        liElement.textContent = `${i + 1}` + '. ' + val
        liElement.appendChild(revButton)
        doneUl.appendChild(liElement)
        revButton.addEventListener('click', () => {
            list.push(doneList[i])
            const filteredList = doneList.filter((val, index) => index !== i)
            doneListProxy.tasks = filteredList
            renderTasks(list)
            // doneUl.innerHTML = "";
            // for (const item of doneList) {
            //     const liElement = document.createElement("li");
            //     liElement.textContent = `${i + 1}` + '. ' + item;
            //     doneUl.appendChild(liElement);
            //     liElement.appendChild(revButton);

            // }

            console.log("🚀 ~ revButton.addEventListener ~ list:", list)
            console.log("🚀 ~ revButton.addEventListener ~ doneList:", doneList)
        })

    })
}



const todoInput = document.getElementById('input');
const addBtn = document.getElementById('btn');
addBtn.addEventListener('click', () => {
    const task = todoInput.value.trim();
    if (task !== '') {
        inputProxy.value = input.value;
        const list = taskListProxy.tasks;
        renderTasks(list)
        todoInput.value = ""
    }
});

todoInput.addEventListener('keyup', function (e) {
    const task = todoInput.value.trim();
    if (e.keyCode === 13 && task !== '') {
        inputProxy.value = input.value;
        const list = taskListProxy.tasks;
        renderTasks(list)
        todoInput.value = ""
    }
})
// const input = document.querySelector('input');
// const btn = document.querySelector('#btn');

// btn.onclick = () => {
//     inputProxy.value = input.value;
//     const list = taskListProxy.tasks;
//     console.log(list);
// };