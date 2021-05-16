<template>
  <div id="app">
    <b-navbar variant="dark" type="dark" class="mb-2">
      <b-container>
        <b-navbar-brand>Adventure Ages Calculator</b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item v-b-modal.help-modal>?</b-nav-item>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
    <router-view />
    <div style="flex:1"></div>
    <footer class="mb-2">
      <hr class="mb-2">
      <b-container>Project on <a href="">Github</a></b-container>
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
</style>
