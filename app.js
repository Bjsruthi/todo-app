const DEFAULT_TASKS = ["Yoga", "Exercise", "Code Daily"];
const today = new Date().toDateString();

let data = JSON.parse(localStorage.getItem("todos")) || {};
let streak = Number(localStorage.getItem("streak")) || 0;
let lastWin = localStorage.getItem("lastWin");

if(!data[today]){
const prev = Object.keys(data).pop();
data[today] = prev ? data[prev].map(t=>({name:t.name,done:false})) :
DEFAULT_TASKS.map(t=>({name:t,done:false}));
save();
}

function save(){
localStorage.setItem("todos",JSON.stringify(data));
localStorage.setItem("streak",streak);
localStorage.setItem("lastWin",lastWin);
}

function render(){
const list=document.getElementById("taskList");
list.innerHTML="";

data[today].forEach((t,i)=>{
const li=document.createElement("li");
li.innerHTML=`
<div class="task-left">
<input type="checkbox" ${t.done?"checked":""} onchange="toggle(${i})">
<span class="${t.done?"done":""}">${t.name}</span>
</div>
<div class="actions">
<button onclick="edit(${i})">✏️</button>
<button onclick="del(${i})">🗑</button>
</div>`;
list.appendChild(li);
});

updateProgress();
document.getElementById("streak").innerText=`🔥 ${streak}`;
}

function addTask(){
const v = taskInput.value.trim();
if(!v) return;
data[today].push({name:v,done:false});
taskInput.value="";
save();render();
}

function toggle(i){
data[today][i].done=!data[today][i].done;
save();render();
}

function del(i){
data[today].splice(i,1);
save();render();
}

function edit(i){
const n=prompt("Edit",data[today][i].name);
if(n){data[today][i].name=n;save();render();}
}

function updateProgress(){
const total=data[today].length;
const done=data[today].filter(t=>t.done).length;
const percent=Math.round(done/total*100)||0;

document.getElementById("percent").innerText=percent+"%";

const ring=document.getElementById("progressRing");
ring.style.strokeDashoffset=314-(314*percent/100);

ring.style.stroke= percent<50?"#0E21A0":percent<90?"#B153D7":"#F375C2";

if(percent===100) win();
}

// function win(){
// if(lastWin!==today){
// streak++;
// lastWin=today;
// save();
// }

// document.getElementById("star").style.transform="translate(-50%,-50%) scale(1)";
// setTimeout(()=>document.getElementById("star").style.transform="translate(-50%,-50%) scale(0)",1500);
// }
function win(){
if(lastWin!==today){
streak++;
lastWin=today;
save();
}

const star=document.getElementById("star");
star.classList.add("star-show");

setTimeout(()=>star.classList.remove("star-show"),1200);
}


render();
