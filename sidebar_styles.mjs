export const SIDEBAR_CSS = `
#sidebar-splitter {
  display: none !important;

}

/* default - hide */
#sidebar-box {
  position: absolute !important;
  left: 0;
  transform:translateX(10px);
  top: 5px !important;
  height: calc(100vh - 30px);
  max-height: calc(100vh - 30px);
  width: 450px;
  z-index: 10 !important;
  resize:both;

  border-radius: var(--zen-border-radius) !important;
  box-shadow: var(--box-shadow-10) !important;
  background: var(--zen-colors-tertiary) !important;
  border: 1px solid var(--zen-colors-border) !important;
  transition: transform 0.3s ease-in-out;

  /* initial visible value*/
}
/* Sidebar position (right) - has attribute means on the right*/
#sidebar-box[sidebar-positionend=""]{
  right:0 !important;
  left: inherit !important;
  transform: translateX(-10px) !important;
}
#sidebar-box[sidebar-positionend=""].close {
  transform: translateX(110%) !important;
  }

/* Sidebar position (left) (default) just add hide */
#sidebar-box.close{
  transform: translateX(calc(-110% - 200px)) !important;

}



/* mask image to look like sidebar */
#import-button {
  list-style-image: url('chrome://browser/skin/sidebars.svg') !important;
}

/* Make close button bigger */
#sidebar-close{
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