const CSS_CLASS_TOOLTIP_FADE_OUT = 'tt-fade-out';
const DOM_ID_ITEM_TOOLTIP = 'item-tooltip';
const DOM_ATTR_TOOLTIP_POSITION = 'tt-pos';
const TOOLTIP_POSITION_RIGHT = 'right';
const TOOLTIP_POSITION_LEFT = 'left';
const V_FN_HOVER_ITEM = 'hoverItem';
const CSS_TOOLTIP_ON_ZINDEX = 2;
const CSS_TOOLTIP_OFF_ZINDEX = 2;
const TIME_BEFORE_TOOLTIP_OFF_ZINDEX_CHANGE = 300; // milliseconds

const setTooltipPos = (event, el, binding, context) => {
  const tt = document.getElementById(DOM_ID_ITEM_TOOLTIP);
  let x = el.offsetLeft;
  let y = el.offsetTop;
  let parent = el;
  while( (parent = parent.offsetParent) ) {
    x += parent.offsetLeft;
    y += parent.offsetTop;
  }
  const maxWidth = window.innerWidth;
  // show below ?
  //y += tableRow.clientHeight + 1;
  // show right ?
  x += el.clientWidth + 1;
  // tooltip overflow right but not left if repositioned ?
  if( x + tt.clientWidth > maxWidth && x ) {
    x -= el.clientWidth + 1 + tt.clientWidth + 1;
    tt.setAttribute(DOM_ATTR_TOOLTIP_POSITION, TOOLTIP_POSITION_LEFT);
  } else {
    tt.setAttribute(DOM_ATTR_TOOLTIP_POSITION, TOOLTIP_POSITION_RIGHT);
  }
  // center vertically
  y -= (tt.clientHeight - el.clientHeight) / 2;

  tt.style.left = x +'px';
  tt.style.top = y + 'px';
}

let _timerID = null;

const showTT = (event, el, binding, context, vnode) => {
  const tt = document.getElementById(DOM_ID_ITEM_TOOLTIP);
  tt.classList.remove(CSS_CLASS_TOOLTIP_FADE_OUT);
  if( _timerID ) {
    window.clearTimeout(_timerID);
    _timerID = null;
  }
  tt.style.zIndex = CSS_TOOLTIP_ON_ZINDEX;
  if( !tt.hidden && binding.value.itemID === context.store.state.hoveredItem ) return;
  tt.hidden = false;
  context.store.commit(V_FN_HOVER_ITEM, binding.value.itemID);
  context.vm.$nextTick( () => setTooltipPos(event, el, binding, context) );
}

const hideTT = (event, el, binding, context) => {
  var tt = event._tt || context.tt || document.getElementById(DOM_ID_ITEM_TOOLTIP);
  tt.classList.add(CSS_CLASS_TOOLTIP_FADE_OUT);
  _timerID = window.setTimeout( () =>
    (tt.style.zIndex = CSS_TOOLTIP_OFF_ZINDEX), TIME_BEFORE_TOOLTIP_OFF_ZINDEX_CHANGE);
}

module.exports = {
  showTT,
  hideTT,
}
