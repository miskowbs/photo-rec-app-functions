const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();


admin.initializeApp(functions.config().firebase);

exports.annotateImage = functions.database.ref('/searches/{searchId}').onCreate(event => {
    const object = event.data;
    const filePath = object.name;

    client.labelDetection(filePath).then(results => {
        const labels = results[0].labelAnnotations;

        labels.foreach(label => {
            event.data.ref.child('tags').push().set(label.description)
        })
    })
})
