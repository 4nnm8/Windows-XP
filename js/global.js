var 
currentZIndex = 10,
mousex, mousey;

const
$id = (a) => {return document.getElementById(a)},

desktop = $id('desktop-area'),

throwAlert = (title, content, fallback) => {
  console.log(title, content, fallback)
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

desktopContextMenu = () => {
  if ($id('temp-context-menu')) {
    $id('temp-context-menu').remove()
    clearIconSelection()
  };

  let context = document.createElement('ul'),
  cutorpaste = (copiedIcons.length >> 0) ? '<li id="contxt-paste">Coller</li>' : '';
  context.id = 'temp-context-menu'
  context.className = 'temp-context-menu'
  context.innerHTML = 
  '<li id="contxt-reorganize">Réorganiser les icones</li>'+
  cutorpaste +
  '<hr/>'+
  '<li class="context-parent">Nouveau'
  +'<ul>'
  +'<li id="contxt-newfolder"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABa0lEQVR4nKWSPUsDQRCGn3MPDrWxUgKCGLCwESEgamlhJ1iYvyAIWljYCX6VFgELIWJpqQiCFhYWFoKQSkvBdGr6JHfJZXYs7vJhEhLFgWF3YeeZd4YX/hlOn7f+GpDLplRVsdZirWVh8yUJFIByXxlx8Y94zEwrMA8MxY3aM1KQy6Y0tZ4Dztqw6zwcTyEiiEhDmYiwelRIAl+A76oqBCcg0gbIsLTz1qH2encUY8yaiFwBeef5dFbn0mkIQ54uL7uOGIYhtVqtkarRblf2P5KutRZKJZ5ubljceu27Lz4PILHHxfYwxpi1CFAs4nlelz10RiWfx0ucIdHIE66IQBA0ZBEEPQG+7+MB1loAx40vVKvV6Eex2Bcw0gTgxlKagFKpJ6BcjnwVAQaagEql8msFQH1kdYDJ28Px97pJ6mergVqNZK1FVdk4H7hzHOfZIbLqjDFmGRjr2f5nFETkvu7pobh48A8AHyh8A7Ih5wdbGTd7AAAAAElFTkSuQmCC" /> Dossier</li>'
  +'<li id="contxt-newfile-text"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA7VBMVEUAAACUYwCMXQCFWACOXwBqRwAAAAAAAAD39/evhieUbxmOdloAAAAAAACens8AAAAAAAAAAAC/xsW2u7uRlZRqbGwAAAAAAAAAAACboLF3f39PVFQXGRkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADUv0qQajCEbWydglx3d8G8qpGNeG65ttOpkG6+tLp3d8DExuKGaEHp9PLs9vT3+/r///9wcHC7zdDx+Pf8/f3Bz9a/ztV9fn67vb2/zdW+0NG+zdS/ytjBztm8zNS2ys7r9fPs9fQu9nLsAAAALXRSTlMAISMlRRcEASHR1/IjCIRYGCLu6Ne8Zx4Po7e5oJSKfG5cOBAgSVNGLiUfFw02tziwAAAAAWJLR0Q90G1RWQAAAAd0SU1FB9sGDxIILIatMk8AAACYSURBVBjTXcrnDoIwGIXhunDh3ltxjyK4+0FxtW69/8sxlsRoz6+TJy9C7jxenz+gBMUPhbEewVE8NdSYgLhp6rP5YrkyEkkB6w0BYhGbUCflwhYArJ29p47qwkGGIzDG+A+c5OL8KRinX7jIxVUubnJxB8b/4AHwfKUz2Vy+IKBYKleqtXqj2dLaApROt9fXBsPReKIg9Ab9ySN00Ie3UgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0xMi0yNVQyMjowOTo1NSswMTowMHtBbt4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTEtMDYtMTVUMTg6MDg6NDQrMDI6MDBy+A54AAAAAElFTkSuQmCC"/> Document texte</li>'
  +'</ul>'
  '</li>';

  context.style.top = mousey+'px';
  context.style.left = mousex+'px';
  desktop.appendChild(context)
  context.addEventListener('click', function(e) {
  switch (e.target.id) {
    case 'contxt-paste': {
      pasteIcons()
    };break;
    case 'contxt-newfolder': {
      
    }; break;
    case 'contxt-newfile-text': {
      
    }; break;
    case 'contxt-reorganize': {
      document.querySelectorAll('.icon').forEach(function(a) {
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