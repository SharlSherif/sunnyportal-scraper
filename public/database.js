const firebase = require('firebase');
const db = firebase.initializeApp(
    {
        apiKey: 'AAAAwrBLIe0:APA91bEbMrrVmrOBPSWcQh6q5YRrUrdcgWID9URiJiqKu72R7ILcS5YNLxCajVEONLLhOdIEUT4bNEQmydtK2tU5MCN1LHD_GEmo0YpMWLbAOj9kjvxUQu2q0WMa9awpmjp9jGv9d4mL',
        // authDomain: 'localhost',
        databaseURL: 'https://sunnyportal-61f00.firebaseio.com/',
        projectId: 'sunnyportal-61f00',
        storageBucket: 'gs://sunnyportal-61f00.appspot.com',
        messagingSenderId: '836181369325'
    }
);

const addUser = (email, password) => {
    db.database().ref('users').set({
        password,
        email
    });
}

const liveData = obj => {
    console.log(obj)
    db.database().ref('plantfeed').set({
        location: obj.location,
        power: obj.power,
        co2: obj.co2,
        weather: obj.weather,
        energy: obj.energy
    });
}

module.exports = {addUser, liveData};