<template>
  <div class="nav-container">

    <ul class="nav-bar">
<!--       <li  v-for="(tools) in tools" @click="updateCurrent(tools)">
          <a href="#" class="nav-home"></a>
      </li> -->
      <li class="nav-item"></li>
      <li class="nav-item"><a href="#" class="nav-info">Info</a></li>
      <li class="nav-item"><a href="#" class="nav-console">Console</a></li>
    </ul>
  </div>
</template>
<script>

export default {
  name: 'Nav',
  props: ['tools'],
  created () {
    // window.addEventListener('keyup', this.keyup)
    // window.addEventListener('keydown', this.down)
  },
  data () {
    return {
     selectedTool: "",
     // hoverIndex: -1,
     // activeClass: 'active',
     // hoverClass: 'hovered'
    }

  },
  filters:{
  },
  methods: {
    updateCurrent (packet, index) {
      this.selectedPacket = packet;
      this.selectedIndex = index;
      this.hoverIndex = index;
    },
    keyup (e) {
      //DOWN
      if((e.keyCode || e.which) === 40 ){
        if(this.hoverIndex < this.packets.length){
            this.hoverIndex += 1;
        }
        if(document.getElementsByClassName('hovered')){
          const cur =   document.getElementsByClassName('hovered')[0];
          if(cur){
            const id = cur.id.split('-')
            const index =id.pop()
            this.selectedPacket = this.packets[index];
            cur.scrollIntoViewIfNeeded({block: "end", behavior: "smooth"});
          }

        }
      }
      //UP
      else if((e.keyCode || e.which) === 38 ){
        if(this.hoverIndex > 0){
            this.hoverIndex -= 1;
        }
        if(document.getElementsByClassName('hovered')){
          const cur =   document.getElementsByClassName('hovered')[0];
          if(cur){
            const id = cur.id.split('-')
            const index =id.pop()
            this.selectedPacket = this.packets[index];
            cur.scrollIntoViewIfNeeded({block: "end", behavior: "smooth"});
          }

        }
      }
      else if((e.keyCode || e.which) === 13 ){
        if(document.getElementsByClassName('hovered')){
          const cur =   document.getElementsByClassName('hovered')[0];
          if(cur){
            const id = cur.id.split('-')
            const index =id.pop()
            this.selectedPacket = this.packets[index];
          }
        }
      }

    }
  }
}
</script>

<style scoped>

</style>
