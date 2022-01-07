
var curSel,
    iconsPos = [],
    x1 = 0, y1 = 0, x2 = 0, y2 = 0, x5 = 0, y5 = 0,
    renamedIcon,
    previousFileName,
    drawSelection = false,
    movable = false,
    copiedIcons = [],
    deletedIcons = [],
    isCutFile;

const
copyCutIcons = () => {
  isCutFile && copiedIcons.forEach(function(a) { a.classList.remove('cut') });
  copiedIcons = document.querySelectorAll('.focusedicon:not(.undeletable)');
  isCutFile && copiedIcons.forEach(function(a) { a.classList.add('cut') });
},
pasteIcons = () => {
  copiedIcons.forEach(function(a){
    let duplicated = a.cloneNode(true),
        slot = document.createElement('div');
    slot.className = 'icon-slot';
    duplicated.classList.remove('focusedicon');
    duplicated.classList.remove('cut');
    duplicated.style.position = '';
    slot.appendChild(duplicated);

    /*** prevent identic  name files !!! ***/

    focusedWorkspace.appendChild(slot);
    generateIconsActions(duplicated);
    isCutFile && a.parentNode.remove();
  });
  copiedIcons = [];
  isCutFile = void 0;
  getIconsPositions();
},

deleteIcons = (f) => {
  let iconlist = document.querySelectorAll('.focusedicon:not(.undeletable)'),
      title = 'Confirmation de la suppression des fichiers';
      console.log(iconlist)
      function fallbackYes() {
        //deletedIcons.push(a)
      }
      if (f) {
        a.remove()
      } else {
        if (iconlist.length === 1) {
          throwAlert(title,
          'Voulez-vous vraiment envoyer "'+ iconlist[0].querySelector('.icon-text').innerText + '" à la Corbeille ?',
          'fallbackYes',
          'fallbackNo'
          );

        } else {
          console.log('test1')
          throwAlert(title,
          'Voulez-vous vraiment envoyer ces ' + iconlist.length + ' éléments à la Corbeille ?',
          'fallbackYes',
          'fallbackNo',
          'icon');
        }
        /**/
        /*document.getElementById('trash').querySelector('.window-content').appendChild(a);*/
        /*a.classList.remove('focusedicon');*/
        /**  **/
        /** [OUI] [NON] **/
      }
      getIconsPositions();


},

getIconCenter = (a) => {
  let rect = a.getBoundingClientRect(),
      left = rect.left + a.offsetWidth / 2,
      top = rect.top + a.offsetHeight / 2;
  return [left, top]
},
getIconsPositions = () => {
  iconsPos = [];
  document.querySelectorAll('.icon').forEach(function(a) {
    iconsPos.push([getIconCenter(a)[0], getIconCenter(a)[1]])
  });
},
clearIconSelection = (icon) => {
  document.querySelectorAll('.icon').forEach(function(a) {
    a.classList.remove('focusedicon');
    icon && icon.classList.add('focusedicon')
  })
},
renameIcon = () => {
  let c = document.querySelectorAll('.focusedicon');
  if (c.length == 1) {
    let text_field = c[0].querySelector('.icon-text');
    text_field.setAttribute('contenteditable', 'true');
    c[0].classList.add('renaming');
    previousFileName = text_field.textContent || text_field.innerText;
    selectText(text_field);
    renamedIcon = c[0];
  }
},
renameIconDone = (valid) => {
  if (!renamedIcon) return;
  var text_field = renamedIcon.querySelector('.icon-text'),
      text_field_content = text_field.innerText.trim().replace(/<br\/?>/gim, ''),
      duplication = false;
  if (valid) {
    if (/[<>:"\/\|?*:]/.test(text_field_content)) {
      throwAlert('Erreur','Le nom du fichier ne peut pas contenir les caractères suviants : [ ] < > " : / \\ | ? *');
      selectText(text_field);
      return false;
    }
    if (/\b(((CO[NM]|LPT)[1-9]?)|PRN|AUX|NUL)\b/gmi.test(text_field_content)) {
      throwAlert('Erreur','Nom de fichier réservé : ' + text_field_content);
      selectText(text_field);
      return false;
    }
    if (text_field_content === '' || text_field_content.length === 0) {
      throwAlert('Erreur','Le nom du fichier ne peut pas être vide');
      text_field.innerHTML = previousFileName;
      selectText(text_field);
      return false;
    }

    /*renamedIcon.closest('.workspace')*/focusedWorkspace.querySelectorAll('.icon:not(.shortcut):not(.undeletable)').forEach(function(a){
      let b = a.querySelector('.icon-text')
      if(b.innerText.trim().replace(/<br\/?>/gim, '') == text_field_content && text_field !== b) {
        throwAlert('Erreur','Un fichier portant ce nom existe déjà dans le dossier');
        text_field.innerHTML = previousFileName;
        duplication = true;
      }
    });
    if (duplication) {
      selectText(text_field);
      return false;
    }
    if (!renamedIcon.classList.contains('undeletable') && !renamedIcon.classList.contains('shortcut')) {
      let a = text_field.innerHTML.match(/\.[0-9a-z]{1,5}$/mi);
      if (a) {
        let b = a[0].replace(".", "");
        renamedIcon.querySelector('img').src = file_img[b] || file_img.none; /*** A FINIR ***/
      } else {
        renamedIcon.querySelector('img').src = file_img.none;
      }
    }
  } else {
    text_field.innerHTML = previousFileName;
  }
  deselectText();
  renamedIcon.classList.remove('renaming');
  text_field.removeAttribute('contenteditable');
  renamedIcon = void 0;
  previousFileName = void 0;
},
moveIcons = (ico,e) => {
  var innerIconWidth = ico.offsetWidth,
      innerIconHeight = ico.offsetHeight,
      desk_width = focusedWorkspace.offsetWidth,
      desk_height = focusedWorkspace.offsetHeight,
      l = focusedWorkspace.offsetLeft + 100,
      t = focusedWorkspace.offsetTop + 50,
      maxx = l + desk_width - innerIconWidth,
      maxy = l + desk_height - innerIconHeight,
      movable = true;
      moveAt(e.pageX, e.pageY);

  function moveAt(pageX, pageY) {
    if (movable) {
      if (pageY <= maxy && pageY >= t) {
        ico.style.top = pageY - 25 - y5 + 'px';
      } else {
        movable = false;
        getIconsPositions();
      }
      if (pageX <= maxx && pageX >= l) {
        ico.style.left = pageX - 50 - x5 + 'px';
      } else {
        movable = false
        getIconsPositions();
      }
    }
  }
  function onMouseMove(e) {
    ico.style.position = 'absolute';
    moveAt(e.pageX, e.pageY);
  }
  focusedWorkspace.addEventListener('mousemove', onMouseMove);

  ico.onmouseup = function() {
    focusedWorkspace.removeEventListener('mousemove', onMouseMove);
    movable = false;
    ico.onmouseup = null;
    getIconsPositions();

  };
  ico.ondragstart = function() {
    return false;
  };
},
generateIconsActions = (ico) => {
  ico.addEventListener('dblclick', function(e) {
    openWindow(this)
  });

  ico.addEventListener('mousedown', function(e) {
    x5 = focusedWorkspace.offsetLeft;
    y5 = focusedWorkspace.offsetTop;
    if (e.button === 2) {
      iconContextMenu(e,this);
    } else if (e.button === 0) {
      renameIconDone(true);
      clearIconSelection(this);

      moveIcons(ico,e)
    }
  });
  ico.addEventListener('keydown', function(e) {
    var prevent = true;
    switch(e.key) {
        //case "Delete" : deleteIcons() ;break;
        case "F2" : renameIcon() ;break;
        case "Escape" : renameIconDone(false) ;break;
        case "Enter" : {
          if (!renamedIcon) {
            openWindow(this)
          } else {
            renameIconDone(true);
          }
        };break;
        default: prevent = false;
      }
      prevent && e.preventDefault();
  });


},
iconContextMenu = (e,a) => {
  if ($id('temp-context-menu')) {
    $id('temp-context-menu').remove()
    clearIconSelection()
  };
  if (document.querySelectorAll('.focusedicon').length < 1) {
    a.classList.add('focusedicon')
  }
  let context = document.createElement('ul');
  context.id = 'temp-context-menu'
  context.className = 'temp-context-menu'
  context.innerHTML =
  '<li id="contxt-open"><b>Ouvrir</b></li>'+
  '<hr/>'+
  '<li id="contxt-cut">Couper</li>'+
  '<li id="contxt-copy">Copier</li>'+
  '<hr/>'+
  '<li id="contxt-shortcut">Créer un raccourci</li>'+
  '<li id="contxt-rename">Renommer</li>'+
  '<li id="contxt-delete">Supprimer</li>';
  let rect = a.getBoundingClientRect(),
      left = rect.left + 50,
      top = rect.top + 40;

  context.style.top = top - y5 + 'px';
  context.style.left = left - x5 + 'px';
  focusedWorkspace.appendChild(context)
  context.addEventListener('click', function(e) {
    switch (e.target.id) {
      case 'contxt-open': openWindow(a);break;
      case 'contxt-cut': {
        isCutFile = true;
        copyCutIcons()
      };break;
      case 'contxt-copy': {
        copyCutIcons();
      };break;
      case 'contxt-shortcut': {
        let shortcut_icon = a.cloneNode(true),
            slot = document.createElement('div');
        slot.className = 'icon-slot';
        shortcut_icon.classList.add('shortcut');
        shortcut_icon.classList.remove('focusedicon');
        shortcut_icon.classList.remove('undeletable');
        shortcut_icon.querySelector('.icon-text').innerHTML = 'Raccourci vers ' + shortcut_icon.querySelector('.icon-text').innerText
        slot.appendChild(shortcut_icon);
        generateIconsActions(shortcut_icon);
        focusedWorkspace.appendChild(slot);
      }; break;
      case 'contxt-rename': renameIcon() ;break;
      case 'contxt-delete': deleteIcons() ;break;
    }
    context.remove();
  });
}, reCalc = () => {
  let x3 = Math.min(x1, x2), // bottom-left x
      x4 = Math.max(x1, x2), // top-right x
      y3 = Math.min(y1, y2), // top-right y
      y4 = Math.max(y1, y2); // bottom-left y
  curSel.style.left = x3 - x5 + 'px';
  curSel.style.top = y3 - y5 + 'px';
  curSel.style.width = x4 - x3 + 'px';
  curSel.style.height = y4 - y3 + 'px';
  iconsPos.forEach(function(a, b) {
    let x = a[0],
        y = a[1];
    if (x > x3 && x < x4 && y < y4 && y > y3) {
      document.querySelectorAll('.icon')[b].classList.add('focusedicon');
    } else {
      document.querySelectorAll('.icon')[b].classList.remove('focusedicon')
    }
  })
};

getIconsPositions();

document.querySelectorAll('.icon').forEach(a => {
  generateIconsActions(a);
});
