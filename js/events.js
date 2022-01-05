/*
0: Click gauche (principal)
1: Roulette
2: Click droit (context menu)
3: 4e bouton (précédent)
4: 5e bouton (suivant)
*/

  desktop.addEventListener('mousedown', function(e) {
    var t = e.target;
    if (t !== this || (e.button === 1)) return false;
    if ($id('temp-context-menu') && t !== $id('temp-context-menu')) $id('temp-context-menu').remove();
    renameIconDone(true);
    clearIconSelection();
    if (e.button === 2) {
      desktopContextMenu();
    } else if (e.button === 0) {
      drawSelection = true;
      x1 = mousex;
      y1 = mousey;
      reCalc();
    }
  }, !1);
  // MERGE ^<
  document.addEventListener('click', function(e) {
    var t = e.target;
    if (t.closest('#start-button')) {
      $id('start-menu').classList.add('show');
    } else {
      $id('start-menu').classList.remove('show')
    }
    if (!t.closest('.window') && !t.closest('.taskbar-app')) {
      makeItFocused()
    }
    if (t == $id('taskbar-arrow')) {
      $id('taskbar-notifications').classList.toggle('reverse');
    }
  });

  desktop.addEventListener('mousemove', function(e) {
    if (drawSelection) {
      curSel.style.display = 'block';
      x2 = mousex;
      y2 = mousey;
      reCalc();
    }
  }, !1);
  desktop.addEventListener('mouseup', function(e) {
    drawSelection = false;
    curSel.style.display = 'none';
    x1 = x2 = document.body.clientWidth;
    y1 = y2 = document.body.clientHeight;
  }, !1);
  


/*** GLOBAL ***/
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