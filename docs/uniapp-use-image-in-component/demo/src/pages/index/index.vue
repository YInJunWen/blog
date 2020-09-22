<template>
  <view class="content">
    <view>普通引入：</view>
    <image class="logo" src="./images/camera.svg"></image>
    <view>require引入：</view>
    <image class="logo" :src="require('./images/camera.svg')"></image>
    <view>
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script src="./index.js">
</script>

<style src="./index.scss" lang='scss' scoped>
</style>
