import DashboardController from './DashboardController'
import JobsController from './JobsController'
import BatchesController from './BatchesController'
import MetricsController from './MetricsController'
import MonitoringController from './MonitoringController'

const Horizon = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    JobsController: Object.assign(JobsController, JobsController),
    BatchesController: Object.assign(BatchesController, BatchesController),
    MetricsController: Object.assign(MetricsController, MetricsController),
    MonitoringController: Object.assign(MonitoringController, MonitoringController),
}

export default Horizon