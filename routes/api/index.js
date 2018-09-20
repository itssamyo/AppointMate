var express = require('express'); // Get the module
var app = express(); // Create express by calling the prototype in var express
const router = express.Router();

const appointmentController = require('../../controllers/appointments')
const slotController = require('../../controllers/slot')

router.get('/appointments', appointmentController.all);
router.get('/retrieveSlots', slotController.all);
router.post('/appointmentCreate', appointmentController.create);


module.exports = router;
