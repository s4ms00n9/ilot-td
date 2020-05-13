<template>
	<div id="l-maps"></div>
</template>

<script>
import L from 'leaflet';
import { mapGetters } from 'vuex';

export default {
	data: () => ({
		myMap: null,
		markers: [],
  }),

  computed: {
		...mapGetters(['mapData']),
		initialCoordinates() {
			return [this.mapData[0].Latitude, this.mapData[0].Longitude];
		},
		maxAltitude() {
			return Math.max(...this.mapData.map(d => d.Altitude));
		},
		minAltitude() {
			return Math.min(...this.mapData.map(d => d.Altitude));
		},
		altInterval() {
			return this.maxAltitude - this.minAltitude;
		},
		maxSpeedOverGround() {
			return Math.max(...this.mapData.map(d => d.SpeedOverGround));
		},
		minSpeedOverGround() {
			return Math.min(...this.mapData.map(d => d.SpeedOverGround));
		},
		speedInterval() {
			return this.maxSpeedOverGround - this.minSpeedOverGround;
		}
  },
  mounted() {
    this.initMap();
  },

  methods: {
		initMap() {
			this.myMap = L.map('l-maps');
			this.mapData.forEach(d => {
				let marker = L.circleMarker([d.Latitude, d.Longitude], {
					weight: 2,
					color: this.getAltitudeColor(d.Altitude),
					radius: this.getSpeedOverGroundSize(d.SpeedOverGround),
					fillOpacity: 0.8
				});
				marker.addTo(this.myMap);
				marker.bindPopup(this.getPopupHtml(d)).openPopup();
				this.markers.push(marker);
			});
			let markersGroup = new L.featureGroup(this.markers);
			this.myMap.fitBounds(markersGroup.getBounds());
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.myMap);
		},
		getPopupHtml(d) {
			return `<b>Coordinates</b><br>${d.Latitude}, ${d.Longitude}<br><b>Altitude</b><br>${d.Altitude}
				<br><b>Speed Over Ground</b><br>${d.SpeedOverGround}`
		},
		getAltitudeColor(alt) {
			if (this.altInterval > 0) {
				if (alt >= this.minAltitude && alt < 0.2 * this.altInterval) return '#660000';
				else if (alt >= 0.2 * this.altInterval && alt < 0.4 * this.altInterval) return '#663300';
				else if (alt >= 0.4 * this.altInterval && alt < 0.6 * this.altInterval) return '#666600';
				else if (alt >= 0.6 * this.altInterval && alt < 0.8 * this.altInterval) return '#669900';
				else return '#66CC00';
			}
			return 'black';
		},
		getSpeedOverGroundSize(speed) {
			if (this.speedInterval > 0) {
				if (speed >= this.minSpeedOverGround && speed < 0.1 * this.speedInterval) return 4;
				else if (speed >= 0.1 * this.speedInterval && speed < 0.2 * this.speedInterval) return 6;
				else if (speed >= 0.2 * this.speedInterval && speed < 0.3 * this.speedInterval) return 8;
				else if (speed >= 0.3 * this.speedInterval && speed < 0.4 * this.speedInterval) return 10;
				else if (speed >= 0.4 * this.speedInterval && speed < 0.5 * this.speedInterval) return 12;
				else if (speed >= 0.5 * this.speedInterval && speed < 0.6 * this.speedInterval) return 14;
				else if (speed >= 0.6 * this.speedInterval && speed < 0.7 * this.speedInterval) return 16;
				else if (speed >= 0.7 * this.speedInterval && speed < 0.8 * this.speedInterval) return 18;
				else if (speed >= 0.8 * this.speedInterval && speed < 0.9 * this.speedInterval) return 20;
				else return 28;
			}
			return 1;
		}
  }
}
</script>
<style scoped>
@import "~leaflet/dist/leaflet.css";
#l-maps {
  margin-top: 30px;
  width: 800px;
  height: 400px;
}
</style>
