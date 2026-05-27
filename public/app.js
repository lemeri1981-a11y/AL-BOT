function enterApp(){
document.getElementById("loginScreen").style.display="none";
}

function send(){
const input=document.getElementById("input");
const msg=input.value;
if(!msg) return;

document.getElementById("messages").innerHTML +=
"<div class='msg user'>"+msg+"</div>";

input.value="";
}
