<template>
  <div class="wrapper-body">
      <div class="warning shadow p-5">
          <div class="warning-info px-5 py-4">
              <h5>{{ msg }}</h5>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    props : ['msg']
}
</script>

<style scoped>
    .wrapper-body{
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
        top: 0;
        left: 0;
    }
    .warning{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    .warning-info{
        border-radius: 10px;
        background-color: #f05656;
        color: white;
    }
</style>