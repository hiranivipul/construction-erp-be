export interface CreateExpenseDto {
    date?: Date;
    expense_scope: 'project' | 'company';
    project_id?: string;
    description?: string | null;
    amount: number;
}

export interface UpdateExpenseDto {
    date?: Date;
    expense_scope?: 'project' | 'company';
    project_id?: string;
    description?: string | null;
    amount?: number;
} 