module.exports = {
  content: {
    post_storm: 'NO',
    banner_text: 'hurricane evacuation zone finder',
    splash_msg: 'No evacuation order currently in effect',
    btn_text: '<span>view map</span><br><span>to find your evacuation zone</span>',
    centers_tab: 'evacuation centers',
    filter_centers: 'centers',
    centers_msg: 'If you are required to evacuate, it is recommended that you shelter at the home of friends or family outside of the evacuation area. If you wish to go to a public facility, select any evacuation center from the following list and click for travel directions.',
    legend_msg: '<p>Use the NYC Hurricane Evacuation Zone Finder to find out if your address is in a hurricane evacuation zone. The best way to be prepared for the possibility of a hurricane evacuation is to know your evacuation zone, and plan your destination and travel routes ahead of time. Zones are color-coded and labeled 1, 2, 3, 4, 5, and 6 when represented on a map.</p><p>Information on evacuation centers is subject to change. Please revisit this site for updated reports on building status and wheelchair accessibility features.</p>',
    legend_center: 'evacuation center',
    user_in_x_zone: 'You are not located in an Evacuation Zone',
    user_zone_unkown: 'Zone Finder cannot determine Zone for your address.<br>Try alternative address or determine Zone by examining map and clicking on your location.',
    user_zone_unkown_311: 'Zone Finder cannot determine Zone for your address.<br>Try alternative address.',
    user_zone: 'You are located in Zone ${zone}',
    evac_order: 'You are required to evacuate',
    no_evac_order: 'No evacuation order currently in effect'    
  },
  oneOrder: 'ZONE,EVACUATE\n1,NO\n2,NO\n3,YES\n4,NO\n5,NO\n6,NO',
  twoOrders: 'ZONE,EVACUATE\n1,YES\n2,NO\n3,YES\n4,NO\n5,NO\n6,NO',
  noOrder: 'ZONE,EVACUATE\n1,NO\n2,NO\n3,NO\n4,NO\n5,NO\n6,NO'
}




