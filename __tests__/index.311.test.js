import App from '../src/js/App'
import Content from '../src/js/Content'
import hurricane from '../src/js/hurricane'

jest.mock('../src/js/App')

describe('is 311', () => {
  const is311 = hurricane.IS_311

  beforeEach(() => {
    hurricane.IS_311 = true
  })
  afterEach(() => {
    hurricane.IS_311 = is311
  })

  test('is 311', () => {
    expect.assertions(4)

    require('../src/js/index')

    const test = async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          expect(App).toHaveBeenCalledTimes(1)
          expect(App.mock.calls[0][0] instanceof Content).toBe(true)
          expect($('head').children().last().attr('href')).toBe('css/311.css')
          resolve(true)
        }, 500)
      })
    }
  
    return test().then(result => {expect(result).toBe(true)})
  })
})
