function enterApp(){
  document.getElementById("loginScreen").style.display="none";
}

function newChat(){
  document.getElementById("messages").innerHTML="";
}

async function send(){
  const input=document.getElementById("input");
  const text=input.value.trim();
  if(!text) return;

  document.getElementById("messages").innerHTML +=
    `<div class='msg user'>${text}</div>`;

  // demo AI response
  document.getElementById("messages").innerHTML +=
    `<div class='msg ai'>Demo AI reply</div>`;

  input.value="";
}
