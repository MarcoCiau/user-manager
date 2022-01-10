import { Router } from "express";
import * as clientController from "../controllers/client";
import * as clientValidator from "../middlewares/client.validator";
const router = Router();

router.get('/', clientController.getClients);
router.get('/:id', clientValidator.isMongoId(), clientValidator.checkForErrors, clientController.getClient);
router.post('/', clientValidator.validateBodyParams(), clientValidator.checkForErrors, clientController.createClient);
router.put('/:id', clientValidator.isMongoId(), clientValidator.validateBodyParams(), clientValidator.checkForErrors, clientController.updateClient);
router.delete('/:id', clientValidator.isMongoId(), clientValidator.checkForErrors, clientController.deleteClient);

export default router;