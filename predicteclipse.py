import ephem
from datetime import datetime, timedelta
import pymongo

client = pymongo.MongoClient("mongodb+srv://lodoa:Qlsl1246!@cluster0.jgz7q.mongodb.net/")
db = client["test"]  
collection3 = db["predictevents"]

def calculate_eclipse_positions(eclipse_time, moon, sun, observer):
    moon.compute(observer)
    sun.compute(observer)

    moon_lat = moon.alt  
    moon_lon = moon.az  
    sun_lat = sun.alt
    sun_lon = sun.az

    avg_lat = (moon_lat + sun_lat) / 2
    avg_lon = (moon_lon + sun_lon) / 2

    return avg_lat, avg_lon

def save_to_mongodb(eclipse_type, eclipse_time, latitude, longitude):
    existing_record = collection3.find_one({
        'date': eclipse_time,
        'eventName': eclipse_type,
    })
    if existing_record:
        print(f"중복 데이터 발견: {eclipse_type} - {eclipse_time}는 이미 저장되어 있습니다.")
    else:
        collection3.insert_one({
            'date': eclipse_time,
            'eventName': eclipse_type,
            'latitude': latitude,
            'longitude': longitude
        })
        print(f"{eclipse_type} 데이터가 MongoDB에 저장되었습니다.")

def predict_solar_eclipses(start_time, end_time):
    curtime = start_time
    moon = ephem.Moon()
    sun = ephem.Sun()
    observer = ephem.Observer()
    observer.elevation = -6371000 
    observer.pressure = 0 

    while curtime <= end_time:
        observer.date = curtime.strftime('%Y/%m/%d %H:%M:%S')
        moon.compute(observer)
        sun.compute(observer)

        sep = abs((float(ephem.separation(moon, sun)) / 0.01745329252))

        if sep < 1.59754941:  # 일식 조건
            avg_lat, avg_lon = calculate_eclipse_positions(curtime, moon, sun, observer)
            print(f"일식 발생: {curtime.strftime('%Y/%m/%d %H:%M:%S')} - 중앙 좌표 (위도: {avg_lat}, 경도: {avg_lon})")
            save_to_mongodb("일식", curtime, avg_lat, avg_lon) 
            curtime += timedelta(days=1)
        else:
            curtime += timedelta(minutes=5)

def predict_lunar_eclipses(start_time, end_time):
    curtime = start_time
    moon = ephem.Moon()
    sun = ephem.Sun()
    observer = ephem.Observer()
    observer.elevation = -6371000 
    observer.pressure = 0

    while curtime <= end_time:
        observer.date = curtime.strftime('%Y/%m/%d %H:%M:%S')
        moon.compute(observer)
        sun.compute(observer)

        sep = abs((float(ephem.separation(moon, sun)) / 0.01745329252) - 180)

        if sep < 0.9:  # 월식 조건
            avg_lat, avg_lon = calculate_eclipse_positions(curtime, moon, sun, observer)
            print(f"월식 발생: {curtime.strftime('%Y/%m/%d %H:%M:%S')} - 중앙 좌표 (위도: {avg_lat}, 경도: {avg_lon})")
            save_to_mongodb("월식", curtime, avg_lat, avg_lon)
            curtime += timedelta(days=1)
        else:
            curtime += timedelta(hours=1)

if __name__ == "__main__":
    current_time = datetime.now()
    start_time = current_time
    end_time = current_time + timedelta(days=365)  # 1년 후

    predict_solar_eclipses(start_time, end_time)
    predict_lunar_eclipses(start_time, end_time)
