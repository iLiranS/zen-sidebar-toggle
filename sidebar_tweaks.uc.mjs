import { SIDEBAR_CSS } from './sidebar_styles.mjs';

/**
 * https://github.com/iLiranS/zen-sidebar-toggle - for instructions
 */


const sidebar = document.getElementById("sidebar-box");
let win = Services.wm.getMostRecentWindow("navigator:browser"); // sidebar service
let isOpen = win.SidebarController.isOpen
// identify the browser 
// const sidebarButton = document.getElementById("sidebar-button");
const toggleButton = document.getElementById("import-button"); // it's not meant to be but we override behavior 
const closeButton = document.getElementById('sidebar-close');
// let isOpen = false
let pinned = false

// load styles
const applyStyles = () => {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = SIDEBAR_CSS;
  document.head.appendChild(styleSheet);
};

// Visual changes only - call when you need to check state of isOpen
const toggleHandler = (changeState = true) => {
  if (changeState) isOpen = !isOpen
  if (isOpen) {
    // opening the sidebar visually
    sidebar.classList.remove('close')
    toggleButton.setAttribute('checked', true)
  }
  else {
    // closing the sidebar visually
    sidebar.classList.add('close')
    toggleButton.removeAttribute('checked')
  }
}

// Toggle button - upon a click
toggleButton.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  toggleHandler()
})


// Toggle button - shortcut (default is meta+key in macOS)
document.addEventListener('keydown', (e) => {
  // Check for Cmd + E (MacOS) - CHANGE ABOVE TO YOUR DESIRED SHORTCUT
  if (e.metaKey && e.key === 'e') {
    e.preventDefault(); // Prevent default browser behavior

    if (!win.SidebarController.isOpen) {
      win.SidebarController.toggle();
    }
    toggleHandler()
  }
});



//  Clicking outside the sidebar or sidebar button will hide it
document.addEventListener('click', (e) => {
  if (e.button !== 0 || !isOpen || e.target.id === "sidebar-button" || pinned) return
  if (e.target.hasAttribute("contextmenu")) {
    // meaning clicked inside the main browser so hide sidebar but not closing it
    toggleHandler()
  }


})

/**
 * PIN BUTTON 
 * 
 */
const createPinButton = () => {
  const pinButton = document.createElement('toolbarbutton');
  pinButton.id = 'sidebar-pin';
  pinButton.className = 'close-icon tabbable';
  pinButton.setAttribute('tooltiptext', 'Pin sidebar');

  // create and append img element
  const img = document.createElement('img');
  img.src = 'chrome://browser/skin/pin.svg';
  img.style.transform = "rotateY(180deg)"
  pinButton.appendChild(img);


  closeButton.parentNode.insertBefore(pinButton, closeButton);

  // click handler
  pinButton.addEventListener('click', () => {
    pinned = !pinned;
    if (pinned) {
      pinButton.classList.add('pinned-button');
    } else {
      pinButton.classList.remove('pinned-button');
    }
  });

  return pinButton;
};

closeButton.addEventListener('click', () => {
  // it can only be clicked when isOpen = true so toggle is safe here
  toggleHandler()
})


// handling creation and changes visually with delay to let the dom load
setTimeout(() => {
  toggleButton.setAttribute("tooltiptext", "Toggle Sidebar");
  createPinButton(); // Create the pin button
  toggleHandler(false)
}, 500);

applyStyles();

/**
 * TESTING
 */


// win.SidebarController.toggle();  // toggles sidebar visibility
// win.SidebarController.show("viewBookmarksSidebar");
// win.SidebarController.hide();
// win.SidebarController.isOpen
