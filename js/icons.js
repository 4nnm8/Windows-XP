var curSel = document.getElementById('cursor-selector'),
    iconsPos = [],
    x1 = 0, y1 = 0, x2 = 0, y2 = 0,
    renamedIcon,
    previousFileName,
    drawSelection = false,
    movable = false,
    copiedIcons = [],
    deletedIcons = [],
    copyCutAction;

const
vw = document.body.clientWidth,
vh = document.body.clientHeight,

copyCutIcons = () => {
  copiedIcons.length = 0;
  copiedIcons = document.querySelectorAll('.focusedicon:not(.undeletable)');
  if (copyCutAction) {
    copiedIcons.forEach(function(a) {
      a.classList.add('cut')
    })
  }
},
pasteIcons = () => {
  copiedIcons.forEach(function(a){
    let duplicated = a.cloneNode(true),
        slot = document.createElement('div');
    slot.className = 'icon-slot';
    duplicated.classList.remove('focusedicon');
    duplicated.classList.remove('cut');
    duplicated.style.position = ''
    slot.appendChild(duplicated);
    desktop.appendChild(slot);
    generateIconsActions(duplicated);
    if (copyCutAction) {
      a.parentNode.remove()
    }
  });
  copiedIcons = [];
  copyCutAction = void 0;
  getIconsPositions();
},
deleteIcons = () => {
  document.querySelectorAll('.focusedicon').forEach(function(a) {
    if (!a.classList.contains('undeletable')) {
      /*document.getElementById('trash').querySelector('.window-content').appendChild(a);*/
      /*a.classList.remove('focusedicon');*/
      deletedIcons.push(a)
      a.remove();
      getIconsPositions();
    }
  });
},

getIconCenter = (a) => {
  let rect = a.getBoundingClientRect(),
      left = rect.left + a.offsetWidth / 2,
      top = rect.top + a.offsetHeight / 2;
  return [left, top]
},
getIconsPositions = () => {
  iconsPos = [];
  document.querySelectorAll('.desktop-icon').forEach(function(a) {
    iconsPos.push([getIconCenter(a)[0], getIconCenter(a)[1]])
  });
},
clearIconSelection = (icon) => {
  document.querySelectorAll('.desktop-icon').forEach(function(a) {
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
    selectText(text_field)
    renamedIcon = c[0];
  }
},
renameIconDone = (valid) => {
  if (!renamedIcon) return;
  var text_field = renamedIcon.querySelector('.icon-text');
  if (valid) {
    if (/[<>:"\/\|?*]|(\b(((CO[NM]|LPT)[1-9]?)|PRN|AUX|NUL))\b/gmi.test(text_field.innerHTML.replace("<br>", ""))) {
      throwAlert("invalid file name :" + text_field.innerHTML);
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
moveIcons = (item,e) => {
  var innerItemWidth = item.offsetWidth,
      innerItemHeight = item.offsetHeight,
      desk_width = desktop.offsetWidth,
      desk_height = desktop.offsetHeight,
      l = desktop.offsetLeft + 50,
      t = desktop.offsetTop + 25,
      maxx = l + desk_width - innerItemWidth,
      maxy = l + desk_height - innerItemHeight,
      movable = true;
      moveAt(e.pageX, e.pageY);

  function moveAt(pageX, pageY) {
    if (movable) {
      if (pageY <= maxy && pageY >= t) {
        item.style.top = pageY - 25 + 'px';
      }
      if (pageX <= maxx && pageX >= l) {
        item.style.left = pageX - 50 + 'px';
      }
    }
  }
  function onMouseMove(e) {
    item.style.position = 'absolute';
    moveAt(e.pageX, e.pageY);
  }
  desktop.addEventListener('mousemove', onMouseMove);

  item.onmouseup = function() {
    desktop.removeEventListener('mousemove', onMouseMove);
    item.onmouseup = null;
    movable = false;
    getIconsPositions();
  };
  item.ondragstart = function() {
    return false;
  };
},
generateIconsActions = (item) => {
  item.addEventListener('dblclick', function(e) {
    openWindow(this)
  });
  item.addEventListener('contextmenu', function(e) {
    e.preventDefault()
  })
  item.onmousedown = function(e) {
    if (e.button === 2) {
      iconContextMenu(this);
    } else if (e.button === 0) {
      clearIconSelection(this);
      moveIcons(item,e)
    }
  };
},
iconContextMenu = (a) => {
  if ($id('temp-context-menu')) {
    $id('temp-context-menu').remove()
    clearIconSelection()
  };
  if (document.querySelectorAll('.focusedicon').length < 1) {
    a.classList.add('focusedicon')
  }
  let context = document.createElement('ul'),
      cutorpaste = (copiedIcons.length >> 0) ? '<li id="contxt-paste">Coller</li>' : '';
  context.id = 'temp-context-menu'
  context.className = 'temp-context-menu'
  context.innerHTML =
  '<li id="contxt-open"><b>Ouvrir</b></li>'+
  '<hr/>'+
  '<li id="contxt-cut">Couper</li>'+
  '<li id="contxt-copy">Copier</li>'+
  cutorpaste +
  '<hr/>'+
  '<li id="contxt-shortcut">Créer un raccourci</li>'+
  '<li id="contxt-rename">Renommer</li>'+
  '<li id="contxt-delete">Supprimer</li>';
  let rect = a.getBoundingClientRect(),
      left = rect.left + 50,
      top = rect.top + 40;

  context.style.top = top+'px';
  context.style.left = left+'px';
  desktop.appendChild(context)
  context.addEventListener('click', function(e) {
    switch (e.target.id) {
      case 'contxt-open': openWindow(a);break;
      case 'contxt-cut': {
        copyCutAction = true;
        copyCutIcons()
      };break;
      case 'contxt-copy': {
        copyCutIcons('copy');
      };break;
      case 'contxt-paste': {
        pasteIcons()
      };break;

      case 'contxt-shortcut': {
        let shortcut_icon = a.cloneNode(true),
            slot = document.createElement('div');
        slot.className = 'icon-slot';
        shortcut_icon.classList.add('shortcut');
        shortcut_icon.classList.remove('focusedicon');
        shortcut_icon.classList.remove('undeletable');
        slot.appendChild(shortcut_icon);
        generateIconsActions(shortcut_icon);
        desktop.appendChild(slot);
      }; break;
      case 'contxt-rename': renameIcon() ;break;
      case 'contxt-delete': deleteIcons() ;break;
    }
    context.remove();
  });
};



/**** ICON SELECTION ****/

function reCalc() {
  let x3 = Math.min(x1, x2), // bottom-left x
      x4 = Math.max(x1, x2), // top-right x
      y3 = Math.min(y1, y2), // top-right y
      y4 = Math.max(y1, y2); // bottom-left y
  curSel.style.left = x3 + 'px';
  curSel.style.top = y3 + 'px';
  curSel.style.width = x4 - x3 + 'px';
  curSel.style.height = y4 - y3 + 'px';
  iconsPos.forEach(function(a, b) {
    let x = a[0],
        y = a[1];
    if (x > x3 && x < x4 && y < y4 && y > y3) {
      document.querySelectorAll('.desktop-icon')[b].classList.add("focusedicon");
    } else {
      document.querySelectorAll('.desktop-icon')[b].classList.remove("focusedicon")
    }
  })
}
desktop.addEventListener('contextmenu', function(e){
  e.preventDefault()
});
desktop.addEventListener('mousedown', function(e) {
  if (e.target !== this || (e.button === 1)) return false;
  if ($id('temp-context-menu') && e.target !== $id('temp-context-menu')) $id('temp-context-menu').remove();
  renameIconDone(true);
  clearIconSelection();
  if (e.button === 2) {
    desktopContextMenu();
  } else if (e.button === 0) {
    drawSelection = true;
    x1 = e.clientX;
    y1 = e.clientY;
    reCalc();
  }
}, !1);

desktop.addEventListener('mousemove', function(e) {
  if (drawSelection) {
    curSel.style.display = 'block';
    x2 = e.clientX;
    y2 = e.clientY;
    reCalc();
  }
}, !1);
desktop.addEventListener('mouseup', function(e) {
  drawSelection = false;
  curSel.style.display = 'none';
  x1 = x2 = vw;
  y1 = y2 = vh;
}, !1);

document.addEventListener('keydown', function(e) {
  switch(e.key) {
    case "Delete" : deleteIcons() ;break;
    case "F2" : renameIcon() ;break;
    case "Escape" : renameIconDone(false) ;break;
    case "Enter" : {
      let sel = document.querySelectorAll('.focusedicon');
      if (sel.length === 1 && !renamedIcon) {
        openWindow(sel[0])
      } else {
        renameIconDone(true);
      }
    };break;
  }
});


window.addEventListener('resize', function(){
  clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function(){
      getIconsPositions();
  }, 500);
});
getIconsPositions();

document.querySelectorAll('.desktop-icon').forEach(item => {
  generateIconsActions(item);
});
