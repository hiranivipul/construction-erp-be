    export enum ProjectStatus {
    PENDING = 'pending',
    CONFIRM = 'confirm',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    ON_HOLD = 'on_hold',
    LEAVE = 'leave',
    CANCELLED = 'cancelled',
}


// Export the same values for JavaScript files
export const ProjectStatusValues = {
    PENDING: ProjectStatus.PENDING,
    CONFIRM: ProjectStatus.CONFIRM,
    ONGOING: ProjectStatus.ONGOING,
    COMPLETED: ProjectStatus.COMPLETED,
    ON_HOLD: ProjectStatus.ON_HOLD,
    LEAVE: ProjectStatus.LEAVE,
    CANCELLED: ProjectStatus.CANCELLED,
};
