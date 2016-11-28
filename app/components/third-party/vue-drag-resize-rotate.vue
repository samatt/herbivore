<template>
    <div class='dragable' @mousedown='handleDown' @mouseup='handleUp' :style='boxStyle'>
        <slot></slot>
        <div class='rotate' @mousedown.stop='rotateStart'></div>
        <div class='scale' @mousedown.stop='resizeStart'></div>
    </div>
</template>

<script>
import Vector from 'victor'
let findInArray =  function (array, callback) {
  for (let i = 0, length = array.length; i < length; i++) {
    if (callback.apply(callback, [array[i], i, array])) return array[i];
  }
}
let isFunction  = function (func) {
  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
}
let isNum = function(num) {
  return typeof num === 'number' && !isNaN(num);
}
let int =  function (a) {
  return parseInt(a, 10);
}
let outerHeight = function (node) {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  let height = node.clientHeight;
  let computedStyle = window.getComputedStyle(node);
  height += int(computedStyle.borderTopWidth);
  height += int(computedStyle.borderBottomWidth);
  // height += int(computedStyle.marginTop);
  // height += int(computedStyle.marginBottom);
  return height;
}
let outerWidth = function(node) {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetLeft which is including margin. See getBoundPosition
  let width = node.clientWidth;
  let computedStyle = window.getComputedStyle(node);
  width += int(computedStyle.borderLeftWidth);
  width += int(computedStyle.borderRightWidth);
  // width += int(computedStyle.marginLeft);
  // width += int(computedStyle.marginRight);
  return width;
}
let innerHeight = function (node) {
  let height = node.clientHeight;
  let computedStyle = window.getComputedStyle(node);
  height -= int(computedStyle.paddingTop);
  height -= int(computedStyle.paddingBottom);
  return height;
}
let innerWidth =  function (node) {
  let width = node.clientWidth;
  let computedStyle = window.getComputedStyle(node);
  width -= int(computedStyle.paddingLeft);
  width -= int(computedStyle.paddingRight);
  return width;
}
let matchesSelectorFunc = '';
let matchesSelector =  function (el, selector) {
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = findInArray([
      'matches',
      'webkitMatchesSelector',
      'mozMatchesSelector',
      'msMatchesSelector',
      'oMatchesSelector'
    ], function(method){
      return isFunction(el[method]);
    });
  }
  return el[matchesSelectorFunc].call(el, selector);
}
let getBoundPosition = function(bounds,node,clientX, clientY) {
  // If no bounds, short-circuit and move on
  if (!bounds) return [clientX, clientY];
  let parent = node.parentNode;
  if (bounds.parent) {
    let nodeStyle = window.getComputedStyle(node);
    let parentStyle = window.getComputedStyle(parent);
    // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.
    bounds = {
      left: -node.offsetLeft + int(parentStyle.paddingLeft) +
            int(nodeStyle.borderLeftWidth) + int(nodeStyle.marginLeft),
      top: -node.offsetTop + int(parentStyle.paddingTop) +
            int(nodeStyle.borderTopWidth) + int(nodeStyle.marginTop),
      right: innerWidth(parent)  - node.offsetLeft - outerWidth(node) ,
      bottom: innerHeight(parent)  - outerHeight(node) - node.offsetTop
    };
  }
  // Keep x and y below right and bottom limits...
  if (isNum(bounds.right)) clientX = Math.min(clientX, bounds.right);
  if (isNum(bounds.bottom)) clientY = Math.min(clientY, bounds.bottom);
  // But above left and top limits.
  if (isNum(bounds.left)) clientX = Math.max(clientX, bounds.left);
  if (isNum(bounds.top)) clientY = Math.max(clientY, bounds.top);
  return [clientX, clientY];
}
export default {
  replace:true,
  name:'dragable',
  props:{
      w:{
          type:Number,
          default:200
      },
      h:{
          type:Number,
          default:200
      },
      x:{
          type:Number,
          default:0
      },
      y:{
          type:Number,
          default:0
      },
      r:{
          type:Number,
          default:0
      },
      rotatable:{
          type:Boolean,
          default:false
      },
      axis:{
          type:String,
          default:'both'
      },
      handle:{
        type:String,
        default:''
      },
      cancel:{
        type:String,
        default:''
      },
      grid:{
        type:Array,
        default:function(){
          return [0,0]
        }
      },
      bounds:{
        type:Object,
        default:null
      }
  },
  ready:function(){
    var el = document.documentElement
    var event = 'mousemove'
    var handler= this.handleMove
    if (el.attachEvent) {
      el.attachEvent('on' + event, handler);
    } else if (el.addEventListener) {
      el.addEventListener(event, handler,true);
    } else {
      el['on' + event] = handler;
    }
    if(!this.rotatable){
      this.$el.getElementsByClassName('rotate')[0].className='';
    }else{
      this.rotate = this.r
    }
  },
  beforeDestroy:function(){
    var el = document.documentElement
    var event = 'mousemove'
    var handler= this.handleMove
    if (el.detachEvent) {
      el.detachEvent('on' + event, handler);
    } else if (el.removeEventListener) {
      el.removeEventListener(event, handler,true);
    } else {
      el['on' + event] = null;
    }
  },
  methods: {
      getRotateAngle:function(x,y){
        var rCenter = this._getCenter()
        var vStart = new Vector(this.rotateStartX - rCenter.x, this.rotateStartY - rCenter.y)
        var vEnd = new Vector(x - rCenter.x, y - rCenter.y)
        return vEnd.angleDeg() - vStart.angleDeg()
      },
      _getCenter:function(){
        var rect = this.$el.getBoundingClientRect()
        return {
          x: (rect.left + rect.right) / 2,
          y: (rect.bottom + rect.top) / 2
        }
      },
      rotateStart:function(e){
        if(this.rotatable){
          this.rotateStartX = e.clientX
          this.rotateStartY = e.clientY
          this.rotating = true
        }
      },
      resizeStart:function(e){
          this.resizeStartX = e.clientX
          this.resizeStartY = e.clientY
          this.resizing = true
          this.lastW = this.w
          this.lastH = this.h
      },
      handleDown: function(e) {
        if(this.handle && !matchesSelector(e.target, this.handle)){
          return
        }
        if(this.cancel && matchesSelector(e.target, this.cancel)){
          return
        }
        if(!this.lastX){
          this.lastX = e.clientX
          this.lastY = e.clientY
        }
        this.dragging = true
      },
      handleUp: function(e) {
        this.dragging = false
        this.resizing = false
        this.rotating = false
      },
      handleMove: function(e){
        if(e.stopPropagation) e.stopPropagation();
        if(e.preventDefault) e.preventDefault();
        if(this.dragging){
          let deltax = e.clientX - this.lastX
          let deltay = e.clientY - this.lastY
          let deltaxround = Math.round(deltax / this.grid[0]) * this.grid[0]
          let deltayround = Math.round(deltay / this.grid[1]) * this.grid[1]
          let thisx = this.x
          let thisy = this.y
          if(this.grid[0]>0 && this.grid[1]>0){
            if(this.axis === 'both'){
              thisx = deltaxround
              thisy = deltayround
            }else if(this.axis === 'x'){
              thisx = deltaxround
            }else if(this.axis === 'y'){
              thisy = deltayround
            }
          }else{
            if(this.axis === 'both'){
              thisx = e.clientX - this.lastX
              thisy = e.clientY - this.lastY
            }else if(this.axis === 'x'){
              thisx = e.clientX - this.lastX
            }else if(this.axis === 'y'){
              thisy = e.clientY - this.lastY
            }
          }
         if(this.bounds){
            [thisx,thisy] =  getBoundPosition(this.bounds,this.$el,thisx,thisy)
         }
          this.x = thisx
          this.y = thisy
        }
        if(this.resizing){
          this.w = parseInt(this.lastW) + parseInt(e.clientX) - parseInt(this.resizeStartX)
          this.h = parseInt(this.lastH) + parseInt(e.clientY) - parseInt(this.resizeStartY)
        }
        if(this.rotating){
          this.rotate = parseInt(this.r) + this.getRotateAngle(e.clientX, e.clientY)
        }
      }
  },
  data: function(){
    return {
      lastX: 0,
      lastY: 0,
      dragging:false,
      rotate: 0,
      resizeStartX:0,
      resizeStartY:0,
      rotateStartX:0,
      rotateStartY:0,
      resizing:false
    }
  },
  computed:{
      boxStyle:function (){
        return {
          width:this.w+'px',
          height:this.h+'px',
          transform:'translate('+this.x+'px,'+this.y+'px) rotate('+this.rotate+'deg)'
        }
      }
  }
}
</script>
<style scoped>
  .dragable {
        position: relative;
        border: 1px solid black;
        text-align: center;
        padding: 10px;
        background:#fff;
        box-sizing: border-box;
        overflow: hidden;
        float:left;
        margin:10px;
    }
    .scale {
      position: absolute;
      width: 20px;
      height: 20px;
      bottom: 0;
      right: 0;
      background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
      background-position: bottom right;
      padding: 0 3px 3px 0;
      background-repeat: no-repeat;
      background-origin: content-box;
      box-sizing: border-box;
      cursor: se-resize;
    }
    .rotate {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 0;
      right: 0;
      background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjYiIGhlaWdodD0iNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgZmlsbD0ibm9uZSIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9IjQwMiIgd2lkdGg9IjU4MiIgeT0iLTEiIHg9Ii0xIi8+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPGcgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDMuMDAwMDAwMDAwMDAwMDAwNCwzKSAiIGlkPSJzdmdfMSIgb3BhY2l0eT0iMC4zMDIiPgogICA8cGF0aCBpZD0ic3ZnXzIiIGZpbGw9IiMwMDAwMDAiIGQ9Im02LDZsLTYsMGwwLC0xLjhsNCwwbDAuMiwwbDAsLTQuMmwxLjgsMGwwLDZsMCwweiIvPgogIDwvZz4KIDwvZz4KPC9zdmc+');
      background-position: top right;
      padding: 3px 3px 0px 0;
      background-repeat: no-repeat;
      background-origin: content-box;
      box-sizing: border-box;
      cursor: se-resize;
    }
</style>