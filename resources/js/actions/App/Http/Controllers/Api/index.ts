import UserMedicationController from './UserMedicationController'
import FileController from './FileController'
import MedicationLogController from './MedicationLogController'
import CaregiverPatientController from './CaregiverPatientController'
import NotificationPreferenceController from './NotificationPreferenceController'
import NotificationController from './NotificationController'
import OneSignalController from './OneSignalController'
import ChatController from './ChatController'
import UserController from './UserController'
import RoleController from './RoleController'
import PermissionController from './PermissionController'

const Api = {
    UserMedicationController: Object.assign(UserMedicationController, UserMedicationController),
    FileController: Object.assign(FileController, FileController),
    MedicationLogController: Object.assign(MedicationLogController, MedicationLogController),
    CaregiverPatientController: Object.assign(CaregiverPatientController, CaregiverPatientController),
    NotificationPreferenceController: Object.assign(NotificationPreferenceController, NotificationPreferenceController),
    NotificationController: Object.assign(NotificationController, NotificationController),
    OneSignalController: Object.assign(OneSignalController, OneSignalController),
    ChatController: Object.assign(ChatController, ChatController),
    UserController: Object.assign(UserController, UserController),
    RoleController: Object.assign(RoleController, RoleController),
    PermissionController: Object.assign(PermissionController, PermissionController),
}

export default Api