<template>
  <div class="slider_wrapper">
    <div class="container" ref="container">
      <span
        v-for="item in [1, 2, 3, 4]"
        :key="item"
        :style="{ marginRight: spaceWidth + 'px' }"
        >
        {{ text }}
        </span
      >
    </div>
  </div>
</template>
<script>
export default {
  name: 'slider-text',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      spaceWidth: 50,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.animation();
    });
  },
  methods: {
    animation() {
      const ele = this.$refs.container.firstElementChild;
      // console.log(ele);
      const cellEle = ele.parentElement;
      cellEle.addEventListener(
        'transitionend',
        () => {
          cellEle.style.transition = 'none';
          cellEle.style.left = 0;
          // no-unused-vars
          const w = cellEle.offsetWidth;
          this.$nextTick(() => {
            this.animation();
          });
        },
        {
          once: true,
        }
      );
      // 计算每条数据所需要的动画时间，保证看起来速度均匀
      const speed = (ele.offsetWidth + this.spaceWidth) / 20;
      cellEle.style.transition = `all ${speed}s linear`;
      cellEle.style.left = 0 - ele.offsetWidth - this.spaceWidth + 'px';
    },
  },
};
</script>
<style lang="scss" scoped>
.slider_wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .container {
    width: 400%;
    white-space: nowrap;
    position: absolute;
    left: 0;
  }
}
</style>