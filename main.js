'use strict';

const themeBtn = document.querySelector('.theme-icon');
const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme;
const taskWrapper = document.querySelector('.added-task-wrapper');
const middleMobile = document.querySelector('.middle__mobile');
const deleteBtns = document.querySelectorAll('.delete-btn');
const taskItems = document.querySelectorAll('.task-added');

document.documentElement.setAttribute('data-theme', savedTheme);
themeBtn.setAttribute('aria-pressed', savedTheme === "light");
if(savedTheme === "dark"){
    darkElements()
}if(savedTheme === "light"){
    lightElements();
}  

function darkElements(){
taskWrapper.classList.add('added-task-wrapper__dark');
middleMobile.classList.add('added-task-wrapper__dark');
deleteBtns.forEach((deleteBtn)=>{
    deleteBtn.classList.add('delete-btn__dark');
})
}

function lightElements(){
taskWrapper.classList.remove('added-task-wrapper__dark');
middleMobile.classList.remove('added-task-wrapper__dark');
deleteBtns.forEach((deleteBtn)=>{
    deleteBtn.classList.remove('delete-btn__dark');
});
}

themeBtn.addEventListener('click',()=>{
    themeBtn.classList.toggle('theme-icon-sun');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === "dark" ? "light" : "dark";
        if(newTheme === "dark"){
            darkElements();
        }else{
            lightElements();
        }

// --- update theme ---


document.documentElement.setAttribute('data-theme', newTheme);
localStorage.setItem('theme', newTheme);

themeBtn.setAttribute('aria-pressed', newTheme === "dark");
});

// --- create new task ---

const inputField = document.querySelector('input');
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const taskText = inputField.value.trim();
        if (taskText !== '') {
            const newTask = document.createElement('li');
            newTask.classList.add('task-added');
            newTask.innerHTML = `
           <div class="check-text"><div class="empty-check-mark"></div>${taskText}</div><div class="delete-btn hide"></div>`;
           
           const activeTab = document.querySelector('.control__text .control__active');

            taskWrapper.insertBefore(newTask, taskWrapper.firstChild);
           

            if(activeTab && activeTab.textContent.toLowerCase() === 'Completed'){
                newTask.style.display = 'none';
            } else {
                newTask.style.display = 'flex';
            }

            inputField.value = '';
            updateItemsNumber();

        }
    }
});

// --- check and delete task ---

taskWrapper.addEventListener('click', (e) => {
    if(e.target.classList.contains('empty-check-mark')|| e.target.classList.contains('checked')){
        const checkBtn = e.target;
        const taskItem = checkBtn.closest('.task-added');
        checkBtn.classList.toggle('checked');
        taskItem.classList.toggle('task-deleted');
        updateItemsNumber();
    } else if (e.target.classList.contains('delete-btn')) {
        const taskItem = e.target.closest('.task-added');
        taskItem.classList.add('task-deleted');
        taskItem.remove();
        updateItemsNumber();
 }
 });



// --- tab switcing ---

const controlTabs = document.querySelectorAll('.control__text');

controlTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        controlTabs.forEach((tab) => {
            tab.classList.remove('control__active');
        });
        tab.classList.add('control__active');

        const currentTaskItems = document.querySelectorAll('.task-added');

        currentTaskItems.forEach((taskItem) => {
const isCompleted = taskItem.classList.contains('task-deleted');
        if(index === 0){
                taskItem.style.display = 'flex';
            }else if (index === 1){
            taskItem.style.display = isCompleted ? 'none' : 'flex';
        }else if (index === 2){
            taskItem.style.display = isCompleted ? 'flex' : 'none';
                    }    
                });
            updateItemsNumber();
            });
        });

            

    // --- mobile tab switching ---

    const controlTabsMobile = document.querySelectorAll('.control__text-mobile');


controlTabsMobile.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        controlTabsMobile.forEach((tab) => {
            tab.classList.remove('control__active');
        });
        tab.classList.add('control__active');

        const currentTaskItems = document.querySelectorAll('.task-added');

        currentTaskItems.forEach((taskItem) => {
const isCompleted = taskItem.classList.contains('task-deleted');
        if(index === 0){
                taskItem.style.display = 'flex';
            }else if (index === 1){
            taskItem.style.display = isCompleted ? 'none' : 'flex';
        }else if (index === 2){
            taskItem.style.display = isCompleted ? 'flex' : 'none';
                    }    
                });
            updateItemsNumber();
            });
        });
    
//   

    // --- clear completed ---

    const clearBtn = document.querySelector('.clear');
    const checkedBtns = document.querySelectorAll('.checked'); 

    clearBtn.addEventListener('click', () => {
        const currentTaskItems = document.querySelectorAll('.task-added');
        currentTaskItems.forEach((taskItem) => {
            if (taskItem.classList.contains('task-deleted')) {
                taskItem.classList.remove('task-deleted');
                const btn = taskItem.querySelector('.checked');
                if (btn) {
                    btn.classList.remove('checked');
                    btn.classList.add('empty-check-mark');
                }
            }
        });
                 
        updateItemsNumber();
        });
      

            // --- items left ---

            const itemNumber = document.querySelector('.number');
            
            function updateItemsNumber(){
                const latestTaskItems = document.querySelectorAll('.task-added');
                let remaing = 0;
                latestTaskItems.forEach(task=>{
                    const isCompleted = task.classList.contains('task-deleted');
  
                    if(!isCompleted){
                        remaing++;
                    }
                });
                if(itemNumber){
                    itemNumber.textContent = remaing;
                }
            }


            // --- drag and drop---

            const allTaskItems = document.querySelectorAll('.task-added');
            const ulElement = document.querySelector('.added-task-wrapper ul');

            function dragAfterELement(container,  y){
                const draggableElements = [...container.querySelectorAll('.task-added:not(.dragging)')];
                return draggableElements.reduce((closest, child)=>{
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if(offset < 0 && offset > closest.offset){
                        return {offset: offset, element: child};
                    }else{
                        return closest;
                    }
                }, {offset: Number.NEGATIVE_INFINITY}).element;
            }

          function attachDragEvents(taskItem){
            taskItem.addEventListener('dragstart', () => {
                taskItem.classList.add('dragging');
            });

            taskItem.addEventListener('dragend', () => {
                taskItem.classList.remove('dragging');
            });
          }

          allTaskItems.forEach(taskItem=>{
            attachDragEvents(taskItem);
          });

          ulElement.addEventListener('dragover', (e)=>{
            e.preventDefault();
            const afterElement = dragAfterELement(ulElement, e.clientY);
            const dragging = document.querySelector('.dragging');
            if(afterElement == null){
                ulElement.appendChild(dragging);
            }else{
                ulElement.insertBefore(dragging, afterElement);
            }
          });

            updateItemsNumber();