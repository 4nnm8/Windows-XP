/*
0: Click gauche (principal)
1: Roulette
2: Click droit (context menu)
3: 4e bouton (précédent)
4: 5e bouton (suivant)
*/

  document.addEventListener('mousedown', function(e) {
    var t = e.target;
    focusedWorkspace = t.closest('.workspace') || focusedWorkspace;
    x5 = focusedWorkspace.offsetLeft;
    y5 = focusedWorkspace.offsetTop;

    if (!t.classList.contains('workspace') || (e.button === 1)) return false;
    if ($id('temp-context-menu') && t !== $id('temp-context-menu')) $id('temp-context-menu').remove();

    renameIconDone(true);
    clearIconSelection();
    if (e.button === 2) {
      desktopContextMenu(e);
    } else if (e.button === 0) {
      curSel = document.createElement('div');
      curSel.className = 'cursor-selector';
      focusedWorkspace.appendChild(curSel);
      drawSelection = true;
      x1 = mousex;
      y1 = mousey;
      reCalc();
    }

  }, !1);
  // MERGE ^<
  document.addEventListener('click', function(e) {
    var parent = (p) => {return e.target.closest(p)};

    parent('#start-button') ? $id('start-menu').classList.add('show') : $id('start-menu').classList.remove('show');

    !parent('.window') && !parent('.taskbar-app') && makeItFocused();

    parent('#taskbar-arrow') && $id('taskbar-notifications').classList.toggle('reverse');

    parent('#quick-desktop') &&
      document.querySelectorAll('.window').forEach(function(a){
        a.classList.add('hide')
      })

  });

  document.addEventListener('mousemove', function(e) {
    if (drawSelection) {
      curSel.style.display = 'block'
      x2 = mousex;
      y2 = mousey;
      reCalc();
    }
  }, !1);
  document.addEventListener('mouseup', function(e) {
    drawSelection = false;
    movable = false; // ?
    curSel && curSel.remove();
    curSel = void 0;
  }, !1);

/*** GLOBAL ***/

  document.addEventListener('keydown', function(e){
    let k = e.key;
    console.log(k)
    switch(k) {
      case 'Delete' : deleteIcons()
    }
    if (!e.ctrlKey) return false;
    var prevent = true;
    switch (k) {
      case 'c' : copyCutIcons();break;
      case 'x' : isCutFile = true; copyCutIcons();break;
      case 'v' : pasteIcons();break;
      case 'a' : {
        document.querySelectorAll('.icon').forEach(function(a){
          a.classList.add('.focusedicon')
        })
      };break;
      default: prevent = false;
    }
    prevent && e.preventDefault();
  })
  document.addEventListener('contextmenu', function(e){
    e.preventDefault()
  });

  window.addEventListener('load', function() {
    playAudio('startup')
  });

  document.addEventListener('mousemove', (e) => {
    mousex = e.clientX;
    mousey = e.clientY;
  });

  window.addEventListener('resize', function(){
    clearTimeout(window.resizedFinished);
      window.resizedFinished = setTimeout(function(){
        getIconsPositions();
    }, 500);
  });
