<template>
  <div class="modal-wrapper">
    <form class="vform">
      <!-- <div v-for="item of data" :key="item.id">
        <label for="item.id">{{ item.name }}</label>
        <input v-model.lazy="item.name" id="item.id" type="text" />
      </div> -->
      <span @click="closeForm">
        <icon-erase class="vform__closeIcon" />
      </span>
      <div>
        <label for="name">name</label>
        <input v-model.lazy="item.name" id="name" type="text" />
      </div>
      <div>
        <label for="number">number</label>
        <input v-model.lazy="item.number" id="number" type="text" />
      </div>
      <button @action="submit"></button>
    </form>
  </div>
</template>

<script>
import IconErase from './icons/IconErase.vue'

export default {
  components: {
    IconErase
  },
  data() {
    return {
      item: {
        id: 1,
        name: 'namelabel',
        number: 10
      }
    }
  },
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    submit() {},
    closeForm() {
      console.log('close-form')
      this.$emit('close-form', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  background: rgba(0, 0, 0, 0.2);
  z-index: 1000;
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.vform {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #000000;
  border-radius: 8px;
  padding: 2.5rem;
  background-color: #ffffff;

  &__closeIcon {
    width: 1.5rem;
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
  }
}
</style>
