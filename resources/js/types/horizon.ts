/**
 * Horizon Status Types
 */
export type HorizonStatus = 'running' | 'paused' | 'inactive';
export type JobStatus = 'pending' | 'completed' | 'failed' | 'reserved';
export type SupervisorStatus = 'running' | 'paused' | 'inactive';

/**
 * Dashboard Stats
 */
export interface HorizonDashboardStats {
    failedJobs: number;
    jobsPerMinute: number;
    pausedMasters: number;
    periods: {
        failedJobs: number;
        recentJobs: number;
    };
    processes: number;
    queueWithMaxRuntime: string;
    queueWithMaxThroughput: string;
    recentJobs: number;
    status: HorizonStatus;
    wait: Record<string, number>;
}

/**
 * Workload
 */
export interface HorizonWorkloadItem {
    name: string;
    length: number;
    wait: number;
    processes: number;
}

/**
 * Supervisors
 */
export interface HorizonSupervisor {
    name: string;
    master: string;
    status: SupervisorStatus;
    processes: Record<string, number>;
    options: {
        queue: string;
        balance: string | null;
    };
    pid: number;
}

export interface HorizonMasterSupervisor {
    name: string;
    status: 'running' | 'paused';
    supervisors: HorizonSupervisor[];
    pid?: number;
}

/**
 * Jobs
 */
export interface HorizonJobPayload {
    displayName: string;
    job: string;
    maxTries?: number | null;
    timeout?: number | null;
    tags?: string[];
    pushedAt?: string;
}

export interface HorizonJob {
    id: string;
    name: string;
    queue: string;
    status: JobStatus;
    payload: HorizonJobPayload;
    completed_at?: string | number;
    reserved_at?: string | number;
    pushed_at?: string | number;
    failed_at?: string | number;
    exception?: string;
    context?: Record<string, unknown>;
    retried_by?: HorizonRetryAttempt[];
}

export interface HorizonRetryAttempt {
    id: string;
    retried_at: string;
}

export interface HorizonJobsResponse {
    jobs: HorizonJob[];
    total: number;
}

/**
 * Batches
 */
export interface HorizonBatch {
    id: string;
    name: string;
    totalJobs: number;
    pendingJobs: number;
    failedJobs: number;
    processedJobs: number;
    progress: number;
    finishedAt: string | null;
    createdAt: string;
    cancelledAt: string | null;
}

export interface HorizonBatchesResponse {
    batches: HorizonBatch[];
}

export interface HorizonBatchDetailResponse {
    batch: HorizonBatch | null;
    failedJobs: HorizonJob[];
}

/**
 * Metrics
 */
export interface HorizonMetricSnapshot {
    time: string;
    runtime: number;
    throughput: number;
}

export interface HorizonJobMetrics {
    name: string;
    snapshots: HorizonMetricSnapshot[];
}

export interface HorizonQueueMetrics {
    name: string;
    snapshots: HorizonMetricSnapshot[];
}

/**
 * Monitoring (Tags)
 */
export interface HorizonMonitoredTag {
    tag: string;
    count: number;
}

/**
 * Page Props
 */
export interface HorizonDashboardPageProps {
    stats: HorizonDashboardStats;
    workload: HorizonWorkloadItem[];
    masters: HorizonMasterSupervisor[];
}

export interface HorizonJobsPageProps {
    jobs: HorizonJob[];
    total: number;
    status: JobStatus | 'silenced';
    page: number;
    perPage: number;
}

export interface HorizonBatchesPageProps {
    batches: HorizonBatch[];
}

export interface HorizonBatchDetailPageProps {
    batch: HorizonBatch | null;
    failedJobs: HorizonJob[];
}

export interface HorizonMetricsJobsPageProps {
    jobs: string[];
    selectedJob: string | null;
    snapshots: HorizonMetricSnapshot[];
}

export interface HorizonMetricsQueuesPageProps {
    queues: string[];
    selectedQueue: string | null;
    snapshots: HorizonMetricSnapshot[];
}

export interface HorizonMonitoringPageProps {
    tags: HorizonMonitoredTag[];
}
