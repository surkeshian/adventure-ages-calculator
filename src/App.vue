<template>
  <div id="app">
    <b-navbar variant="dark" type="dark" class="mb-2">
      <b-container>
        <b-navbar-brand>Adventure Ages Calculator</b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item v-b-modal.help-modal>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="help-icon" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
            </svg>
          </b-nav-item>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
    <router-view />
    <div style="flex:1"></div>
    <footer class="mb-2">
      <hr class="mb-2">
      <b-container>
          <b-row>
            <b-col>Project on <a href="https://github.com/surkeshian/adventure-ages-calculator">Github</a></b-col>
            <b-col class="text-right">Like this tool? <a href="#" v-b-modal.donate-modal>Donate</a></b-col>
          </b-row>
      </b-container>
    </footer>
    <b-modal id="help-modal" ok-only title="Help">
      <p>Enter numbers in the fields as they appear in the game e.g. <b class="no-break">12 AA</b>.</p>
      <p>Enter a target (e.g. for a mission or population upgrade) to see how long it will take to reach that target.</p>
      <p>Click on a field and:</p>
      <ul>
        <li>Scroll to go up/down by 1 of the current power e.g. <span class="no-break"><b>12 AA</b> -> <b>13 AA</b></span></li>
        <li>Shift + scroll to go up/down by 10 e.g. <span class="no-break"><b>12 AA</b> -> <b>22 AA</b></span></li>
        <li>Alt + scroll to go up/down by 0.1 e.g. <span class="no-break"><b>12 AA</b> -> <b>12.1 AA</b></span></li>
        <li>Ctrl + scroll to go up/down by a power e.g. <span class="no-break"><b>12 AA</b> -> <b>12 BB</b></span></li>
      </ul>
    </b-modal>
    <b-modal title="Donate" ok-only id="donate-modal">
      <p>This tool is completely free to use however you like, but if you want to you could 
        <a href="https://www.buymeacoffee.com/surkeshian" target="_blank">buy me a coffee</a> or send me some Bitcoin: bc1qy86xl64ge89p6vdggzv4es4cldw5m23cvvsr2z</p>
    </b-modal>
  </div>
</template>

<style>
html,
body {
  height: 100%;
}

#app {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

footer {
  color: #888;
  font-size: 14px;
}

.no-break {
  white-space: nowrap;
}

.help-icon {
  fill: white;
}

.help-icon:hover {
  opacity: 0.7;
}
</style>
