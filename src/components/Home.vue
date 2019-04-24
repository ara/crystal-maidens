<template>
<div class="container">
  <!-- input -->
  <div class="row">
    <div class="col-4">
      <div class="portlet">
        <div class="form-group">
          <label class="label">Class</label>
          <select class="input">
            <option>
              Marksman
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="label">Enemy<br />Element</label>
          <input class="input" />
        </div>
        <div class="form-group">
          <label class="label">Camp Lvl</label>
          <input class="input" type="number" />
        </div>
      </div>
    </div>
    <div class="col-4">
      <div class="portlet">
        <div class="form-group">
          <label class="label">Class</label>
          <select class="input">
            <option>
              Marksman
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="label">Enemy<br />Element</label>
          <input class="input" disabled />
        </div>
        <div class="form-group">
          <label class="label">Camp Lvl</label>
          <input class="input" type="number" />
        </div>
      </div>
    </div>
  </div>
  <!-- switch -->
  <div class="row">
    <div class="col-12">
      <span class="switch switch-blue">
        <label>
          <input type="checkbox" checked="">
          <span></span>
        </label>
      </span>
      <span class="switch switch-sky">
        <label>
          <input type="checkbox" checked="">
          <span></span>
        </label>
      </span>
      <span class="switch switch-cyan">
        <label>
          <input type="checkbox" checked="">
          <span></span>
        </label>
      </span>
      <span class="switch switch-mint">
        <label>
          <input type="checkbox" checked="">
          <span></span>
        </label>
      </span>
      <span class="switch switch-lime">
        <label>
          <input type="checkbox" checked="">
          <span></span>
        </label>
      </span>
      <span class="switch switch-yellow">
        <label>
          <input type="checkbox" checked="">
          <span></span>
        </label>
      </span>
      </span>
      <span class="switch switch-orange">
        <label>
          <input type="checkbox" checked="">
          <span></span>
        </label>
      </span>
      <span class="switch switch-red">
        <label>
          <input type="checkbox" checked="">
          <span></span>
        </label>
      </span>
      <span class="switch switch-purple">
        <label>
          <input type="checkbox" checked="">
          <span></span>
        </label>
      </span>
      <span class="switch">
        <label>
          <input type="checkbox" disabled>
          <span></span>
        </label>
      </span>
      <span class="switch">
        <label>
          <input type="checkbox" checked="" disabled>
          <span></span>
        </label>
      </span>
    </div>
  </div>
  <!-- checkbox -->
</div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
// @import '../assets/css/main.scss';
</style>
