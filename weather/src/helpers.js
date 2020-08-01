import axios from 'axios'
const defaultIdPriority = [6, 1, 2, 3, 5, 7, 4, 17, 19, 26, 31, 27, 13, 22, 28, 11, 10, 14]

export const determineBbox = (lat, lng, radius = 30) => {
  let latoffset = radius / 69.047
  let lngoffset = radius / (69.17 * Math.cos(lat * 0.01745))
  return [lng - lngoffset, lat - latoffset, lng + lngoffset, lat + latoffset]
}

const geoDistance = (pt1, pt2) => {
	const lat1 = pt1.lat, lng1 = pt1.lng, lat2 = pt2.lat, lng2 = pt2.lng;
	if ((lat1 === lat2) && (lng1 === lng2)) {
		return 0;
	} else {
		const radlat1 = Math.PI * lat1/180;
		const radlat2 = Math.PI * lat2/180;
		const theta = lng1-lng2;
		const radtheta = Math.PI * theta/180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist;
	}
}

const sortByDistance = (a, b) => {
	const x = a.distance, y = b.distance;
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

const selectId = (sids, priority) => {
	var bestPriority = 999, bestId = null;
	sids.forEach(function(id) {
		let split_id = id.split(" ");
		let network = parseInt(split_id[1], 10);
		let priority_index = priority.findIndex(function(p) {
			return p === network
		});
		if (priority_index >= 0 && priority_index < bestPriority) {
			bestPriority = priority_index;
			bestId = id.split(" ")[0];
		}
	})
	return bestId;
}

const getInfoFromMeta = (metaResults, idPriority, srchCenter) => {
	const whichVdr = metaResults.hasOwnProperty("valid_daterange") ? metaResults.valid_daterange.findIndex(m => { return m.length > 0 }) : -1;
	if (whichVdr >= 0) {
		const sid = selectId(metaResults.sids, idPriority);
		if (sid) {
			return {
				id: sid,
				whichVdr: whichVdr,
				name: metaResults.name,
				distance: srchCenter ? geoDistance(srchCenter, {lat: metaResults.ll[1], lng: metaResults.ll[0]}) : null,
				position: [metaResults.ll[1], metaResults.ll[0]],
				vdr: metaResults.valid_daterange[whichVdr],
				tooltip: metaResults.name + "<br/>" + metaResults.valid_daterange[whichVdr][0] + " to " + metaResults.valid_daterange[whichVdr][1],
			};
		};
	}
	return null;
}

export function processMetaResults(res, srchCenter=null, idPriority=defaultIdPriority) {
	let nearbyStns = [];
	for (let j = 0; j < res.data.meta.length; j += 1) {
		const metaObj = getInfoFromMeta(res.data.meta[j], idPriority, srchCenter);
		if (metaObj) {
			nearbyStns.push(metaObj);
		}
	}
	nearbyStns.sort(sortByDistance);
	return nearbyStns;
}

export const getDailyData = (id, date, attr, normal=false) =>{
  let params ={
    sid: id,
    meta: "name",
    date: date,
    elems: [{name: attr}]
  }
  if (normal) {
    params.elems = [{name: attr, normal: "1"}]
  }
  return axios.get("http://data.rcc-acis.org/StnData", {params: {params: params}}).then(res => {
    return res
  }).catch(err => {return "NA"})
}