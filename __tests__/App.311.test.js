import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import Decorate from 'nyc-lib/nyc/ol/format/Decorate'
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip'
import App from '../src/js/App'
import Content from './Content.mock'
import hurricane from '../src/js/hurricane'
import style from '../src/js/style'
import decorations from '../src/js/decorations'
import Slider from 'nyc-lib/nyc/Slider'
import Share from 'nyc-lib/nyc/Share'
import OlFeature from 'ol/Feature'
import $, { ready } from 'jquery'
import {notWaterZone} from './features.mock'

jest.mock('nyc-lib/nyc/ol/FeatureTip')
jest.mock('nyc-lib/nyc/Slider')
jest.mock('nyc-lib/nyc/Share')

let legend
const adjustTabs = App.prototype.adjustTabs
const tabChange = App.prototype.tabChange
const is311 = hurricane.IS_311
const showSplash = App.prototype.showSplash

beforeEach(() => {
  $.resetMocks()
  hurricane.IS_311 = true
  App.prototype.adjustTabs = jest.fn()
  App.prototype.tabChange = jest.fn()
  App.prototype.showSplash = jest.fn()
  legend = $('<div id="legend"><div class="leg-sw zone"></div></div>')
  $('body').append(legend)
  FeatureTip.mockReset()
  Slider.mockReset()
  Share.mockReset()
})
afterEach(() => {
  hurricane.IS_311 = is311
  App.prototype.adjustTab = adjustTabs
  App.prototype.tabChange = tabChange
  App.prototype.showSplash = showSplash
  $('body').empty()
})

describe('constructor/ready', () => {
  const ready = App.prototype.ready

  beforeEach(() => {
    App.prototype.ready = () => {}
  })
  afterEach(() => {
    App.prototype.ready = ready
  })

  test('constructor/ready', done => {
    expect.assertions(47)
      
    const content = new Content()
    const app = new App(content)
  
    expect(app instanceof App).toBe(true)
    expect(app instanceof FinderApp).toBe(true)
  
    expect(app.content).toBe(content)
  
    expect(app.layer.getSource()).toBe(app.source)
    expect(app.layer.getStyle()).toBe(style.center)
    expect(app.layer.getZIndex()).toBe(1)
    expect(app.source.getUrl()).toBe(hurricane.CENTER_URL)
  
    expect(app.source.getFormat() instanceof Decorate).toBe(true)
    expect(app.source.getFormat().decorations.length).toBe(4)
    expect(app.source.getFormat().decorations[0]).toBe(FinderApp.FEATURE_DECORATIONS)  
    expect(app.source.getFormat().decorations[1].app).toBe(app)
    expect(app.source.getFormat().decorations[2].content).toBe(content)
    expect(app.source.getFormat().decorations[3]).toBe(decorations.center)
  
    expect(app.source.getFormat().parentFormat instanceof CsvPoint).toBe(true)
    expect(app.source.getFormat().parentFormat.dataProjection.getCode()).toBe('EPSG:2263')
    expect(app.source.getFormat().parentFormat.x).toBe('X')
    expect(app.source.getFormat().parentFormat.y).toBe('Y')
  
    expect(app.tabs.find('.btn-0').html()).toBe('Map')
    expect(app.tabs.find('.btn-1').html()).toBe(content.message('centers_tab'))
    expect(app.tabs.find('.btn-2').html()).toBe('Legend')
  
    expect(app.tabs.tabs.find('.tab-0').get(0)).toBe($('#map').get(0))
    expect(app.tabs.tabs.find('.tab-1').get(0)).toBe($('#facilities').get(0))
    expect(app.tabs.tabs.find('.tab-2').get(0)).toBe($('#legend').get(0))
  
    expect(app.filters.choiceControls.length).toBe(1)
    expect(app.filters.choiceControls[0].radio).toBe(true)
    expect(app.filters.choiceControls[0].choices.length).toBe(2)
  
    expect(app.filters.choiceControls[0].choices[0].label).toBe(`All ${content.message('filter_centers')}`)
    expect(app.filters.choiceControls[0].choices[0].name).toBe('ACCESSIBLE')
    expect(app.filters.choiceControls[0].choices[0].values).toEqual(['N', 'Y'])
    expect(app.filters.choiceControls[0].choices[0].checked).toBe(true)
  
    expect(app.filters.choiceControls[0].choices[1].label).toBe(`<div></div>Only accessible ${content.message('filter_centers')}`)
    expect(app.filters.choiceControls[0].choices[1].name).toBe('ACCESSIBLE')
    expect(app.filters.choiceControls[0].choices[1].values).toEqual(['Y'])
    expect(app.filters.choiceControls[0].choices[1].checked).not.toBe(true)
  
    expect(app.zoneLayer.getSource()).toBe(app.zoneSource)
    expect(app.zoneLayer.getStyle()).toBe(style.zone)
    expect(app.zoneLayer.getOpacity()).toBe(.35)
    expect(app.zoneSource.getUrl()).toBe(hurricane.ZONE_URL)  
  
    const layers = app.map.getLayers().getArray()
  
    expect(layers[layers.length - 1]).toBe(app.zoneLayer)
  
    const mockFeature = notWaterZone
    mockFeature.content = {
      message: jest.fn(() => {return 'mock-html'}),
      zoneMsg: jest.fn(() => {return 'mock-order'})
    }
    mockFeature.getZone = jest.fn(() => {return 'mock-zone'})
  
    const label = FeatureTip.mock.calls[2][0].tips[0].label(mockFeature)
  
    expect(label.css).toBe('zone')
    expect(label.html).toBe('mock-html')
    expect(mockFeature.content.message).toHaveBeenCalledTimes(1)
    expect(mockFeature.content.message.mock.calls[0][0]).toBe('zone_tip')
    expect(mockFeature.content.message.mock.calls[0][1].zone).toBe('mock-zone')
    expect(mockFeature.content.message.mock.calls[0][1].order).toBe('mock-order')
  
    app.tabs.open = jest.fn()
    app.ready = ready
    app.ready([])
  
    setTimeout(() => {
      expect(app.tabs.open).toHaveBeenCalledTimes(1)
      expect(app.tabs.open.mock.calls[0][0]).toBe('#facilities')
      done()
    }, 2000)
  })
})

test('isMobile', () => {
  expect.assertions(2)
  
  const content = new Content()    
  
  const app = new App(content)

  $('#tabs .btns>h2:first-of-type').hide()

  expect(app.isMobile()).toBe(true)

  $('#tabs .btns>h2:first-of-type').show()

  expect(app.isMobile()).toBe(true)

})

describe('located', () => {
  const resetList = FinderApp.prototype.resetList
  const isMobile = App.prototype.isMobile
  
  beforeEach(() => {
    App.prototype.isMobile = () => {return true}
    FinderApp.prototype.resetList = jest.fn()
  })
  afterEach(() => {
    FinderApp.prototype.resetList = resetList
    App.prototype.isMobile = isMobile
  })

  test('located - facility tab is active, not mobile', () => {
    expect.assertions(13)
    
    const content = new Content()
    const app = new App(content)
  
    app.locationMsg = jest.fn(() => {
      return 'mock-html'
    })
      
    const pop = $(app.popup.getElement())
    
    app.popup.showFeatures = jest.fn(() => {
      pop.find('.content').append('<h2></h2>').show()
    })
    app.popup.pan = jest.fn()

    const location = {coordinate: [1, 2]}
  
    app.tabs.active = $('#facilities')
    
    app.located(location)
  
    app.tabs.trigger('change')
    expect(app.popup.pan).toHaveBeenCalledTimes(1)
  
    expect(FinderApp.prototype.resetList).toHaveBeenCalledTimes(1)
    expect(app.location).toBe(location)

    expect(app.locationMsg).toHaveBeenCalledTimes(1)
    expect(app.locationMsg.mock.calls[0][0]).toBe(location)
  
    expect(app.popup.showFeatures).toHaveBeenCalledTimes(1)
    expect(app.popup.showFeatures.mock.calls[0][0].length).toBe(1)
    expect(app.popup.showFeatures.mock.calls[0][0][0] instanceof OlFeature).toBe(true)
    expect(app.popup.showFeatures.mock.calls[0][0][0].getGeometry().getCoordinates()).toEqual(location.coordinate)
    expect(app.popup.showFeatures.mock.calls[0][0][0].html()).toBe('mock-html')
      
    expect(document.activeElement).toBe(pop.find('h2').get(0))
    expect(pop.find('h2').attr('tabindex')).toBe('0')
  
    app.tabs.open = jest.fn()
    pop.find('.btn-x').trigger('click')
  
    expect(app.tabs.open).toHaveBeenCalledTimes(0)
  })

  test('located - facility tab is active, is mobile', () => {
    expect.assertions(13)
    
    const content = new Content()
    const app = new App(content)
  
    app.locationMsg = jest.fn(() => {
      return 'mock-html'
    })
      
    const pop = $(app.popup.getElement())
    
    app.popup.showFeatures = jest.fn(() => {
      pop.find('.content').append('<h2></h2>').show()
    })
    app.popup.pan = jest.fn()

    const location = {coordinate: [1, 2]}
  
    app.tabs.active = $('#facilities')
        
    app.located(location)
  
    app.tabs.trigger('change')
    expect(app.popup.pan).toHaveBeenCalledTimes(1)
  
    expect(FinderApp.prototype.resetList).toHaveBeenCalledTimes(1)
    expect(app.location).toBe(location)

    expect(app.locationMsg).toHaveBeenCalledTimes(1)
    expect(app.locationMsg.mock.calls[0][0]).toBe(location)
  
    expect(app.popup.showFeatures).toHaveBeenCalledTimes(1)
    expect(app.popup.showFeatures.mock.calls[0][0].length).toBe(1)
    expect(app.popup.showFeatures.mock.calls[0][0][0] instanceof OlFeature).toBe(true)
    expect(app.popup.showFeatures.mock.calls[0][0][0].getGeometry().getCoordinates()).toEqual(location.coordinate)
    expect(app.popup.showFeatures.mock.calls[0][0][0].html()).toBe('mock-html')
      
    expect(document.activeElement).toBe(pop.find('h2').get(0))
    expect(pop.find('h2').attr('tabindex')).toBe('0')
  
    app.tabs.open = jest.fn()
    pop.find('.btn-x').trigger('click')
  
    expect(app.tabs.open).toHaveBeenCalledTimes(0)
  })
})