var
currentZIndex = 10,
mousex, mousey,
focusedWorkspace = document.getElementById('desktop-area');

const
$id = (a) => {return document.getElementById(a)},
htmlRoot = document.documentElement,

desktop = $id('desktop-area'),

stickToAlert = (e) => {
  let alert = document.querySelector('.alert');
  if (e.target.closest('.alert')) return false;
  alert.style.animation = 'blink .2s step-start 0s 4'
  setTimeout(function(){
    alert.style.animation = ''
  },1000);
}
throwAlert = (title, content, fallbackyes, fallbackno, icon) => {

    let n_window = document.createElement('div');
    n_window.setAttribute('class','window alert unresizable');
    let n_titlebar = document.createElement('div');
    n_titlebar.className = 'title-bar';

    n_titlebar.innerHTML = `<div class="title-bar-text"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAALfSURBVDhPhZJbSBRhGIb/2dlZ151dvMkjlCSJWopgCXuRGEpioIVrZBcl2RraRXYQ9ToQ7EIKNQqLLJCIUMsy8pBEKEIqVMZSiiKU583V3DRNd/ft3VEqKOiDh5n55n+f75/hF9/0ssayWRWrgUaxpqqWtfCwzPV9e6/7bLbuDau10RMScrI/wLAjVvyjfglUk1gLNO7yJCQ88dnt31FVBdTWAuXlQG4uvsbHvy8PDDyxFftdmkDWiRWL+YA3OXkaJSVATQ1QVwdUVm4KioqAnBxsJCZ6S02mK4xJm2mWm2G3osRt7N4945+0WFyMH3l5gNUKb3Q0EBcHD++/pKUBSUmYi4zEMYOhcisuxJxeb54PDn7sf+my2dDT1oaBigo4hcA8mSXP2G9tacGn7Gy4wsLwKChoxSLEIU0wYTAcnIyIcG9ERWEuNRVTY2NY8HrRV1qKj7KMVm79w8QEfACmCgowajRiICgIOXr9U03gUNW64W3b4AwNxZKqYjQ9Hc7JSaxQ4ujqwqzTCfh8mLLbNeFbkwm95LyifNYEvara3W82Y9hiwRgFH7jlNyn74Vpc4EzAS0aPH8cA+4MU9BkM6CAX9folTdBlDGh6wW29DgjAkKLgNRc+5890ud2awEP6y8rwkv1eSUIHJc2kSJbdmqBHls+2Koq3k80eLnqQlYWR6WkmPZhuaMDy3CyWKOmk5AknN1FyT6dDjk5yaYJqSYq6I8sjTQw3xsbi/fi49s2OwkK0sfcqIwPzMzNYpaQ9Px+32KuiYLskhjSBQk5K0oVGmhv4KY76erzjWWjmwkfkIenIzMREezvux8Sgms82rmXsqibwl14InV2S7t/gy5vkNrlL7pE7W71rhEcQp4kqRD9jcZvpreLZVA9L0l0eMVCt4Q/5J/qDl8lRTmZ4kMtTNlN/l7xTiBKKHKeEWD/DEK84Qvbw0HIINyR4+/8KJ9nkHLlEComVGMgfJcRP2tib7vMtW+8AAAAASUVORK5CYII=" /> ${title}</div><div class="title-bar-controls"></div>`
    n_window.appendChild(n_titlebar);
    document.body.style.pointerEvents = 'none';

    let n_exit_button = document.createElement('button');
    n_exit_button.setAttribute('aria-label','Close');
    n_exit_button.addEventListener('click', function(){
      n_window.remove();
      document.body.style.pointerEvents = '';
      htmlRoot.removeEventListener('mousedown', stickToAlert);
      //fallbackno()
    })
    n_titlebar.querySelector('.title-bar-controls').appendChild(n_exit_button);

    let n_window_body = document.createElement('div');
    n_window_body.className = 'window-body';

    let confirm = (fallbackyes || fallbackno) ? '<button>Oui</button><button>Annuler</button>' : '<button>OK</button>';
    n_window_body.innerHTML = `<div>
      <img src="data:image/png;base64,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" />
      ${content}
      </div><br/>
      <div class="center-text">${confirm}</div>`
    n_window.appendChild(n_window_body);

    desktop.appendChild(n_window);
    initDragWindow(n_window);
    n_window.style.display = '';
    makeItFocused(n_window);
    htmlRoot.addEventListener('mousedown', stickToAlert);
    n_window.style.pointerEvents = 'auto'


},

getURLParameter = (p,q) => {
  let a = new URLSearchParams(window.location.search).get(p);
  return a ? a : q
},

selectText = (id) => {
  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(id);
    range.select();
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNodeContents(id);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
},

deselectText = () => {
  if (window.getSelection) {window.getSelection().removeAllRanges()}
  else if (document.selection) {document.selection.empty()}
},

getTopZIndex = function () {
  var allDivs = document.getElementsByClassName('window');
  var topZindex = 0;
  var topDivId;
  allDivs.each(function () {
    var currentZindex = parseInt(this.style.zIndex);
    if (currentZindex > topZindex) {
      topZindex = currentZindex;
      topDivId = this.id;
    }
  });
  return topZindex;
},
// references : https://developer.mozilla.org/fr/docs/Web/API/BaseAudioContext/createGain
// https://developer.mozilla.org/fr/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
playAudio = (a) => {
  let url = 'sounds/'+a+'.ogg',
      context = new AudioContext(),
      source = context.createBufferSource(),
      request = new XMLHttpRequest();
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  source.connect(context.destination);
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
      context.decodeAudioData(request.response, function(response) {
          source.buffer = response;
          source.start(0);
          source.loop = false;
      }, function () { console.error('The audio request failed.'); } );
  }
  request.send();
},

desktopContextMenu = (eloc) => {
  let context = document.createElement('ul'),
  letsPaste = (copiedIcons.length >> 0) ? '<li id="contxt-paste">Coller</li>' : '';
  context.id = 'temp-context-menu'
  context.className = 'temp-context-menu'
  context.innerHTML =
  '<li id="contxt-reorganize">Réorganiser les icones</li>'+
  letsPaste +
  '<hr/>'+
  '<li class="context-parent">Nouveau'
  +'<ul>'
  +'<li id="contxt-newfolder"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABa0lEQVR4nKWSPUsDQRCGn3MPDrWxUgKCGLCwESEgamlhJ1iYvyAIWljYCX6VFgELIWJpqQiCFhYWFoKQSkvBdGr6JHfJZXYs7vJhEhLFgWF3YeeZd4YX/hlOn7f+GpDLplRVsdZirWVh8yUJFIByXxlx8Y94zEwrMA8MxY3aM1KQy6Y0tZ4Dztqw6zwcTyEiiEhDmYiwelRIAl+A76oqBCcg0gbIsLTz1qH2encUY8yaiFwBeef5dFbn0mkIQ54uL7uOGIYhtVqtkarRblf2P5KutRZKJZ5ubljceu27Lz4PILHHxfYwxpi1CFAs4nlelz10RiWfx0ucIdHIE66IQBA0ZBEEPQG+7+MB1loAx40vVKvV6Eex2Bcw0gTgxlKagFKpJ6BcjnwVAQaagEql8msFQH1kdYDJ28Px97pJ6mergVqNZK1FVdk4H7hzHOfZIbLqjDFmGRjr2f5nFETkvu7pobh48A8AHyh8A7Ih5wdbGTd7AAAAAElFTkSuQmCC" /> Dossier</li>'
  +'<li id="contxt-newfile-text"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA7VBMVEUAAACUYwCMXQCFWACOXwBqRwAAAAAAAAD39/evhieUbxmOdloAAAAAAACens8AAAAAAAAAAAC/xsW2u7uRlZRqbGwAAAAAAAAAAACboLF3f39PVFQXGRkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADUv0qQajCEbWydglx3d8G8qpGNeG65ttOpkG6+tLp3d8DExuKGaEHp9PLs9vT3+/r///9wcHC7zdDx+Pf8/f3Bz9a/ztV9fn67vb2/zdW+0NG+zdS/ytjBztm8zNS2ys7r9fPs9fQu9nLsAAAALXRSTlMAISMlRRcEASHR1/IjCIRYGCLu6Ne8Zx4Po7e5oJSKfG5cOBAgSVNGLiUfFw02tziwAAAAAWJLR0Q90G1RWQAAAAd0SU1FB9sGDxIILIatMk8AAACYSURBVBjTXcrnDoIwGIXhunDh3ltxjyK4+0FxtW69/8sxlsRoz6+TJy9C7jxenz+gBMUPhbEewVE8NdSYgLhp6rP5YrkyEkkB6w0BYhGbUCflwhYArJ29p47qwkGGIzDG+A+c5OL8KRinX7jIxVUubnJxB8b/4AHwfKUz2Vy+IKBYKleqtXqj2dLaApROt9fXBsPReKIg9Ab9ySN00Ie3UgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0xMi0yNVQyMjowOTo1NSswMTowMHtBbt4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTEtMDYtMTVUMTg6MDg6NDQrMDI6MDBy+A54AAAAAElFTkSuQmCC"/> Document texte</li>'
  +'</ul>'
  '</li>';

  context.style.top = mousey - y5 +'px';
  context.style.left = mousex - x5 +'px';
  focusedWorkspace.closest('.workspace').appendChild(context)
  context.addEventListener('click', function(e) {
  switch (e.target.id) {
    case 'contxt-paste': {
      pasteIcons(eloc)
    };break;
    case 'contxt-newfolder': {

    }; break;
    case 'contxt-newfile-text': {

    }; break;
    case 'contxt-reorganize': {
      focusedWorkspace.querySelectorAll('.icon').forEach(function(a) {
        a.style.position = '';
        a.style.top = '';
        a.style.left = '';
      });
      getIconsPositions();
    }; break;
  }
  context.remove();
  });
},

clock = () => {
  let d = new Date(),
      t = $id('time');
      hm = d.toLocaleTimeString('fr-FR', {hour: '2-digit',minute: '2-digit'}),
      ymd = d.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  t.innerHTML = hm;
  t.setAttribute('title', $id('time'));
};
setInterval(clock, 1000);

$id('start-menu-header').querySelector('span').innerHTML = getURLParameter('username','Invité');
$id('start-menu-header').querySelector('div').className = getURLParameter('userpic','bg-guest');
