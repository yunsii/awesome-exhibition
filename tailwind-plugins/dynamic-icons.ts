import { addDynamicIconSelectors } from 'tailwindcss-plugin-iconify'

export default addDynamicIconSelectors({
  prefix: 'i',
  preprocessSets: ['mdi'],
})
