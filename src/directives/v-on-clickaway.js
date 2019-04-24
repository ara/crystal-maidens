
const bind = function (el, binding, vnode) {
  el.clickOutsideEvent = function (event) {
    // check if click was outside el and his childrens
      if( el == event.target || el.contains(event.target) ) return;
      // outside => call provided method
      vnode.context[binding.expression](event);
  };
  document.body.addEventListener('click', el.clickOutsideEvent)
}

const update = function (el, binding) {
  if (binding.value === binding.oldValue) return;
  bind(el, binding);
}

const unbind = function (el) {
  document.body.removeEventListener('click', el.clickOutsideEvent)
}

exports.onClickaway = {
  bind,
  update,
  unbind,
};
