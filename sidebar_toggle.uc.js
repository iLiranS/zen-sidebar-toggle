// ==UserScript==
// @name           Sidebar Toggle
// @version        1.1
// @description    Toggles sidebar with Cmd+E with animation, includes pin button
// ==/UserScript==

(function () {
  const SIDEBAR_CSS = `
  #sidebar-splitter {
    display: none !important;
  }

  /* default - hide */
  #sidebar-box {
    position: absolute !important;
    left: 0;
    transform: translateX(10px);
    top: 5px !important;
    height: calc(100vh - 30px);
    max-height: calc(100vh - 30px);
    width: 450px;
    z-index: 10 !important;
    resize: both;

    border-radius: var(--zen-border-radius) !important;
    box-shadow: var(--box-shadow-10) !important;
    background: var(--zen-colors-tertiary) !important;
    border: 1px solid var(--zen-colors-border) !important;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Sidebar position (right) - has attribute means on the right*/
  #sidebar-box[sidebar-positionend=""] {
    right: 0 !important;
    left: inherit !important;
    transform: translateX(-10px) !important;
    direction: rtl;
  }

  #sidebar-box[sidebar-positionend=""] > * {
    direction: initial;
  }

  #sidebar-box[sidebar-positionend=""].close {
    transform: translateX(calc(110% + var(--actual-zen-sidebar-width))) !important;
  }

  /* Sidebar position (left) (default) - transform to the left*/
  #sidebar-box.close {
    transform: translateX(calc(-110% - var(--actual-zen-sidebar-width))) !important;
  }

  /* Make close button bigger */
  #sidebar-close {
    padding: 4px 4px !important;
    min-width: 28px !important;
    min-height: 28px !important;
  }

  /* Pin button styles */
  #sidebar-pin {
    padding: 4px 4px !important;
    margin-right: 2px !important;
    min-width: 28px !important;
    min-height: 28px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  #sidebar-pin img {
    width: 16px !important;
    height: 16px !important;
    opacity: 0.7;
  }

  #sidebar-pin.pinned-button {
    background-color: var(--zen-colors-border) !important;
  }

  #sidebar-pin.pinned-button img {
    opacity: 1;
  }

  /* Hide the default toolbarbutton-icon for pin button */
  #sidebar-pin .toolbarbutton-icon {
    display: none !important;
  }
  `;

  const sidebar = document.getElementById("sidebar-box");
  if (!sidebar) return;

  let win = Services.wm.getMostRecentWindow("navigator:browser"); // sidebar service
  let isOpen = win.SidebarController.isOpen;
  const closeButton = document.getElementById('sidebar-close');
  let pinned = false;

  /**
   * Sidebar margin - depends on Zen sidebar (tabs) width
   */
  const navigatorToolbox = document.getElementById("navigator-toolbox");
  if (navigatorToolbox) {
    // Get initial width from computed style
    const computedStyle = getComputedStyle(navigatorToolbox);
    const navigatorWidth = computedStyle.getPropertyValue('--actual-zen-sidebar-width');
    sidebar.style.setProperty("--actual-zen-sidebar-width", navigatorWidth.trim() || '200px');

    // add observer for style changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const computedStyle = getComputedStyle(navigatorToolbox);
          const newWidth = computedStyle.getPropertyValue('--actual-zen-sidebar-width');
          sidebar.style.setProperty("--actual-zen-sidebar-width", newWidth.trim() || '200px');
        }
      });
    });

    // start observing the navigator-toolbox for style changes
    observer.observe(navigatorToolbox, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  // load styles
  const applyStyles = () => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = SIDEBAR_CSS;
    document.head.appendChild(styleSheet);
  };

  // Visual changes only - call when you need to check state of isOpen
  const toggleHandler = (changeState = true) => {
    if (changeState) isOpen = !isOpen;
    if (isOpen) {
      // opening the sidebar visually
      sidebar.classList.remove('close');
    } else {
      // closing the sidebar visually
      sidebar.classList.add('close');
    }
  };

  // Toggle shortcut (default is meta+key in macOS)
  document.addEventListener('keydown', (e) => {
    // Check for Cmd + E (MacOS)
    if (e.metaKey && e.key.toLowerCase() === 'e') {
      e.preventDefault(); // Prevent default browser behavior

      if (!win.SidebarController.isOpen) {
        win.SidebarController.toggle();
      }
      toggleHandler();
    }
  });

  // Clicking outside the sidebar or sidebar button will hide it
  document.addEventListener('click', (e) => {
    // Prevent hiding if clicking the default sidebar button or if pinned
    if (e.button !== 0 || !isOpen || e.target.id === "sidebar-button" || pinned) return;

    // Hide sidebar if clicking inside the main browser content area
    if (e.target.hasAttribute("contextmenu")) {
      toggleHandler();
    }
  });

  /**
   * Hide summarize button inside the GenAI sidebar iframe
   */
  const hideSummarizeBtn = () => {
    const browserEl = document.getElementById('sidebar');
    if (!browserEl) return;

    const tryHide = () => {
      try {
        const innerDoc = browserEl.contentDocument;
        if (!innerDoc) return;
        const btn = innerDoc.getElementById('summarize-btn-container');
        if (btn) {
          btn.style.setProperty('display', 'none', 'important');
        }
      } catch (e) {
        // cross-origin or not ready yet
      }
    };

    // Try immediately, then also on load in case the iframe reloads
    tryHide();
    browserEl.addEventListener('load', tryHide, true);
  };

  /**
   * PIN BUTTON 
   */
  const createPinButton = () => {
    if (!closeButton) return null;

    const pinButton = document.createElement('toolbarbutton');
    pinButton.id = 'sidebar-pin';
    pinButton.className = 'close-icon tabbable';
    pinButton.setAttribute('tooltiptext', 'Pin sidebar');

    // create and append img element
    const img = document.createElement('img');
    img.src = 'chrome://browser/skin/pin.svg';
    img.style.transform = "rotateY(180deg)";
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

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      // it can only be clicked when isOpen = true so toggle is safe here
      toggleHandler();
    });
  }
  // Override native sidebar button
  const nativeSidebarButton = document.getElementById("sidebar-button");
  if (nativeSidebarButton) {
    const toggleAction = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!win.SidebarController.isOpen) {
        win.SidebarController.toggle();
      }
      toggleHandler();
    };

    nativeSidebarButton.addEventListener('command', toggleAction, true);
    nativeSidebarButton.addEventListener('click', (e) => {
      if (e.button === 0) {
        toggleAction(e);
      }
    }, true);
  }

  // handling creation and changes visually with delay to let the dom load
  setTimeout(() => {
    createPinButton(); // Create the pin button
    hideSummarizeBtn();
    toggleHandler(false);
  }, 500);

  applyStyles();
})();
