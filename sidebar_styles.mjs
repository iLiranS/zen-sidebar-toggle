export const SIDEBAR_CSS = `
#sidebar-splitter {
  display: none !important;
}

/* default - hide */
#sidebar-box {
  position: absolute !important;
  right: 0;
  top: 5px !important;
  height: calc(100vh - 30px) !important;
  width: 450px !important;
  z-index: 10 !important;

  border-radius: var(--zen-border-radius) !important;
  box-shadow: var(--box-shadow-10) !important;
  background: var(--zen-colors-tertiary) !important;
  border: 1px solid var(--zen-colors-border) !important;
  transition: transform 0.3s ease-in-out;
  transform: translateX(-10px);
  /* initial visible value*/
}

#sidebar-box.close {
  transform: translateX(110%);
}

/* mask image to look like sidebar */
#import-button {
  list-style-image: url('chrome://browser/skin/sidebars.svg') !important;
}
`