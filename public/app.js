let language="sq";
let currentChat=null;
let chats={};

function setLang(l){
language=l;
document.getElementById("langText").innerText=
l==="sq"?"Zgjidh gjuhën":"Choose language";
}

function enterApp(){
document.getElementById("loginScreen").style.display="none";
}

function newChat(){
currentChat="chat_"+Date.now();
chats[currentChat]=[];
document.getElementById("messages").innerHTML="";
}

function send(){
let input=document.getElementById("input");
let text=input.value.trim();
if(!text)return;

add(text,"user");

fetch("/api/chat",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({message:text,language})
})
.then(r=>r.json())
.then(d=>{
add(d.reply,"ai");
});

input.value="";
}

function add(t,type){
let div=document.createElement("div");
div.className="msg "+type;
div.innerText=t;
document.getElementById("messages").appendChild(div);
}
