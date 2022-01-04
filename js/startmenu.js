$id('start-button').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.start-menu').classList.toggle("show")
}, !1)

document.addEventListener('click', function(e) {
  if (!e.target.closest('.start-menu') && !e.target.closest('#start-button')) {
    document.querySelector('.start-menu').classList.remove("show")
  }
  if (!e.target.closest('.window') && !e.target.closest('.item')) {
    makeItFocused()
  }
}, !1)

/* handle clicked app and then close start menu*/


document.querySelector('.status-bar-arrow').addEventListener('click',function(e) {
  let status_icons = document.querySelector('.status-bar-notifications').querySelectorAll('.hideable');
  status_icons.forEach(function(a){
    a.classList.toggle('hide')
  });
  this.classList.toggle('reverse')
},!1)


const clock = () => {
  var date = new Date(),
      hhmm = date.toLocaleTimeString('fr-FR', {hour: '2-digit',minute: '2-digit'}),
      ymd = date.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $id('time').innerHTML = hhmm;
  $id('time').setAttribute('title', ymd)
};
setInterval(clock, 1000);