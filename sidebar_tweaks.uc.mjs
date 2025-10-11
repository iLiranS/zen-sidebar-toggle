import { SIDEBAR_CSS } from './sidebar_styles.mjs';

/**
 * https://github.com/iLiranS/zen-sidebar-toggle
 * some things to do before making it work
 * 1. Install fx-autoconfig https://github.com/MrOtherGuy/fx-autoconfig
 * 2. copy the sidebar_tweaks.uc.mjs and sidebar_styles.mjs into JS folder.
 * 3. make sure "browser.ml.chat.enabled" is set to true in about:config
 * 4. make sure "sidebars" tooltip is being placed on somewhere.
 * 5. make sure "import-button" tooltip is being placed (or other unused tooltip button - but change it's id)
 * 5.1 to get id of a tooltip use browser toolbox - inspect and get it's id - change it in "toggleButton" const
 * 6. change the shortcut below to the desired one, just make sure it won't colldie with other shortcuts.
 * That's it !
 */


const sidebar = document.getElementById("sidebar-box");
// identify the browser 
const sidebarButton = document.getElementById("sidebar-button");
const toggleButton = document.getElementById("import-button"); // it's not meant to be but we override behavior 
let isOpen = false
let pinned = false

// load styles
const applyStyles = () => {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = SIDEBAR_CSS;
  document.head.appendChild(styleSheet);
};

// Visual changes only - call when you need to check state of isOpen
const toggleHandler = () => {
  if (isOpen) {
    sidebar.classList.remove('close')
    toggleButton.setAttribute('checked', true)
  }
  else {
    sidebar.classList.add('close')
    toggleButton.removeAttribute('checked')
  }
}


// Toggle button - upon a click
toggleButton.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  isOpen = !isOpen
  if (!sidebarButton.hasAttribute("checked")) sidebarButton.click()
  toggleHandler()
})

// Initialize isOpen based on sidebar-button checked state
function updateInitialState() {
  isOpen = sidebarButton?.hasAttribute("checked") || false;
  toggleHandler()
}

// Call once when script loads with slight delay to let the browser load
setTimeout(() => {
  updateInitialState();
  toggleButton.setAttribute("tooltiptext", "Toggle Sidebar")
}, 500);

// Toggle button - shortcut (default is meta+key in macOS)
document.addEventListener('keydown', (e) => {
  // Check for Cmd + E (MacOS)
  if (e.metaKey && e.key === 'e') {
    e.preventDefault(); // Prevent default browser behavior

    // If sidebar isn't activated (checked), activate it first
    if (!sidebarButton?.hasAttribute("checked")) {
      sidebarButton?.click();
      isOpen = true;
    } else {
      // Normal toggle behavior
      isOpen = !isOpen;
    }

    // Toggle between hidden and visible positions
    toggleHandler()
  }
});

// Listen for changes to the sidebar button's checked state
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'checked') {
      // Update isOpen if sidebar is closed through other means
      isOpen = sidebarButton.hasAttribute('checked');
      toggleHandler()
    }
  });
});

// Start observing the sidebar button for attribute changes
if (sidebarButton) {
  observer.observe(sidebarButton, { attributes: true });
}

//  Clicking outside the sidebar or sidebar button will hide it
document.addEventListener('click', (e) => {
  if (e.button !== 0 || !isOpen || e.target.id === "sidebar-button" || pinned) return
  if (e.target.hasAttribute("contextmenu")) {
    // meaning clicked inside the main browser so hide sidebar
    isOpen = false
    toggleHandler()
  }


})

// Add this after your const declarations
const createPinButton = () => {
  const pinButton = document.createElement('toolbarbutton');
  pinButton.id = 'sidebar-pin';
  pinButton.className = 'close-icon tabbable';
  pinButton.setAttribute('tooltiptext', 'Pin sidebar');

  // Create and append img element
  const img = document.createElement('img');
  img.src = 'chrome://browser/skin/pin.svg';
  img.style.transform = "rotateY(180deg)"
  pinButton.appendChild(img);

  const closeButton = document.getElementById('sidebar-close');
  closeButton.parentNode.insertBefore(pinButton, closeButton);

  // Add click handler
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

// Add this to your initialization timeout
setTimeout(() => {
  updateInitialState();
  toggleButton.setAttribute("tooltiptext", "Toggle Sidebar");
  createPinButton(); // Create the pin button
}, 500);

applyStyles();
