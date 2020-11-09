<template>
  <div class="pane_component">
    <div class="pane">
      <div class="title_wrapper">
        <div class="title" :class="{ active: dataChanged }">
          <span class="text">{{ detail.title }} &nbsp;</span>
          <span class="count">{{ list.length }}</span>
        </div>
        <div class="page">{{ pageNo }} / {{ page }}</div>
      </div>
      <div class="table" ref="table">
        <div class="th">
          <div class="td time">时间</div>
          <div class="td manager">负责人</div>
          <div class="td message">信息</div>
        </div>
        <div class="tr" v-for="item in showList" :key="item.id">
          <div class="td time">
            <div class="cell">
              {{ item.time }}
            </div>
          </div>
          <div class="td manager">
            <div class="cell">
              <slider-text :text="item.user"></slider-text>
            </div>
          </div>
          <div class="td message">
            <div class="cell">
              <slider-text :text="item.msg"></slider-text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAllList } from '@/api/operation-warn';
import Slider from '../slider/index';
export default {
  name: 'pane-component',
  components: {
    'slider-text': Slider,
  },
  props: {
    detail: {
      type: Object,
      default: function () {
        return {
          id: '',
          name: '',
          title: '',
        };
      },
    },
  },

  mounted() {
    //   根据pageSize计算pageNo，和实际展示的列表数据
    this.pageNo = 1;
    this.getAllList();
    window.addEventListener('resize', () => {
      this.$nextTick(() => {
        this.init();
      });
    });
  },
  data() {
    return {
      list: [],
      dataChanged: false,
      pageNo: 1,
      timer: null,
      pageSize: 1,
      refreshDuration: 10,
    };
  },
  watch: {},

  computed: {
    page() {
      if (this.list.length == 0) {
        return 0;
      } else {
        return Math.ceil(this.list.length / this.pageSize);
      }
    },
    showList() {
      if (this.list.length == 0) {
        return [];
      } else {
        return this.list.slice(
          (this.pageNo - 1) * this.pageSize,
          (this.pageNo - 1) * this.pageSize + this.pageSize
        );
      }
    },
  },
  methods: {
    init() {
      console.log('init');
      this.pageNo = 1;
      if (this.timer) clearTimeout(this.timer);
      // 获取每一行的高度，计算每页显示多少条数据
      const tableEle = document.querySelector('.table');
      const trEle = document.querySelector('.th');

      this.$nextTick(() => {
        this.pageSize = Math.floor(
          (tableEle.offsetHeight - trEle.offsetHeight) / trEle.offsetHeight
        );
        this.timer = setTimeout(() => {
          this.setTimer();
        }, this.refreshDuration * 1000);
      });
    },
    setTimer() {
      // if (this.detail.id == 'storage') {
      // console.log('set timer');
      // }
      // console.log(this.pageNo, this.page);
      if (this.list.length > 0) {
        if (this.pageNo == this.page) {
          this.getAllList();
          return false;
        } else {
          this.pageNo++;
        }
      } else {
        this.getAllList();
      }

      this.timer = setTimeout(() => {
        this.setTimer();
      }, this.refreshDuration * 1000);
    },

    getAllList() {
      getAllList()
        .then((res) => {
          // console.log(res.data, this.detail);
          try {
            console.log(this.list.length < res.data.list.length);
            if (this.list.length < res.data.list.length) {
              // console.log('list-changed');
              this.$emit('list-changed', {
                id: this.detail.id,
              });
              this.dataChanged = true;
              setTimeout(() => {
                this.dataChanged = false;
              }, 2000);
            }
            this.list = res.data.list;
            if (this.list) this.init();
          } catch (e) {}
        })
        .catch((_) => {
          console.log(_);
        })
        .finally((_) => {});
    },
  },
};
</script>

<style lang="scss" scoped src="./style.scss"></style>