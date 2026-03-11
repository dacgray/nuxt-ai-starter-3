import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import AppCounter from '~/components/AppCounter.vue'

describe('AppCounter', () => {
  it('renders initial count of 0', async () => {
    const wrapper = await mountSuspended(AppCounter)
    expect(wrapper.find('h3').text()).toBe('Counter: 0')
  })

  it('increments count when Increment is clicked', async () => {
    const wrapper = await mountSuspended(AppCounter)
    await wrapper.findAll('button')[0]!.trigger('click')
    expect(wrapper.find('h3').text()).toBe('Counter: 1')
  })

  it('decrements count when Decrement is clicked', async () => {
    const wrapper = await mountSuspended(AppCounter)
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.find('h3').text()).toBe('Counter: -1')
  })

  it('increments and decrements correctly across multiple clicks', async () => {
    const wrapper = await mountSuspended(AppCounter)
    const buttons = wrapper.findAll('button')
    const increment = buttons[0]!
    const decrement = buttons[1]!

    await increment.trigger('click')
    await increment.trigger('click')
    await increment.trigger('click')
    expect(wrapper.find('h3').text()).toBe('Counter: 3')

    await decrement.trigger('click')
    expect(wrapper.find('h3').text()).toBe('Counter: 2')
  })
})
