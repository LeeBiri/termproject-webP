window.initMap = async function () {
	const startPlace = { lat: 37.5665, lng: 126.978 }; // 서울을 중심으로 지도를 표시
	const myMap = new google.maps.Map(document.getElementById("map"), {
		center: startPlace,
		zoom: 8,
	});

	const infoBox = new google.maps.InfoWindow();

	let allPins = [];
	let stuffToShow = [];

	try {
		const getData = await fetch("/predict-events");
		stuffToShow = await getData.json();

		// 마커 찍기
		stuffToShow.forEach((event) => putPin(event, myMap, allPins, infoBox));
	} catch (error) {
		alert("이벤트를 불러오지 못함");
	}

	// 핀 추가하기
	function putPin(event, myMap, allPins, infoBox) {
		const where = {
			lat: parseFloat(event.latitude),
			lng: parseFloat(event.longitude),
		};

		// 좌표 확인
		if (isNaN(where.lat) || isNaN(where.lng)) {
			console.warn("좌표가 잘못됨");
			return;
		}

		const pin = new google.maps.Marker({
			position: where,
			map: myMap,
			title: event.eventName,
		});

		// 핀 클릭 시 정보 표시
		pin.addListener("click", () => {
			const when = new Date(event.date).toLocaleString();
			infoBox.setContent(`
                <div>
                    <h3>${event.eventName}</h3>
                    <p><b>Date:</b> ${when}</p>
                </div>
            `);
			infoBox.open(myMap, pin);
		});

		allPins.push(pin);
	}

	// 이벤트 검색
	function showNearby(centerPoint) {
		const range = 1000000;

		allPins.forEach((pin) => pin.setMap(null));
		allPins = [];

		// 날짜 검색
		const filteredStuff = checkDates(stuffToShow);
		const closeStuff = [];

		filteredStuff.forEach((event) => {
			const position = new google.maps.LatLng(event.latitude, event.longitude);

			// 일식
			if (event.eventName === "일식") {
				putPin(event, myMap, allPins, infoBox);
				closeStuff.push(event);
				return;
			}

			// 월식 범위
			if (event.eventName === "월식" && event.latitude >= -60 && event.latitude <= 60 && event.longitude >= -80 && event.longitude <= 80) {
				putPin(event, myMap, allPins, infoBox);
				closeStuff.push(event);
				return;
			}

			// 유성우
			const distance = google.maps.geometry.spherical.computeDistanceBetween(centerPoint, position);
			if (distance <= range) {
				putPin(event, myMap, allPins, infoBox);
				closeStuff.push(event);
			}
		});

		// 화면 업데이트
		updateEventList(closeStuff);
	}

	// 날짜 필터링
	function checkDates(stuff) {
		const start = new Date(document.getElementById("start-date").value);
		const end = new Date(document.getElementById("end-date").value);

		if (isNaN(start.getTime()) || isNaN(end.getTime())) return stuff;

		return stuff.filter((event) => {
			const thisDate = new Date(event.date);
			return thisDate >= start && thisDate <= end;
		});
	}

	// 이벤트 목록 업데이트
	function updateEventList(filteredStuff) {
		const listBox = document.getElementById("event-list");
		listBox.innerHTML = "";

		if (filteredStuff.length === 0) {
			listBox.innerHTML = "<p style='text-align: center; padding: 10px;'>이벤트가 없습니다.</p>";
			return;
		}

		filteredStuff.forEach((event) => {
			const listItem = document.createElement("div");
			listItem.style.borderBottom = "1px solid #ddd";
			listItem.style.padding = "10px 0";

			const eventDate = new Date(event.date).toLocaleDateString();

			listItem.innerHTML = `
				<h4 style="margin: 0; font-size: 16px;">${event.eventName}</h4>
				<p style="margin: 5px 0;">${eventDate}</p>
			`;
			listBox.appendChild(listItem);
		});
	}

	document.getElementById("filter-button").addEventListener("click", () => {
		//날짜 필터링
		const here = myMap.getCenter();
		showNearby(here);
	});

	window.searchCity = function () {
		// 도시 필터링
		const searchFor = document.getElementById("city-search").value;
		const findPlace = new google.maps.Geocoder();

		findPlace.geocode({ address: searchFor }, (results, status) => {
			if (status === "OK") {
				const here = results[0].geometry.location;
				myMap.setCenter(here);
				myMap.setZoom(10);
				showNearby(here);
			} else {
				alert("도시를 찾을 수 없습니다.");
			}
		});
	};
};
