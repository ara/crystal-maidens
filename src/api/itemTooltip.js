const setTooltipPos = (event, el, binding, context) => {
  const tt = context.tt || document.getElementById('item-tooltip');
  tt.hidden = false;
  const parent = el.offsetParent;
  const maxWidth = window.innerWidth;
  let x = (parent ? parent.offsetLeft: 0) + el.offsetLeft;
  let y = (parent ? parent.offsetTop : 0) + el.offsetTop;
  // show below ?
  //y += tableRow.clientHeight + 1;
  // show right ?
  x += el.clientWidth + 1;
  // tooltip overflow right but not left if repositioned ?
  if( x + tt.clientWidth > maxWidth && x ) {
    const prevX = x;
    x -= el.clientWidth + 1 + tt.clientWidth + 1;
    tt.setAttribute('tt-pos', 'left');
  } else {
    tt.setAttribute('tt-pos', 'right');
  }
  // center vertically
  y -= (tt.clientHeight - el.clientHeight) / 2;

  tt.style.left = x +'px';
  tt.style.top = y + 'px';
}

const showTT = (event, el, binding, context, vnode) => {
  // console.log('[showTT] vnode.context.$store._vm', vnode.context.$store._vm.$nextTick);
  console.log('[showTT] vnode.context / context', vnode.context, context);
  const store = context.store;
  const tt = context.tt || document.getElementById('item-tooltip');
  const item = binding.value.item;
  if( item === store.state.hoveredItem && !tt.hidden ) return;
  store.commit('hoverItem', item);
  context.vm.$nextTick( () => setTooltipPos(event, el, binding, context) );
}

const hideTT = (event, el, binding, context) => {
  var tt = context.tt || document.getElementById('item-tooltip');
  tt.hidden = true;
}

module.exports = {
  showTT,
  hideTT,
}
