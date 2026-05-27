function newChat(){
  document.getElementById('messages').innerHTML='';
}

function send(){
  const input = document.getElementById('input');
  const text = input.value.trim();
  if(!text) return;

  document.getElementById('messages').innerHTML += `<div class="msg user">${text}</div>`;
  document.getElementById('messages').innerHTML += `<div class="msg ai">Demo reply</div>`;
  input.value='';
}
