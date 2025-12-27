import janna from '@jannajs/lint/eslint'

export default janna({
  next: true,
  ignores: ['**/__tests__/**', '**/*.spec.*', '**/*.test.*'],
})
