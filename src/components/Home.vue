<template>
  <!-- REVIEW: Subsequent unused components are removed with SCSS -->
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
          <label class="label"  for="GoToInput">Enemy<br />Element</label>
          <input id="GoToInput" class="input" />
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
      <span class="switch">
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
  <!-- checkbox, Radio -->
  <div class="row">
    <div class="col-12">
      <span class="checkbox">
        <label>
          <input type="checkbox" checked="">
          <p>Checkbox</p>
          <span></span>
        </label>
      </span>
      <span class="checkbox">
        <label>
          <input type="checkbox" disabled>
          <p>Disabled</p>
          <span></span>
        </label>
      </span>
      <span class="checkbox">
        <label>
          <input type="checkbox" checked="" disabled>
          <p>Check:Dis</p>
          <span></span>
        </label>
      </span>
      <span class="radio">
        <label>
          <input name="radio-test" type="radio" checked="">
          <p>Select1</p>
          <span></span>
        </label>
      </span>
      <span class="radio">
        <label>
          <input name="radio-test" type="radio" checked="">
          <p>Select2</p>
          <span></span>
        </label>
      </span>
      <span class="radio">
        <label>
          <input type="radio" disabled>
          <p>Disabled</p>
          <span></span>
        </label>
      </span>
      <span class="radio">
        <label>
          <input type="radio" checked="" disabled>
          <p>Check:Dis</p>
          <span></span>
        </label>
      </span>
    </div>
  </div>
  <!-- button -->
</div>
</template>

<script>
export default {

}
</script>
