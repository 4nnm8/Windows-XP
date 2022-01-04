/*function resizeWindowToFitContent(appId) {
  let a = $id(appId), b = a.querySelector('iframe');
  a.style.width = b.contentWindow.document.body.offsetWidth + 8 + "px";
  a.style.height =  b.contentWindow.document.body.offsetHeight + 34 + "px";
}*/
const 
htmlRoot = document.documentElement,
makeItFocused = (a) => {  
  document.querySelectorAll('.window').forEach(function(b) {
    b.classList.add('inactive');
  });
  if (a) {
  	a.classList.remove('inactive');
  	a.querySelector('iframe').focus();
  }
},
openWindow = (el) => {
  var appId = el.getAttribute('data-app'),
      appClassList = el.classList;

  if (appClassList.contains('opened')) {
    makeItFocused($id(appId));
    return false;
  } else {
    el.classList.add('opened');
  }
  document.body.style.cursor = 'url(cursors/wait.cur), wait';
  var appName = el.getAttribute('data-appname'),
      appUrl = el.getAttribute('data-url') || `apps/${appId}.html`,
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
  taskbar_item.setAttribute('class', 'item');
  taskbar_item.setAttribute('data-app', appId);
  taskbar_item.setAttribute('tabindex', '0');
  taskbar_item.innerHTML = `<div><img src="${appImg}" alt="${appName}" /></div><div>${appName}</div>`;
  taskbar_item.addEventListener('click', function(e){
    if ($id(appId).classList.contains('hide')) {
      playAudio('restore')
      $id(appId).classList.remove('hide');
      $id(appId).classList.remove('inactive');
      $id(appId).querySelector('iframe').focus();
    } else {
      playAudio('minimize')
      $id(appId).classList.add('hide')
    }    
  },!1);

  let iframe = document.createElement('iframe');
  iframe.src = appUrl;
  n_window.appendChild(iframe);
  $id('desktop-area').appendChild(n_window);
  iframe.addEventListener('load', function() {
    //resizeWindowToFitContent(appId);
    initDragWindow(n_window);
    if (!appClassList.contains('unresizable')) initResizeWindow(n_window);
    n_window.style.display = '';
    document.body.style.cursor = '';
    $id('status-bar-apps').appendChild(taskbar_item);
    makeItFocused(n_window);
    $id(appId).querySelector('iframe').focus();
  });
},
maximize = (a) => {
  //if (!a.classList.contains('unresizable')) { // handled with CSS
    a.classList.add('maximize');
    a.querySelector('[aria-label=Maximize]').setAttribute('aria-label', 'Restore')

  //}
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
  $id('status-bar-apps').querySelector('[data-app="' + a.id + '"]').remove();
  document.querySelectorAll('.desktop-icon').forEach(function(b){
    if (b.getAttribute('data-app') == a.id) {
      b.classList.remove('opened')
    }
  });
  a.remove();
},
initDragWindow = (test) => {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0,
      popup = test,
	    titlebar = popup.querySelector('.title-bar'),
      iframe = popup.querySelector('iframe');
  const elementDrag = (e) => {
    iframe.style.pointerEvents = 'none';
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    popup.style.top = popup.offsetTop - pos2 + 'px'; 
    popup.style.left = popup.offsetLeft - pos1 + 'px';
  },
  closeDragElement = () => {
    iframe.style.pointerEvents = '';
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
  },
  dragMouseDown = (e) => {
    //popup.style.zIndex = '' + ++currentZIndex;
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', closeDragElement);
  }
  titlebar.addEventListener('mousedown', dragMouseDown);
},
initResizeWindow = (win) => {
  var startX, startY, startWidth, startHeight,
      right = document.createElement('div'),
      bottom = document.createElement('div'),
      both = document.createElement('div')
      iframe = win.querySelector('iframe');

  function initDragRight(e) {
    iframe.style.pointerEvents = 'none';
    startX = e.clientX;
    startWidth = parseInt(document.defaultView.getComputedStyle(win).width, 10);
    htmlRoot.addEventListener('mousemove', doDrag, false);
    htmlRoot.addEventListener('mouseup', stopDrag, false);
  }
  function initDragBottom(e) {
    iframe.style.pointerEvents = 'none';
    startY = e.clientY;
    startHeight = parseInt(document.defaultView.getComputedStyle(win).height, 10);
    htmlRoot.addEventListener('mousemove', doDrag, false);
    htmlRoot.addEventListener('mouseup', stopDrag, false);
  }
  function initDragBoth(e) {
    iframe.style.pointerEvents = 'none';
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(win).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(win).height, 10);
    htmlRoot.addEventListener('mousemove', doDrag, false);
    htmlRoot.addEventListener('mouseup', stopDrag, false);
  }
  function doDrag(e) {
    win.style.height = startHeight + e.clientY - startY + 'px';
    win.style.width = startWidth  + e.clientX - startX + 'px';
  }
  function stopDrag() {
    iframe.style.pointerEvents = '';
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
}