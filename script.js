// Columns and Dragbars
let isLeftDragging = false;
let isRightDragging = false;

function ResetColumnSizes() {
  // when page resizes return to default col sizes
  let page = document.getElementById("pageFrame");
  page.style.gridTemplateColumns = "2fr 6px 6fr 6px 2fr";
}

function SetCursor(cursor) {
  let page = document.getElementById("page");
  page.style.cursor = cursor;
}

function StartLeftDrag() {
  // console.log("mouse down");
  isLeftDragging = true;

  SetCursor("ew-resize");
}

function StartRightDrag() {
  // console.log("mouse down");
  isRightDragging = true;

  SetCursor("ew-resize");
}

function EndDrag() {
  // console.log("mouse up");
  isLeftDragging = false;
  isRightDragging = false;

  SetCursor("auto");
}

function OnDrag(event) {
  if (isLeftDragging || isRightDragging) {
    // console.log("Dragging");
    //console.log(event);

    let page = document.getElementById("page");
    let leftcol = document.getElementById("leftcol");
    let rightcol = document.getElementById("rightcol");

    let leftColWidth = isLeftDragging ? event.clientX : leftcol.clientWidth;
    let rightColWidth = isRightDragging ? page.clientWidth - event.clientX : rightcol.clientWidth;

    let dragbarWidth = 6;

    let cols = [
      leftColWidth,
      dragbarWidth,
      page.clientWidth - (2 * dragbarWidth) - leftColWidth - rightColWidth,
      dragbarWidth,
      rightColWidth
    ];

    let newColDefn = cols.map(c => c.toString() + "px").join(" ");

    // console.log(newColDefn);
    page.style.gridTemplateColumns = newColDefn;

    event.preventDefault()
  }
}


// Decision Maker

const tagsEl = document.getElementById('tags')
const textarea = document.getElementById('textarea')

textarea.focus()

textarea.addEventListener('keyup', (e) => {
    createTags(e.target.value)

    if (e.key === 'Enter') {
        setTimeout(() => {
            e.target.value
        }, 10)

        randomSelect()
    }
})

function createTags(input) {
    const tags = input.split(',').filter(tag => tag.trim()
        !== '').map(tag => tag.trim())

    tagsEl.innerHTML = ''

    tags.forEach(tag => {
        const tagEl = document.createElement('span')
        tagEl.classList.add('tag')
        tagEl.innerText = tag
        tagsEl.appendChild(tagEl)
    })

}

function randomSelect() {
    const times = 30

    const interval = setInterval(() => {
        const randomTag = pickRandomTag()

        highlightTag(randomTag)

        setTimeout(() => {
            unHighlightTag(randomTag)
        }, 100)
    }, 100);

    setTimeout(() => {
        clearInterval(interval)
        
        setTimeout(() => {
            const randomTag = pickRandomTag()

            highlightTag(randomTag)
        }, 100)

    }, times * 100)

}

function pickRandomTag() {
    const tags = document.querySelectorAll('.tag')
    return tags[Math.floor(Math.random() * tags.length)]
}

function highlightTag(tag) {
    tag.classList.add('highlight')
}

function unHighlightTag(tag) {
    tag.classList.remove('highlight')
}

// Theme Clock

const hourEl = document.querySelector('.hour');
const minuteEl = document.querySelector('.minute');
const secondEl = document.querySelector('.second');
const timeEl = document.querySelector('.time');
const dateEl = document.querySelector('.date');
const toggle = document.querySelector('.toggle');

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//Function for Theme Changing Button
toggle.addEventListener('click', (e) => {
    const html = document.querySelector('html');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        e.target.innerHTML = '🌜';
    } else {
        html.classList.add('dark');
        e.target.innerHTML = '🌞';
    }
})

function setTime() {
    const time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hours = time.getHours();
    let hoursForClock = hours;
    //This if statement is for standard time, and can be commented out for military time. 
    if (hours > 12) {
        hoursForClock = hours - 12;
    }
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const ampm = hours > 11 || hours < 24 ? 'PM' : 'AM';

    //Utility Function: maps one range of numbers to another range of numbers.
    const scale = (num, in_min, in_max, out_min, out_max) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hoursForClock, 0, 12, 0, 360)}deg)`;
    minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(minutes, 0, 60, 0, 360)}deg)`;
    secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(seconds, 0, 60, 0, 360)}deg)`;
    //without seconds use this line
    timeEl.innerHTML = `${hoursForClock}:${minutes} ${ampm}`;
    //with seconds use this line
    // timeEl.innerHTML = `${hoursForClock}:${minutes}:${seconds} ${ampm}`;
    dateEl.innerHTML = ` ${days[day]}, ${months[month]} <span class="circle">${date}</span> ${year} `;

}

setTime();

setInterval(setTime, 1000);

//ToDo List

const form =document.getElementById('form')
const input =document.getElementById('input')
const todosUL =document.getElementById('todos')

const todos = JSON.parse(localStorage.getItem('todos'))

if(todos) {
    todos.forEach(todo => addTodo(todo))
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    addTodo()
})

function addTodo(todo) {
    let todoText = input.value

    if(todo) {
        todoText = todo.text
    }

    if(todoText) {
        const todoEl = document.createElement('li')
        if(todo && todo.completed) {
            todoEl.classList.add('completed')
        }

        todoEl.addEventListener('click', () => {
            todoEl.classList.toggle('completed')
            updateLS()
        })
        
        todoEl.addEventListener('contextmenu', (e) => {
            e.preventDefault()

            todoEl.remove()
            updateLS()
        })

        todoEl.innerText = todoText

        todosUL.appendChild(todoEl)

        input.value = ''

        updateLS()
    }
}

function updateLS() {
    const todosEl = document.querySelectorAll('li');

    const todos = []

    todosEl.forEach(todoEl => {
     todos.push({
         text: todoEl.innerText,
         completed: todoEl.classList.contains('completed')
        })
    })

    localStorage.setItem('todos', JSON.stringify(todos))
}