import MedicationInteractionController from './MedicationInteractionController'
import MedicationController from './MedicationController'

const Medication = {
    MedicationInteractionController: Object.assign(MedicationInteractionController, MedicationInteractionController),
    MedicationController: Object.assign(MedicationController, MedicationController),
}

export default Medication