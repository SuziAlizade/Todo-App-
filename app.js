class TodoList {
  constructor() {
    this.observers = [];
    this.tasks = [];
    this.doneTasks = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify() {
    this.observers.forEach(observer => observer.update({
      tasks: this.tasks,
      doneTasks: this.doneTasks,
    }));
  }

  addTask(task) {
    this.tasks.push(task);
    this.notify();
  }

  addDoneTask(task) {
    this.doneTasks.push(task);
    this.notify();
  }

  removeTask(index) {
    this.tasks.splice(index, 1);
    this.notify();
  }
}

// Observer
class TodoListView extends TodoList {
  constructor() {
    super();
    this.todoList = document.getElementById('content');
    this.addObserver(this);
  }

  update(tasks) {
    this.renderTasks(tasks);
  }


  delFunc(index) {
    this.removeTask(index);
  }

  doneFunc(task, index) {
    this.addDoneTask(task);
    this.removeTask(index)
    const doneUl = document.getElementById('doneContent')
    doneUl.innerHTML = "";
    this.doneTasks.forEach((val, i) => {
      const liElement = document.createElement("li");
      liElement.textContent = `${i + 1}` + '. ' + val 

      doneUl.insertAdjacentElement('beforeend', liElement);
    })
  }

  renderTasks({tasks, doneTasks}) {
    this.todoList.innerHTML = '';
    
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}` + '. ' + task;
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('deleteBtn');
      deleteBtn.textContent = 'Delete';
      const doneBtn = document.createElement('button');

      doneBtn.classList.add('doneBtn');
      doneBtn.textContent = 'Done';
      doneBtn.addEventListener('click', () => this.doneFunc(task, index));
      deleteBtn.addEventListener('click', () => this.delFunc(index));

      const ul = document.getElementById('content')
      li.appendChild(deleteBtn);
      li.appendChild(doneBtn);
      this.todoList.appendChild(li);
    });
  }

}

const todoListView = new TodoListView();

const todoInput = document.getElementById('input');
const addBtn = document.getElementById('btn');

addBtn.addEventListener('click', () => {
  const task = todoInput.value.trim();
  if (task !== '') {
    todoListView.addTask(task);
    todoInput.value = '';
  }
});

todoInput.addEventListener('keyup', function (e) {
  const task = todoInput.value.trim();
  if (e.keyCode === 13 && task !== '') {
    todoListView.addTask(task);
    todoInput.value = '';
  }
})
