## How to use
  1. Install fx-autoconfig https://github.com/MrOtherGuy/fx-autoconfig
  2. copy the `sidebar_tweaks.uc.mjs` and `sidebar_styles.mjs` into JS folder.
  3. make sure `browser.ml.chat.enabled` is set to true in `about:config` to use the AI chat bots.
  4. make sure "sidebars" tooltip is being placed on somewhere. (my suggestion would be to place it in the top navbar - you won't need to interact with it)
  5. make sure "import-button" tooltip is being placed (or other unused tooltip button - but change it's id) in your desired location - it will act as toggle button.
  -  to get id of a tooltip use browser toolbox - inspect and get it's id - change it in `toggleButton` const value.
  - the toggle button icon you used will be replaced automatically to sidebar one.
  7. change the shortcut  to the desired one, just make sure it won't colldie with other shortcuts.

## Demo
<video src="https://f3zt4im3rd.ufs.sh/f/F0BpEl6F0ft7PzcsQTRvrbtkge5fz1QJnq3NTuYURs9F8lXp" controls></video>