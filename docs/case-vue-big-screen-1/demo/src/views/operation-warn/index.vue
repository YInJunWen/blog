<template>
  <div class="operation_warn_page">
    <div class="muted_tips" v-if="muted">
      <div class="content">告警声音已被关闭，请点击右上角打开</div>
    </div>
    <div class="header">
      <span>一体化运维告警平台</span>
      <div class="audio" @click="toggleAudioMute">
        <img v-if="muted" :src="require('./images/audio_muted.png')" alt="" />
        <img v-if="!muted" :src="require('./images/audio.png')" alt="" />
      </div>
    </div>
    <div class="container">
      <div class="list_wrapper" style="color: white">
        <div class="pane_item" v-for="(item, key) in list" :key="key">
          <Pane :detail="item" @list-changed="listChanged" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PaneComponent from './pane/index';
import { debounce } from 'lodash';

export default {
  name: 'operation-warn',
  components: {
    Pane: PaneComponent,
  },
  data() {
    return {
      audio: null,
      muted: true,
      list: [
        {
          id: 1,
          title: '操作系统',
        },
        {
          id: 2,
          title: '服务器',
        },
        {
          id: 3,
          title: '数据库',
        },
        {
          id: 4,
          title: '存储',
        },
        {
          id: 5,
          title: '网络设备',
        },
        {
          id: 6,
          title: '中间件',
        },
      ],
      pageSize: 2,
    };
  },
  mounted() {
    this._listChanged = debounce(
      (data) => {
        // console.log('listChanged', data);
        // console.log(data);
        this.audio.currentTime = 0;
        this.audio
          .play()
          .then((_) => {
            console.log(_);
          })
          .catch((e) => {
            console.log(e);
          });
      },
      300,
      {
        leading: true,
        trailing: false,
      }
    );
    this.$nextTick(() => {
      const audio = new Audio(require('./audio/warning.mp3'));
      console.log(audio);
      audio.controls = true;
      audio.style.position = 'fixed';
      audio.style.top = '0';
      audio.style.left = '0';
      audio.muted = true;
      this.muted = true;
      audio.addEventListener('canplaythrough', (event) => {
        /* 音频可以播放；如果权限允许则播放 */
        console.log('canplaythrough');
      });
      this.audio = audio;
    });
  },
  methods: {
    toggleAudioMute() {
      console.log(this.audio.muted);
      this.audio.muted = !this.audio.muted;
      this.muted = !this.muted;
    },

    listChanged(data) {
      console.log(data);
      this._listChanged(data);
    },
  },
};
</script>
<style lang="scss" scoped src="./style.scss"></style>
