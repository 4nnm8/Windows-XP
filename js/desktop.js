
var copiedIcons = [],
    isCutFile = false,
    currentZIndex = 10;

const
htmlRoot = document.documentElement,
parent = (p,e) => {
  return e.target.closest(p)
},
getURLParameter = (p,q) => {
  return new URLSearchParams(window.location.search).get(p);
},
clock = () => {
  setInterval(() => {
    let d = new Date(),
        t = $id('time');
        hm = d.toLocaleTimeString('fr-FR', {hour: '2-digit',minute: '2-digit'}),
        ymd = d.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    t.innerHTML = hm;
    t.setAttribute('title', ymd);
  }, 1000);
},
resizeWindowToFitContent = (appId) => {
  let a = $id(appId), b = a.querySelector('iframe');
  a.style.width = b.contentWindow.document.body.offsetWidth + 8 + "px";
  a.style.height =  b.contentWindow.document.body.offsetHeight + 34 + "px";
},
makeItFocused = (a) => {
  document.querySelectorAll('.window').forEach(function(b) {
    b !== a && b.classList.add('inactive');
  });
  a && (
    a.classList.remove('inactive'),
    a.style.zIndex = '' + ++currentZIndex,
  	a.querySelector('iframe') && a.querySelector('iframe').focus()
  );
},
openWindow = (el) => {
  var appId = el.getAttribute('data-app');
  if (el.classList.contains('opened')) {
    $id(appId).classList.remove('hide')
    makeItFocused($id(appId));
    return false;
  } else {
    el.classList.add('opened');
  }
  document.body.style.cursor = 'url(cursors/wait.cur), wait';
  var appName = el.getAttribute('data-appname'),
      appUrl = el.getAttribute('data-url') || `apps/${appId}/index.html`,
      appImg = file_img[appId+'_16'],


       // A MODIFIER !!!!!!!!!!!!
       appOptions = el.getAttribute('data-options') || false,
       default_option = {
       	 width: '70vw',
       	 height: '50vh',
       	 top: '25vh',
       	 left: '15vw',
       	 resizable: 'true'
       },
       options;

       if (appOptions) {
       	 let regex = '{'+appOptions.replace(/([a-z]+):([a-z0-9]+)(,)?/gi,'"$1":"$2"$3')+'}'
         options = JSON.parse(regex)
       } else {
       	options = default_option
       }
      // A MODIFIER !!!!!!!!!!!!

  let n_window = document.createElement('div');
  n_window.setAttribute('class','window');
  n_window.setAttribute('id',appId);
  "false" == options.resizable && n_window.classList.add('unresizable');
  Object.assign(n_window.style, {
    display: 'none',
    zIndex: currentZIndex + 1,
    width: options.width,
    height: options.height,
    top: options.top,
    left: options.left
  });
  n_window.addEventListener('mousedown', function(){
    makeItFocused(n_window);
  })

  let n_titlebar = document.createElement('div');
  n_titlebar.className = 'title-bar';
  n_titlebar.addEventListener('dblclick', function(e) {
    let p = this.closest('.window');
    if (!p.classList.contains('unresizable')) {
      if (p.classList.contains('maximize')) {
        restore(p)
      } else {
        maximize(p)
      }
    }
  });
  n_titlebar.addEventListener('click', function(e) {
    let p = this.closest('.window'),
        q = e.target.getAttribute('aria-label');
    switch (q) {
      case "Maximize" : maximize(p); break;
      case "Minimize" : minimize(p); break;
      case "Restore" : restore(p); break;
      case "Close" : close(p); break;
    }
  });
  n_titlebar.innerHTML = `<div class="title-bar-text"><img src="${appImg}" title="${appName}" /> ${appName}</div>\
    <div class="title-bar-controls">\
      <button aria-label="Minimize"></button>\
      <button aria-label="Maximize"></button>\
      <button aria-label="Close"></button>\
  </div>`

  n_window.appendChild(n_titlebar);

  let taskbar_item = document.createElement('div');
  taskbar_item.setAttribute('class', 'taskbar-app');
  taskbar_item.setAttribute('data-app', appId);
  taskbar_item.setAttribute('tabindex', '0');
  taskbar_item.innerHTML = `<div><img src="${appImg}" alt="${appName}" /></div><div>${appName}</div>`;
  taskbar_item.addEventListener('click', function(e){

    if (e.button === 2) {
      taskbarItemContextMenu(e,this);
    } else if (e.button === 0) {
      if ($id(appId).classList.contains('hide')) {
        playAudio('restore');
        $id(appId).style.zIndex = '' + ++currentZIndex;
        $id(appId).classList.remove('hide');
        $id(appId).classList.remove('inactive');
        $id(appId).querySelector('iframe').focus();
        makeItFocused(n_window);
      } else if ($id(appId).classList.contains('inactive')) {
        makeItFocused($id(appId));
      } else {
        playAudio('minimize')
        $id(appId).classList.add('hide');
      }
    }
  },!1);

  let iframe = document.createElement('iframe');
  iframe.src = appUrl;
  n_window.appendChild(iframe);
  $id('desktop-area').appendChild(n_window);
  iframe.addEventListener('load', function() {
    //resizeWindowToFitContent(appId);
    initDragWindow(n_window);
    if (!el.classList.contains('unresizable')) initResizeWindow(n_window);
    n_window.style.display = '';
    document.body.style.cursor = '';
    $id('taskbar-apps').appendChild(taskbar_item);
    makeItFocused(n_window);
    $id(appId).querySelector('iframe').focus();
  });
},
maximize = (a) => {
  a.classList.add('maximize');
  a.querySelector('[aria-label=Maximize]').setAttribute('aria-label', 'Restore')
},
restore = (a) => {
  a.classList.remove('maximize');
  a.querySelector('[aria-label=Restore]').setAttribute('aria-label', 'Maximize');
  playAudio('restore')
},
minimize = (a) => {
  a.classList.add('hide');
  playAudio('minimize')
},
close = (a) => {
  $id('taskbar-apps').querySelector('[data-app="' + a.id + '"]').remove();
  document.querySelectorAll('.icon').forEach(function(b){
    if (b.getAttribute('data-app') == a.id) {
      b.classList.remove('opened')
    }
  });
  a.remove();
},
initDragWindow = (w) => {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0,
      iframe = w.querySelector('iframe') || false;
  const elementDrag = () => {
    iframe && (iframe.style.pointerEvents = 'none');
    pos1 = pos3 - mousex;
    pos2 = pos4 - mousey;
    pos3 = mousex;
    pos4 = mousey;
    w.style.top = w.offsetTop - pos2 + 'px';
    w.style.left = w.offsetLeft - pos1 + 'px';
  },
  closeDragElement = () => {
    iframe && (iframe.style.pointerEvents = '');
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
  },
  dragMouseDown = () => {
    pos3 = mousex;
    pos4 = mousey;
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', closeDragElement);
  }
  w.querySelector('.title-bar').addEventListener('mousedown', dragMouseDown);
},
initResizeWindow = (win) => {
  var startX, startY, startWidth, startHeight,
      right = document.createElement('div'),
      bottom = document.createElement('div'),
      both = document.createElement('div')
      iframe = win.querySelector('iframe');

  function initDragRight(e) {
    iframe && (iframe.style.pointerEvents = 'none');
    startX = mousex;
    startWidth = parseInt(document.defaultView.getComputedStyle(win).width, 10);
    htmlRoot.addEventListener('mousemove', doDrag, false);
    htmlRoot.addEventListener('mouseup', stopDrag, false);
  }
  function initDragBottom(e) {
    iframe && (iframe.style.pointerEvents = 'none');
    startY = mousey;
    startHeight = parseInt(document.defaultView.getComputedStyle(win).height, 10);
    htmlRoot.addEventListener('mousemove', doDrag, false);
    htmlRoot.addEventListener('mouseup', stopDrag, false);
  }
  function initDragBoth(e) {
    iframe && (iframe.style.pointerEvents = 'none');
    startX = mousex;
    startY = mousey;
    startWidth = parseInt(document.defaultView.getComputedStyle(win).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(win).height, 10);
    htmlRoot.addEventListener('mousemove', doDrag, false);
    htmlRoot.addEventListener('mouseup', stopDrag, false);
  }
  function doDrag() {
    win.style.height = startHeight + mousey - startY + 'px';
    win.style.width = startWidth  + mousex - startX + 'px';
  }
  function stopDrag() {
    iframe && (iframe.style.pointerEvents = '');
    htmlRoot.removeEventListener('mousemove', doDrag, false);
    htmlRoot.removeEventListener('mouseup', stopDrag, false);
  }
  right.className = 'resizer-right';
  bottom.className = 'resizer-bottom';
  both.className = 'resizer-both';
  win.appendChild(right);
  win.appendChild(bottom);
  win.appendChild(both);
  right.addEventListener('mousedown', initDragRight, false);
  bottom.addEventListener('mousedown', initDragBottom, false);
  both.addEventListener('mousedown', initDragBoth, false);
},
stickToAlert = (e) => {
  let alert = document.querySelector('.alert');
  alert.style.animation = 'blink .2s step-start 0s 4';
  setTimeout(function(){
    alert.style.animation = '';
    makeItFocused(alert);
  },800);
},
throwAlert = (title, content, icon, fallbackyes, fallbackno) => {
    document.activeElement.blur();
    let n_alert_container = document.createElement('div');
    n_alert_container.className = 'alert-container';

    let n_window = document.createElement('div');
    n_window.setAttribute('class','window alert unresizable');
    n_alert_container.appendChild(n_window);

    let n_titlebar = document.createElement('div');
    n_titlebar.className = 'title-bar';
    n_titlebar.innerHTML = '<div class="title-bar-text"> <img src="'+getIconImg(icon,16)+'" alt="" /> '+title+'</div><div class="title-bar-controls"><button id="but_close" aria-label="Close"></button></div>'
    n_window.appendChild(n_titlebar);

    let n_window_body = document.createElement('div');
    n_window_body.className = 'window-body';

    let confirm = (fallbackyes && fallbackno) ? '<div class="right-text alert-actions"><button id="but_yes"><u>O</u>ui</button><button id="but_no"><u>N</u>on</button></div>' : '<div class="center-text alert-actions"><button id="but_ok">OK</button></div>';
    n_window_body.innerHTML = '<div class="alert-content"><img src="'+getIconImg(icon,32)+'" />'+content+'</div><br/>'+confirm;

    n_window.appendChild(n_window_body);
    document.body.appendChild(n_alert_container);
    initDragWindow(n_window);
    n_window.style.top = (document.body.scrollHeight / 2) - (n_window.offsetHeight / 2) + 'px';
    n_window.style.left = (document.body.scrollWidth / 2) - (n_window.offsetWidth / 2) + 'px';
    n_window.style.display = '';
    makeItFocused(n_window);

    n_alert_container.addEventListener('click', function(e){
      if (e.target === this) {
        stickToAlert();
        return
      }
      function r() {
        n_alert_container.remove()
      }
      switch (e.target.id) {
        case 'but_close' : r() ; break;
        case 'but_no' : fallbackno(); r(); break;
        case 'but_yes' : case 'but_ok' : fallbackyes(); r(); break;
      }
    });
    playAudio('error')
 };


document.addEventListener('click', function(e) {

  parent('#start-button',e) ? $id('start-menu').classList.toggle('show') : $id('start-menu').classList.remove('show');
  parent('#quick-desktop',e) && document.querySelectorAll('.window').forEach(function(a){a.classList.add('hide')})
  !parent('.window',e) && !parent('.taskbar-app',e) && makeItFocused(); /* check if reccurences */
});


/*** DESKTOP A BESOIN DE DECLENCHER LES ALERTES RECUES
& DISPATCHER AUX NOUVELLES FENETRES OUVERTES ET AUX EXISTANTES LES FICHIERS COPIES ***/

window.addEventListener('message',function(e){
  let data = JSON.parse(e.data), // données reçues reconverties en code
      action = data.action, // action demandée par l'iframe émétrice
      subject = data.subject, // le sujet de l'action
      origin = e.source; // source de la demande pour renvoi de réponse
  if (action == 'throwAlert') {
    if (subject == 'erase') {
      throwAlert(
        data.title,
        data.message,
        data.icon,
        function() {
          postMessage(origin,{
            action: 'erase_accepted'
          });
          origin.focus()
        },function() {
          postMessage(origin,{
            action: 'erase'
          });
          origin.focus()
        }
      );
    }
    if (subject == 'deletion') {
      throwAlert(
        data.title,
        data.message,
        data.icon,
        function() {
          postMessage(origin,{
            action: 'deletion_accepted'
          });
          origin.focus()
        },function() {
          postMessage(origin,{
            action: 'deletion_denied'
          });
          origin.focus()
        });
      }
    if (subject == 'renamingerror') {
      throwAlert(
        data.title,
        data.message,
        data.icon,
        function() {
          postMessage(origin,{
            action: 'renamingerror_ok'
          });
          origin.focus()
        }
      );
    }
    if (subject == 'paste_done') {
      document.querySelectorAll('iframe').forEach(function(a){
        a.contentWindow.getIconsPositions();
        a.contentWindow.clearFilesClipboard();
      });
    }
  }
},false);



var quickLauchDrag,
    quicklaunch = $id('taskbar-quicklaunch')
    qLstartX = 0;

$id('quicklaunch-resizer').addEventListener('mousedown', function (e) {
   quickLauchDrag = true;
   qLstartX = e.clientX;
 });

 document.addEventListener('mousemove', function (e) {
   if (!quickLauchDrag) return;
   var qLleft = quicklaunch.getBoundingClientRect().x
   var width = e.clientX - qLleft + 'px';
   quicklaunch.style.width = width;
 });
















document.addEventListener('DOMContentLoaded', function(){
  $id('start-menu-header').querySelector('span').innerHTML = getURLParameter('username') || 'Invité&middot;e';
  $id('start-menu-header').querySelector('div').classList.add(getURLParameter('userpic') || 'bg-guest');
  clock();
})
window.addEventListener('load', function() {
  playAudio('startup');
});

//https://stackoverflow.com/questions/11005223/how-to-execute-a-function-through-postmessage
//https://stackoverflow.com/questions/912596/how-to-turn-a-string-into-a-javascript-function-call
