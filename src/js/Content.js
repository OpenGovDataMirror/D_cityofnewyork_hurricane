/**
 * @module hurricane/Content
 */

import $ from 'jquery'
import hurricane from './hurricane'
import messages from './message'
import NycContent from 'nyc-lib/nyc/Content'
import Papa from 'papaparse'

require('isomorphic-fetch')

/**
 * @desc A class to manage hurricane evacuation messages
 * @public
 * @class
 * @mixes module:nyc/Content~Content
 */
class Content extends NycContent {
  /**
   * @desc Create an instance of Content
   * @public
	 * @param {module:hurricane/Content~Content#callback} callback
   * @constructor
   */
  constructor(callback) {
		super([])
		this.zoneOrders = {}
		this.evacuations = []
		NycContent.loadCsv({
			url: hurricane.CONTENT_URL,
			messages: [messages]
		}).then(content => {
			this.messages = content.messages
			fetch(hurricane.ORDER_URL).then(response => {
				response.text().then(csv => {
					Papa.parse(csv, {header: true}).data.forEach(zone => {
						if (zone.EVACUATE === 'YES') {
							this.zoneOrders[zone.ZONE] = true
							this.evacuations.push(zone.ZONE)
						}
					})
					callback(this)
				})
			})
		})
  }
	/** 
	 * @desc Method to return evacuation message for the provided location
	 * @public 
	 * @method
	 * @param {nyc.Locate.Result} location
	 * @return {string} An HTML message
	 */
	locationMsg(location, zone) {
		const name = location.name.replace(/,/, '<br>')
		// only get zone from zone layer until geosupport is updated
		if (hurricane.USE_GEOCLIENT_ZONE) {
			const data = location.data || {}
			zone = zone || data.hurricaneEvacuationZone
		}
		if (zone) {
			if (zone === hurricane.SURFACE_WATER_ZONE) {
				zone = '1'
			}
			if (zone === hurricane.NO_ZONE) {
				return this.message('location_no_zone', {
					name: name, 
					oem_supplied: this.message('user_in_x_zone')
				})
			} else {
				return this.message('location_zone_order', { 
					order: this.zoneMsg(zone), 
					name: name, 
					oem_supplied: this.message('user_zone', {zone: zone})
				})			
			}
		}
	}
	/** 
	 * @desc Method to return message for when zone cannot be determined the provided location
	 * @public 
	 * @method
	 * @param {nyc.Locate.Result} location
	 * @return {string} An HTML message
	 */
	unkownZone(location) {
		const name = location.name.replace(/,/, '<br>')
		return this.message('location_zone_unkown', { 
			name: name, 
			oem_supplied: this.message('user_zone_unkown')
		})
	}
	/** 
	 * @desc Method to return evacuation message for the provided location
	 * @public 
	 * @method
	 * @param {string} zone
	 * @return {string}
	 */
	zoneMsg(zone) {
		if (this.zoneOrders[zone]){
			return this.message('yes_order', {
				oem_supplied: this.message('evac_order')
			})
		}else{
			return this.message('no_order', {
				oem_supplied: this.message('no_evac_order')
			})
		}
	}
}

/**
 * @desc Callback for {@link module:hurricane/Content~Content}
 * @public
 * @callback module:hurricane/Content~Content#callback
 * @param {module:hurricane/Content~Content} content The finalized instance
 */

export default Content