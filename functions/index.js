const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();


admin.initializeApp(functions.config().firebase);

exports.annotateImage = functions.database.ref('/searches/{searchId}/url').onCreate(event => {
    const filePath = event.data.val();
    console.log('url: ' + filePath);

    
    client
    .labelDetection(filePath)
    .then(results => {
        const labels = results[0].labelAnnotations;
        console.log('Labels: ');

        labels.forEach(label => {
            console.log(label.description);
            event.data.ref.parent.child('tags').push().set(label.description)
        });
        return labels;
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
});
