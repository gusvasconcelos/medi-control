import Auth from './Auth'
import Medication from './Medication'
import Metrics from './Metrics'
import Pulse from './Pulse'
import Horizon from './Horizon'

const Web = {
    Auth: Object.assign(Auth, Auth),
    Medication: Object.assign(Medication, Medication),
    Metrics: Object.assign(Metrics, Metrics),
    Pulse: Object.assign(Pulse, Pulse),
    Horizon: Object.assign(Horizon, Horizon),
}

export default Web