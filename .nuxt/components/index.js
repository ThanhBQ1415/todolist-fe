export { default as Header } from '../..\\components\\Header.vue'
export { default as LoginForgotPassword } from '../..\\components\\login\\ForgotPassword.vue'
export { default as LoginRegister } from '../..\\components\\login\\Register.vue'
export { default as ProjectCard } from '../..\\components\\project\\ProjectCard.vue'
export { default as TaskAddTaskDialog } from '../..\\components\\task\\AddTaskDialog.vue'
export { default as TaskDetailDialog } from '../..\\components\\task\\TaskDetailDialog.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
